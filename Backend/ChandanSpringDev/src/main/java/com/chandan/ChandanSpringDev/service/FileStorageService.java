package com.chandan.ChandanSpringDev.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;
    private final Cloudinary cloudinary;

    public FileStorageService(
            @Value("${file.upload-dir:uploads}") String uploadDir,
            @Value("${cloudinary.cloud-name:}") String cloudName,
            @Value("${cloudinary.api-key:}") String apiKey,
            @Value("${cloudinary.api-secret:}") String apiSecret) {

        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();

        if (!cloudName.isEmpty() && !apiKey.isEmpty() && !apiSecret.isEmpty()) {
            this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                    "cloud_name", cloudName,
                    "api_key", apiKey,
                    "api_secret", apiSecret,
                    "secure", true));
        } else {
            this.cloudinary = null;
            try {
                Files.createDirectories(this.fileStorageLocation);
            } catch (Exception ex) {
                throw new RuntimeException("Could not create the directory where the uploaded files will be stored.",
                        ex);
            }
        }
    }

    public String storeFile(MultipartFile file, String subDir) {
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();

        if (cloudinary != null) {
            try {
                // For PDFs (resumes/certificates), use 'auto' resource type
                @SuppressWarnings("unchecked")
                Map<String, Object> uploadResult = (Map<String, Object>) cloudinary.uploader().upload(file.getBytes(),
                        ObjectUtils.asMap(
                                "folder", "portfolio/" + subDir,
                                "resource_type", "auto" // 'auto' handles images and PDFs well
                        ));

                return (String) uploadResult.get("secure_url");
            } catch (IOException ex) {
                throw new RuntimeException("Could not store file to Cloudinary: " + fileName, ex);
            }
        }

        try {
            if (fileName.contains("..")) {
                throw new RuntimeException("Sorry! Filename contains invalid path sequence " + fileName);
            }

            Path targetLocation = this.fileStorageLocation.resolve(subDir).resolve(fileName);
            Files.createDirectories(targetLocation.getParent());
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return subDir + "/" + fileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }

    public void deleteFile(String filePath) {
        if (cloudinary != null && filePath.startsWith("https://res.cloudinary.com")) {
            try {
                // Extract public_id from Cloudinary URL
                // Example URL:
                // https://res.cloudinary.com/cloud_name/image/upload/v12345/portfolio/subDir/public_id.jpg
                // Logic: Find everything after /upload/v[digits]/, remove the extension
                String[] parts = filePath.split("/upload/");
                if (parts.length > 1) {
                    String afterUpload = parts[1];
                    // Skip version (v1234567/) if present
                    if (afterUpload.startsWith("v")) {
                        afterUpload = afterUpload.substring(afterUpload.indexOf("/") + 1);
                    }

                    // Remove file extension
                    String publicId = afterUpload;
                    int dotIndex = publicId.lastIndexOf(".");
                    if (dotIndex != -1) {
                        // Check if it's not a 'raw' file (where we might want to keep the extension)
                        // Cloudinary images don't need the extension in public_id for deletion
                        // But let's be safe and try to delete with/without
                        publicId = publicId.substring(0, dotIndex);
                    }

                    cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
                }
                return;
            } catch (Exception ex) {
                throw new RuntimeException("Could not delete file from Cloudinary: " + filePath, ex);
            }
        }

        try {
            Path targetLocation = this.fileStorageLocation.resolve(filePath);
            Files.deleteIfExists(targetLocation);
        } catch (IOException ex) {
            throw new RuntimeException("Could not delete file " + filePath, ex);
        }
    }
}
