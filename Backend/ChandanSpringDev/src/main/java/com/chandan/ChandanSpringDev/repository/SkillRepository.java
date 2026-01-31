package com.chandan.ChandanSpringDev.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.chandan.ChandanSpringDev.model.Skills;

import java.util.List;

@Repository
public interface SkillRepository extends MongoRepository<Skills, String> {
    List<Skills> findBySkillName(String skillName);
}
