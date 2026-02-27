package com.chandan.ChandanSpringDev.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.chandan.ChandanSpringDev.model.User;
import com.chandan.ChandanSpringDev.repository.UserRepository;
import com.chandan.ChandanSpringDev.security.JwtUtils;

import jakarta.annotation.PostConstruct;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private EmailService emailService;

    @Autowired
    private OtpService otpService;

    // Default admin credentials
    private static final String DEFAULT_EMAIL = "admin@gmail.com";
    private static final String DEFAULT_PASSWORD = "admin123";

    @PostConstruct
    public void initDefaultUser() {
        Optional<User> admin = userRepository.findByEmail(DEFAULT_EMAIL);
        if (admin.isEmpty()) {
            User defaultUser = new User();
            defaultUser.setEmail(DEFAULT_EMAIL);
            defaultUser.setPassword(passwordEncoder.encode(DEFAULT_PASSWORD));
            userRepository.save(defaultUser);
            System.out.println("Default admin user created: " + DEFAULT_EMAIL);
        }
    }

    public String authenticate(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return jwtUtils.generateToken(email);
    }

    public void initiatePasswordReset(String email) {
        userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email not found"));

        String otp = otpService.generateOtp(email);
        emailService.sendOtpEmail(email, otp);
    }

    public void completePasswordReset(String email, String otp, String newPassword) {
        if (!otpService.validateOtp(email, otp)) {
            throw new RuntimeException("Invalid or expired OTP");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
