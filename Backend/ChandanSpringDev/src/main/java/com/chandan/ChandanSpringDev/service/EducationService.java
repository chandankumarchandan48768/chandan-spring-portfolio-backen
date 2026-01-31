package com.chandan.ChandanSpringDev.service;

import com.chandan.ChandanSpringDev.model.Education;
import com.chandan.ChandanSpringDev.repository.EducationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class EducationService {
    
    @Autowired
    private EducationRepository repository;

    @Autowired
    private FileStorageService fileStorageService;
    
    public List<Education> getAllEducation() {
        return repository.findAll();
    }
    
    public Optional<Education> getEducationById(String id) {
        return repository.findById(id);
    }
    
    public Education addEducation(Education education) {
        if (education.getMarksCards() == null) education.setMarksCards(new java.util.ArrayList<>());
        if (education.getCertificates() == null) education.setCertificates(new java.util.ArrayList<>());
        return repository.save(education);
    }
    
    public Education updateEducation(String id, Education education) {
        education.setId(id);
        return repository.save(education);
    }
    
    public void deleteEducation(String id) {
        repository.findById(id).ifPresent(e -> {
            e.getMarksCards().forEach(fileStorageService::deleteFile);
            e.getCertificates().forEach(fileStorageService::deleteFile);
        });
        repository.deleteById(id);
    }

    public Optional<Education> findEducationByDegree(String degree) {
        return repository.findByDegree(degree);
    }

    public Optional<Education> findByInstitution(String institution) {
        return repository.findByInstitution(institution);
    }

    public Optional<Education> deleteByDegree(String degree) {
        Optional<Education> education = repository.findByDegree(degree);
        education.ifPresent(e -> {
            e.getMarksCards().forEach(fileStorageService::deleteFile);
            e.getCertificates().forEach(fileStorageService::deleteFile);
            repository.delete(e);
        });
        return education;
    }

    public Optional<Education> deleteByInstitution(String institution) {
        Optional<Education> education = repository.findByInstitution(institution);
        education.ifPresent(e -> {
            e.getMarksCards().forEach(fileStorageService::deleteFile);
            e.getCertificates().forEach(fileStorageService::deleteFile);
            repository.delete(e);
        });
        return education;
    }

    public Education addMarksCard(String id, org.springframework.web.multipart.MultipartFile file) {
        Education education = repository.findById(id).orElseThrow(() -> new RuntimeException("Education not found"));
        String filePath = fileStorageService.storeFile(file, "marks-cards");
        education.getMarksCards().add(filePath);
        return repository.save(education);
    }

    public Education removeMarksCard(String id, String fileName) {
        Education education = repository.findById(id).orElseThrow(() -> new RuntimeException("Education not found"));
        String filePath = "marks-cards/" + fileName;
        if (education.getMarksCards().remove(filePath)) {
            fileStorageService.deleteFile(filePath);
        }
        return repository.save(education);
    }

    public Education addCertificate(String id, org.springframework.web.multipart.MultipartFile file) {
        Education education = repository.findById(id).orElseThrow(() -> new RuntimeException("Education not found"));
        String filePath = fileStorageService.storeFile(file, "certificates");
        education.getCertificates().add(filePath);
        return repository.save(education);
    }

    public Education removeCertificate(String id, String fileName) {
        Education education = repository.findById(id).orElseThrow(() -> new RuntimeException("Education not found"));
        String filePath = "certificates/" + fileName;
        if (education.getCertificates().remove(filePath)) {
            fileStorageService.deleteFile(filePath);
        }
        return repository.save(education);
    }
}
