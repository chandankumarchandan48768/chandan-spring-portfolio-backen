package com.chandan.ChandanSpringDev.controller.experience;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.chandan.ChandanSpringDev.model.Experience;
import com.chandan.ChandanSpringDev.service.ExperienceService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/experience")
public class ExperienceController {

    @Autowired
    private ExperienceService service;

    @GetMapping
    public ResponseEntity<List<Experience>> getAllExperience() {
        return service.getAllExperience();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Experience> getExperienceById(@PathVariable String id) {
        return service.getExperienceById(id);
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<Experience> getExperienceByRole(@PathVariable String role) {
        return service.findExperienceByRole(role);
    }

    @PostMapping
    public ResponseEntity<Experience> addExperience(@RequestBody Experience experience) {
        return service.addExperience(experience);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Experience> updateExperience(@PathVariable String id, @RequestBody Experience experience) { // space
        return service.updateExperience(id, experience);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExperience(@PathVariable String id) {
        return service.deleteExperience(id);
    }

    @DeleteMapping("/company/{company}")
    public ResponseEntity<Experience> deleteByCompany(@PathVariable String company) {
        return service.deleteByCompany(company);
    }

    @DeleteMapping("/role/{role}")
    public ResponseEntity<Experience> deleteByRole(@PathVariable String role) {
        return service.deleteByRole(role);
    }

    @PostMapping("/{id}/upload-certificate")
    public ResponseEntity<Experience> uploadCertificate(@PathVariable String id,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(service.addCertificate(id, file));
    }

    @DeleteMapping("/{id}/certificate/{fileName}")
    public ResponseEntity<Experience> removeCertificate(@PathVariable String id, @PathVariable String fileName) {
        return ResponseEntity.ok(service.removeCertificate(id, fileName));
    }

}
