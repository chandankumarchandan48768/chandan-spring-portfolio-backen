package com.chandan.ChandanSpringDev.controller.project;

import java.util.List;
import java.util.Optional;

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

import com.chandan.ChandanSpringDev.model.Project;
import com.chandan.ChandanSpringDev.service.ProjectService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        List<Project> projects = projectService.getAllProjects();
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable String id) {
        return projectService.getProjectById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Project> addProject(@RequestBody Project project) {
        return ResponseEntity.ok(projectService.addProject(project));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable String id, @RequestBody Project project) {
        Project update = projectService.updateProject(id, project);
        return ResponseEntity.ok(update);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable String id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/name/{name}")
    public ResponseEntity<String> deleteByName(@PathVariable String name) {
        Optional<Project> project = projectService.getProjectByName(name);
        if (project.isPresent()) {
            projectService.deleteByName(name);
            return ResponseEntity.ok("Project '" + name + "' deleted successfully");
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/upload-image")
    public ResponseEntity<Project> uploadImage(@PathVariable String id, @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(projectService.uploadImage(id, file));
    }

    @DeleteMapping("/{id}/image/{fileName}")
    public ResponseEntity<Project> removeImage(@PathVariable String id, @PathVariable String fileName) {
        // Here fileName is practically ignored because removeImage just clears the url,
        // but we keep it for REST consistency.
        return ResponseEntity.ok(projectService.removeImage(id));
    }
}
