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
        String originalFileName = file.getOriginalFilename();
        String fileName = UUID.randomUUID().toString() + "_" + originalFileName;

        if (cloudinary != null) {
            try {
                // Explicitly detect image extensions to force 'image' type and prevent 'raw'
                // fallback
                String resourceType = "auto";
                if (originalFileName != null) {
                    String lowerName = originalFileName.toLowerCase();
                    if (lowerName.endsWith(".pdf")) {
                        resourceType = "raw";
                    } else if (lowerName.endsWith(".png") || lowerName.endsWith(".jpg") ||
                            lowerName.endsWith(".jpeg") || lowerName.endsWith(".gif") ||
                            lowerName.endsWith(".svg") || lowerName.endsWith(".webp") ||
                            lowerName.endsWith(".ico")) {
                        resourceType = "image";
                    } else if (subDir.contains("resume") || subDir.contains("certificates")
                            || subDir.contains("marks-cards")) {
                        // Fallback for PDFs if extension is missing but uploaded to document folders
                        resourceType = "raw";
                    }
                } else if (subDir.contains("resume") || subDir.contains("certificates")
                        || subDir.contains("marks-cards")) {
                    resourceType = "raw";
                }

                @SuppressWarnings("unchecked")
                Map<Object, Object> uploadResult = (Map<Object, Object>) cloudinary.uploader().upload(file.getBytes(),
                        ObjectUtils.asMap(
                                "folder", "portfolio/" + subDir,
                                "resource_type", resourceType));

                return (String) uploadResult.get("secure_url");
            } catch (IOException ex) {
                throw new RuntimeException("Could not store file to Cloudinary: " + fileName, ex);
            }
        }
        // ... (rest of the code for local storage stays same)
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
                // Detect resource type from URL or assumed
                String resourceType = filePath.contains("/raw/upload/") ? "raw" : "image";

                // Extract public_id from Cloudinary URL
                // Example URL:
                // https://res.cloudinary.com/cloud_name/image/upload/v12345/portfolio/subDir/public_id.jpg
                // https://res.cloudinary.com/cloud_name/raw/upload/v12345/portfolio/subDir/public_id.pdf

                String uploadMarker = "/" + resourceType + "/upload/";
                String[] parts = filePath.split(uploadMarker);

                if (parts.length > 1) {
                    String afterUpload = parts[1];
                    // Skip version (v1234567/) if present
                    if (afterUpload.startsWith("v")) {
                        afterUpload = afterUpload.substring(afterUpload.indexOf("/") + 1);
                    }

                    String publicId = afterUpload;

                    // IF it's NOT a 'raw' resource, remove extension
                    if (!"raw".equals(resourceType)) {
                        int dotIndex = publicId.lastIndexOf(".");
                        if (dotIndex != -1) {
                            publicId = publicId.substring(0, dotIndex);
                        }
                    }

                    cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("resource_type", resourceType));
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
