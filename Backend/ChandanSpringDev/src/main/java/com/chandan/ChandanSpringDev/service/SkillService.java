package com.chandan.ChandanSpringDev.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.chandan.ChandanSpringDev.model.Skills;
import com.chandan.ChandanSpringDev.repository.SkillRepository;

import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

@Service
public class SkillService {

    @Autowired
    private SkillRepository repository;

    @Autowired
    private FileStorageService fileStorageService;

    public List<Skills> getAllSkills() {
        return repository.findAll();
    }

    public Optional<Skills> getSkillById(String id) {
        return repository.findById(id);
    }

    public Skills addSkill(Skills skill) {
        if (skill.getCertificates() == null)
            skill.setCertificates(new ArrayList<>());
        return repository.save(skill);
    }

    public Skills updateSkill(String id, Skills skill) {
        if (repository.existsById(id)) {
            skill.setId(id);
            return repository.save(skill);
        }
        return null;
    }

    public void deleteSkill(String id) {
        repository.findById(id).ifPresent(s -> {
            if (s.getIcon() != null && !s.getIcon().isEmpty())
                fileStorageService.deleteFile(s.getIcon());
            if (s.getCertificates() != null)
                s.getCertificates().forEach(fileStorageService::deleteFile);
        });
        repository.deleteById(id);
    }

    public Skills addCertificate(String id, MultipartFile file) {
        Skills skill = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Skill not found: " + id));
        String filePath = fileStorageService.storeFile(file, "skill-certificates");
        if (skill.getCertificates() == null)
            skill.setCertificates(new ArrayList<>());
        skill.getCertificates().add(filePath);
        return repository.save(skill);
    }

    public Skills removeCertificate(String id, String fileName) {
        Skills skill = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Skill not found: " + id));

        if (skill.getCertificates() != null) {
            // Find the URL that contains this fileName
            java.util.Optional<String> fileToRemove = skill.getCertificates().stream()
                    .filter(url -> url.contains(fileName))
                    .findFirst();

            fileToRemove.ifPresent(url -> {
                if (skill.getCertificates().remove(url)) {
                    fileStorageService.deleteFile(url);
                }
            });
        }
        return repository.save(skill);
    }

    public Skills uploadIcon(String id, MultipartFile file) {
        Skills skill = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Skill not found: " + id));

        // Delete old icon if it exists
        if (skill.getIcon() != null && !skill.getIcon().isEmpty()) {
            fileStorageService.deleteFile(skill.getIcon());
        }

        String fileName = fileStorageService.storeFile(file, "skill-icons");
        skill.setIcon(fileName);
        return repository.save(skill);
    }
}
