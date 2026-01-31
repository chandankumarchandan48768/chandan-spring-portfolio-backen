package com.chandan.ChandanSpringDev.controller.contactInfo;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/contact")
public class ContactController {
    
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

}
