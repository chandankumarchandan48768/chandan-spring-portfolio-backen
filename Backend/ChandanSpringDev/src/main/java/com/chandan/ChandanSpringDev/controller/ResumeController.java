package com.chandan.ChandanSpringDev.controller;

import com.chandan.ChandanSpringDev.model.Resume;
import com.chandan.ChandanSpringDev.repository.ResumeRepository;
import com.chandan.ChandanSpringDev.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    private static final String RESUME_ID = "main-resume";

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getResumeStatus() {
        Optional<Resume> resume = resumeRepository.findById(RESUME_ID);
        Map<String, Object> response = new HashMap<>();
        response.put("exists", resume.isPresent());
        response.put("url", resume.map(Resume::getUrl).orElse(null));
        return ResponseEntity.ok(response);
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
