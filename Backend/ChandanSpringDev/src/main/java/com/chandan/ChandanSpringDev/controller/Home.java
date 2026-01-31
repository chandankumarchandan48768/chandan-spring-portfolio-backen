package com.chandan.ChandanSpringDev.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Home {
    @RequestMapping("/")
    public String home() {  
        return "This is home page of Chandan Spring Dev Application";  
    }
}
