package com.chandan.ChandanSpringDev.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.chandan.ChandanSpringDev.model.Skills;
import com.chandan.ChandanSpringDev.repository.SkillRepository;

import java.util.List;
import java.util.Optional;

@Service
public class SkillService {
    
    @Autowired
    private SkillRepository repository;

    // FETCH ALL
    public List<Skills> getAllSkills() {
        return repository.findAll();
    }
    
    // FETCH BY ID
    public Optional<Skills> getSkillById(String id) {
        return repository.findById(id);
    }
    
    // ADD NEW
    public Skills addSkill(Skills skill) {
        return repository.save(skill);
    }
    
    // UPDATE
    public Skills updateSkill(String id, Skills skill) {
        if (repository.existsById(id)) {
            skill.setId(id);
            return repository.save(skill);
        }
        return null;
    }
    
    // DELETE
    public void deleteSkill(String id) {
        repository.deleteById(id);
    }
}
