package com.chandan.ChandanSpringDev.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;

@Document(collection = "education")
@Data
public class Education {
    @Id
    private String id;
    private String degree;
    private String institution;
    private int graduationYear;
    private String fieldOfStudy;
    private String grade;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<String> marksCards = new ArrayList<>();
    private List<String> certificates = new ArrayList<>();
}