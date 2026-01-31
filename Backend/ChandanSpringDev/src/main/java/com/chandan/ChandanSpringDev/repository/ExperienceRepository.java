package com.chandan.ChandanSpringDev.repository;

import com.chandan.ChandanSpringDev.model.Experience;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExperienceRepository extends MongoRepository<Experience, String> {
    Optional<Experience> findByCompany(String company);
    Optional<Experience> findByRole(String role);
}
