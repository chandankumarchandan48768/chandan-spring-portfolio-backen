package com.chandan.ChandanSpringDev.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.chandan.ChandanSpringDev.model.Experience;
import com.chandan.ChandanSpringDev.repository.ExperienceRepository;

@Service
public class ExperienceService {

    @Autowired
    private ExperienceRepository repository;

    @Autowired
    private FileStorageService fileStorageService;

    public ResponseEntity<List<Experience>> getAllExperience() {
        return ResponseEntity.ok(repository.findAll());
    }

    public ResponseEntity<Experience> getExperienceById(String id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<Experience> addExperience(Experience experience) {
        if (experience.getCertificates() == null)
            experience.setCertificates(new ArrayList<>());
        return ResponseEntity.ok(repository.save(experience));
    }

    public ResponseEntity<Experience> updateExperience(String id, Experience experience) {
        return repository.findById(id)
                .map(existing -> {
                    experience.setId(id);
                    return ResponseEntity.ok(repository.save(experience));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<Void> deleteExperience(String id) {
        return repository.findById(id)
                .map(existing -> {
                    if (existing.getCertificates() != null)
                        existing.getCertificates().forEach(fileStorageService::deleteFile);
                    repository.deleteById(id);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<Experience> findExperienceByCompany(String company) {
        return repository.findByCompany(company)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<Experience> deleteByCompany(String company) {
        return repository.findByCompany(company)
                .map(experience -> {
                    if (experience.getCertificates() != null)
                        experience.getCertificates().forEach(fileStorageService::deleteFile);
                    repository.delete(experience);
                    return ResponseEntity.ok(experience);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<Experience> findExperienceByRole(String role) {
        return repository.findByRole(role)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<Experience> deleteByRole(String role) {
        return repository.findByRole(role)
                .map(experience -> {
                    if (experience.getCertificates() != null)
                        experience.getCertificates().forEach(fileStorageService::deleteFile);
                    repository.delete(experience);
                    return ResponseEntity.ok(experience);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    public Experience addCertificate(String id, MultipartFile file) {
        Experience exp = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Experience not found: " + id));
        String filePath = fileStorageService.storeFile(file, "exp-certificates");
        if (exp.getCertificates() == null)
            exp.setCertificates(new ArrayList<>());
        exp.getCertificates().add(filePath);
        return repository.save(exp);
    }

    public Experience removeCertificate(String id, String fileName) {
        Experience exp = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Experience not found: " + id));
        String filePath = "exp-certificates/" + fileName;
        if (exp.getCertificates() != null && exp.getCertificates().remove(filePath)) {
            fileStorageService.deleteFile(filePath);
        }
        return repository.save(exp);
    }
}
