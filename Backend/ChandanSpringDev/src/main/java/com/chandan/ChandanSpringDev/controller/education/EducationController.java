package com.chandan.ChandanSpringDev.controller.education;

import com.chandan.ChandanSpringDev.model.Education;
import com.chandan.ChandanSpringDev.service.EducationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/education")
public class EducationController {

    @Autowired
    private EducationService service;

    @GetMapping
    public ResponseEntity<List<Education>> getAllEducation() {
        return ResponseEntity.ok(service.getAllEducation());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Education> getEducationById(@PathVariable String id) {
        return service.getEducationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Education> addEducation(@RequestBody Education education) {
        return ResponseEntity.ok(service.addEducation(education));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Education> updateEducation(@PathVariable String id, @RequestBody Education education) {
        Education updated = service.updateEducation(id, education);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEducation(@PathVariable String id) {
        service.deleteEducation(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/degree/{degree}")
    public ResponseEntity<String> deleteByDegree(@PathVariable String degree) {
        Optional<Education> education = service.findEducationByDegree(degree);
        if (education.isPresent()) {
            service.deleteByDegree(degree);
            return ResponseEntity.ok("Education '" + degree + "' deleted successfully");
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/institution/{institution}")
    public ResponseEntity<String> deleteByInstitution(@PathVariable String institution) {
        Optional<Education> education = service.findByInstitution(institution);
        if (education.isPresent()) {
            service.deleteByInstitution(institution);
            return ResponseEntity.ok("Education from '" + institution + "' deleted successfully");
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/upload-marks-card")
    public ResponseEntity<Education> uploadMarksCard(@PathVariable String id, @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(service.addMarksCard(id, file));
    }

    @DeleteMapping("/{id}/marks-card/{fileName}")
    public ResponseEntity<Education> removeMarksCard(@PathVariable String id, @PathVariable String fileName) {
        return ResponseEntity.ok(service.removeMarksCard(id, fileName));
    }

    @PostMapping("/{id}/upload-certificate")
    public ResponseEntity<Education> uploadCertificate(@PathVariable String id, @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(service.addCertificate(id, file));
    }

    @DeleteMapping("/{id}/certificate/{fileName}")
    public ResponseEntity<Education> removeCertificate(@PathVariable String id, @PathVariable String fileName) {
        return ResponseEntity.ok(service.removeCertificate(id, fileName));
    }
}
