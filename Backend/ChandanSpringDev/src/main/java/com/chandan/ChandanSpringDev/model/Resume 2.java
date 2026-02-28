package com.chandan.ChandanSpringDev.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "resume")
public class Resume {
    @Id
    private String id;
    private String url;
    private String publicId;
    private long updatedAt;

    public Resume(String url) {
        this.url = url;
        this.updatedAt = System.currentTimeMillis();
    }
}
