package com.chandan.ChandanSpringDev.repository;

import com.chandan.ChandanSpringDev.model.Resume;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResumeRepository extends MongoRepository<Resume, String> {
}
