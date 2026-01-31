package com.chandan.ChandanSpringDev.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.chandan.ChandanSpringDev.model.Experience;
import com.chandan.ChandanSpringDev.repository.ExperienceRepository;

@Service
public class ExperienceService {
    
    @Autowired
    private ExperienceRepository repository;

    public ResponseEntity<List<Experience>> getAllExperience() {
        return ResponseEntity.ok(repository.findAll());
    }

    public ResponseEntity<Experience> getExperienceById(String id){
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<Experience> addExperience(Experience experience) {
        Experience savedExperience = repository.save(experience);
        return ResponseEntity.ok(savedExperience);
    }

    public ResponseEntity<Experience> updateExperience(String id, Experience experience) {
        return repository.findById(id)
                .map(existingExperience -> {
                    experience.setId(id);
                    Experience updatedExperience = repository.save(experience);
                    return ResponseEntity.ok(updatedExperience);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<Void> deleteExperience(String id) {
        return repository.findById(id)
                .map(existingExperience -> {
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
                    repository.delete(experience);
                    return ResponseEntity.ok(experience);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
}
