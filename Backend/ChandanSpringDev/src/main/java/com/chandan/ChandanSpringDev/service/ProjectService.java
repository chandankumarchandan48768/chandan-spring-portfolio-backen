package com.chandan.ChandanSpringDev.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.chandan.ChandanSpringDev.model.Project;
import com.chandan.ChandanSpringDev.repository.ProjectRepository;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private FileStorageService fileStorageService;

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project addProject(Project project) {
        return projectRepository.save(project);
    }

    public void deleteProject(String projectId) {
        projectRepository.findById(projectId).ifPresent(p -> {
            if (p.getImageUrl() != null)
                fileStorageService.deleteFile(p.getImageUrl());
        });
        projectRepository.deleteById(projectId);
    }

    public Project updateProject(String id, Project project) {
        project.setId(id);
        return projectRepository.save(project);
    }

    public List<Project> getProjectsByTechnology(String technology) {
        return projectRepository.findByTechnologiesContaining(technology);
    }

    public Optional<Project> getProjectById(String projectId) {
        return projectRepository.findById(projectId);
    }

    public Optional<Project> getProjectByName(String name) {
        return projectRepository.findByName(name);
    }

    public void deleteByName(String name) {
        projectRepository.findByName(name).ifPresent(p -> {
            if (p.getImageUrl() != null)
                fileStorageService.deleteFile(p.getImageUrl());
            projectRepository.delete(p);
        });
    }

    public Project uploadImage(String id, MultipartFile file) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found: " + id));
        // Delete old image if one exists
        if (project.getImageUrl() != null) {
            fileStorageService.deleteFile(project.getImageUrl());
        }
        String filePath = fileStorageService.storeFile(file, "project-images");
        project.setImageUrl(filePath);
        return projectRepository.save(project);
    }

    public Project removeImage(String id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found: " + id));
        if (project.getImageUrl() != null) {
            fileStorageService.deleteFile(project.getImageUrl());
            project.setImageUrl(null);
        }
        return projectRepository.save(project);
    }
}