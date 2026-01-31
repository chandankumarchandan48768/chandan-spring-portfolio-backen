package com.chandan.ChandanSpringDev.repository;

import com.chandan.ChandanSpringDev.model.Education;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface EducationRepository extends MongoRepository<Education, String> {
    Optional<Education> findByDegree(String degree);
    Optional<Education> findByInstitution(String institution);
}
