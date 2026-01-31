package com.chandan.ChandanSpringDev;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.data.mongodb.core.MongoTemplate;

@SpringBootApplication
public class ChandanSpringDevApplication {

    @Bean
    @Primary
    public MongoClient mongoClient() {
        return MongoClients.create("mongodb://admin:pass@mongo:27017/ChandanSpringDev?authSource=admin");
    }

    public static void main(String[] args) {
        SpringApplication.run(ChandanSpringDevApplication.class, args);
    }
}
