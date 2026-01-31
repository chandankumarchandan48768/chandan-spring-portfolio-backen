package com.chandan.ChandanSpringDev.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/portfolio")
public class PortfolioController {
    
    @RequestMapping("/")
    public String portfolio() {
        return "This is the portfolio endpoint";
    } 

}
