package com.chandan.ChandanSpringDev.controller.skills;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.chandan.ChandanSpringDev.model.Skills;
import com.chandan.ChandanSpringDev.service.SkillService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/skills")
public class SkillsController {

    @Autowired
    private SkillService service;

    @GetMapping
    public ResponseEntity<List<Skills>> getSkills() {
        return ResponseEntity.ok(service.getAllSkills());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSkill(@PathVariable String id) {
        service.deleteSkill(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<Skills> addSkill(@RequestBody Skills skill) {
        Skills newSkill = service.addSkill(skill);
        return ResponseEntity.ok(newSkill);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Skills> updateSkill(@PathVariable String id, @RequestBody Skills skill) {
        Skills updatedSkill = service.updateSkill(id, skill);
        if (updatedSkill != null) {
            return ResponseEntity.ok(updatedSkill);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/upload-certificate")
    public ResponseEntity<Skills> uploadCertificate(@PathVariable String id, @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(service.addCertificate(id, file));
    }

    @DeleteMapping("/{id}/certificate/{fileName}")
    public ResponseEntity<Skills> removeCertificate(@PathVariable String id, @PathVariable String fileName) {
        return ResponseEntity.ok(service.removeCertificate(id, fileName));
    }

    @PostMapping("/{id}/upload-icon")
    public ResponseEntity<Skills> uploadIcon(@PathVariable String id, @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(service.uploadIcon(id, file));
    }
}
