package com.chandan.ChandanSpringDev.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.chandan.ChandanSpringDev.model.Project;
import com.chandan.ChandanSpringDev.repository.ProjectRepository;

@Service
public class ProjectService {
    
    @Autowired
    private ProjectRepository projectRepository;

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project addProject(Project project){
        return projectRepository.save(project);
    }

    public void deleteProject(String projectId){
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

    public Optional<Project> getProjectByName(String name){
        return projectRepository.findByName(name);
    }

    public void deleteByName(String name) {
        Optional<Project> project = projectRepository.findByName(name);
        project.ifPresent(p -> projectRepository.delete(p));
    }

}