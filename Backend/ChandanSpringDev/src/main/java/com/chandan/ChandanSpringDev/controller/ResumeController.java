package com.chandan.ChandanSpringDev.controller;

import com.chandan.ChandanSpringDev.model.Resume;
import com.chandan.ChandanSpringDev.repository.ResumeRepository;
import com.chandan.ChandanSpringDev.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private ResumeRepository resumeRepository;

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    private static final String RESUME_ID = "main-resume";

    /**
     * Returns resume metadata (exists + URL).
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getResumeStatus() {
        Optional<Resume> resume = resumeRepository.findById(RESUME_ID);
        Map<String, Object> response = new HashMap<>();
        response.put("exists", resume.isPresent());
        response.put("url", resume.map(Resume::getUrl).orElse(null));
        return ResponseEntity.ok(response);
    }

    /**
     * Serves the resume file for download.
     * - For Cloudinary URLs: redirects with fl_attachment flag so the browser
     * downloads the file.
     * - For local files: streams with Content-Disposition: attachment header.
     */
    @GetMapping("/download")
    public ResponseEntity<?> downloadResume() {
        Optional<Resume> resumeOpt = resumeRepository.findById(RESUME_ID);
        if (resumeOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "No resume found. Please upload a resume first."));
        }

        String url = resumeOpt.get().getUrl();

        if (url == null || url.isBlank()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Resume URL is not set."));
        }

        // For Cloudinary hosted files: redirect with fl_attachment for forced download
        if (url.startsWith("https://res.cloudinary.com")) {
            String downloadUrl = url.replace("/upload/", "/upload/fl_attachment/");
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(downloadUrl))
                    .build();
        }

        // For locally stored files: stream the file
        try {
            Path filePath = Paths.get(uploadDir).resolve(url).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Resume file not found on server."));
            }

            String filename = filePath.getFileName().toString();
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Could not download resume: " + e.getMessage()));
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadResume(@RequestParam("file") MultipartFile file) {
        // Ensure it is a PDF
        if (file.isEmpty() || (file.getContentType() != null && !file.getContentType().equals("application/pdf")
                && !file.getOriginalFilename().toLowerCase().endsWith(".pdf"))) {
            return ResponseEntity.badRequest().body("Only PDF files are allowed.");
        }

        try {
            // Delete old one from Cloudinary if it exists in DB
            resumeRepository.findById(RESUME_ID).ifPresent(existing -> {
                fileStorageService.deleteFile(existing.getUrl());
            });

            String uploadedUrl = fileStorageService.storeFile(file, "resume");

            Resume resume = new Resume();
            resume.setId(RESUME_ID);
            resume.setUrl(uploadedUrl);
            resume.setUpdatedAt(System.currentTimeMillis());
            resumeRepository.save(resume);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Resume uploaded successfully");
            response.put("url", uploadedUrl);

            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Could not store resume. Please try again.");
        }
    }

    @DeleteMapping
    public ResponseEntity<?> deleteResume() {
        Optional<Resume> resume = resumeRepository.findById(RESUME_ID);
        if (resume.isPresent()) {
            fileStorageService.deleteFile(resume.get().getUrl());
            resumeRepository.deleteById(RESUME_ID);
            return ResponseEntity.ok().body(Map.of("message", "Resume deleted successfully"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "No resume found to delete"));
        }
    }
}
