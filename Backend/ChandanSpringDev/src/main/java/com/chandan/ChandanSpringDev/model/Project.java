package com.chandan.ChandanSpringDev.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;
import java.util.List;

@Document(collection = "projects")
@lombok.Data
public class Project {
    @Id
    private String id;
    private String name;
    private String description;
    private List<String> technologies;
    private String githubUrl;
    private String liveUrl; // renamed from demoUrl, harmonised with frontend
    private String imageUrl; // stored file path for project screenshot
    private LocalDate createdAt = LocalDate.now();
}
