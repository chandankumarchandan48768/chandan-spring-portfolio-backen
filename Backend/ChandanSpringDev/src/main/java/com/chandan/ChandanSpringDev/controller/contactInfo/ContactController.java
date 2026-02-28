package com.chandan.ChandanSpringDev.controller.contactInfo;

import com.chandan.ChandanSpringDev.model.EmailRequest;
import com.chandan.ChandanSpringDev.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    @Autowired
    private EmailService emailService;

    @RequestMapping("/getContactInfo")
    public String getContactInfo() {
        return "Contact information will be here";
    }

    @RequestMapping("/aboutMe")
    public String getAboutMe() {
        return "About me details will be here";
    }

    @RequestMapping("/testimonials")
    public String getTestimonials() {
        return "Testimonials will be here";
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitContactForm(@RequestBody EmailRequest request) {
        try {
            emailService.sendContactEmail(request);
            return ResponseEntity.ok(Map.of("message", "Message sent successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to send message: " + e.getMessage()));
        }
    }
}
