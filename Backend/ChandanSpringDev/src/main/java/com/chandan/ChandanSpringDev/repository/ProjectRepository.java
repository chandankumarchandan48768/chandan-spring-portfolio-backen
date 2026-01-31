package com.chandan.ChandanSpringDev.repository;

import com.chandan.ChandanSpringDev.model.Project;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends MongoRepository<Project, String> {
    List<Project> findByTechnologiesContaining(String technology);

    Optional<Project> findByName(String name);
}
