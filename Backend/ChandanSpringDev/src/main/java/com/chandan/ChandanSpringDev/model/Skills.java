package com.chandan.ChandanSpringDev.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "skills")
@Data
public class Skills {
    
    @Id
    private String id;
    private String skillName;
    private int proficiencyLevel;
    private String category;
    private String description;
    private String yearsOfExperience;
    private String icon;
    
}
