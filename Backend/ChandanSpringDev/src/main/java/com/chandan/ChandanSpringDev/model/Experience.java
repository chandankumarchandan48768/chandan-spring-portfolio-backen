package com.chandan.ChandanSpringDev.model;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "experience")
@Data
public class Experience {
    
    @Id
    private String id;
    private String company;
    private String role;
    private String duration;
    private String description;
    private String location;
    private boolean isCurrentlyWorking;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<String> skillsUsed;
    private List<String> responsibilities;
    
    public Experience() {}
}
