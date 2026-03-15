package com.chandan.ChandanSpringDev.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.chandan.ChandanSpringDev.model.User;
import com.chandan.ChandanSpringDev.repository.UserRepository;
import com.chandan.ChandanSpringDev.security.JwtUtils;

import jakarta.annotation.PostConstruct;

import java.util.HashMap;
import java.util.Map;

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

    // Master admin email — OTP for new registrations will be sent here
    private static final String MASTER_ADMIN_EMAIL = "chandankumarchandan48768@gmail.com";

    // Pending registrations: email -> hashed password (waiting for OTP approval)
    private final Map<String, String> pendingRegistrations = new HashMap<>();

    // Default admin credentials
    private static final String DEFAULT_EMAIL = "admin@gmail.com";
    private static final String DEFAULT_PASSWORD = "admin123";

    @PostConstruct
    public void initDefaultUser() {
        try {
            // Primary admin
            if (userRepository.findByEmail(DEFAULT_EMAIL).isEmpty()) {
                User primaryAdmin = new User();
                primaryAdmin.setEmail(DEFAULT_EMAIL);
                primaryAdmin.setPassword(passwordEncoder.encode(DEFAULT_PASSWORD));
                userRepository.save(primaryAdmin);
                System.out.println("Default primary admin created: " + DEFAULT_EMAIL);
            }

            // Secondary admin
            String secondaryEmail = "chandan@gmail.com";
            if (userRepository.findByEmail(secondaryEmail).isEmpty()) {
                User secondaryAdmin = new User();
                secondaryAdmin.setEmail(secondaryEmail);
                secondaryAdmin.setPassword(passwordEncoder.encode("chandan123"));
                userRepository.save(secondaryAdmin);
                System.out.println("Secondary admin user created: " + secondaryEmail);
            }

            // Master admin (personal)
            if (userRepository.findByEmail(MASTER_ADMIN_EMAIL).isEmpty()) {
                User masterAdmin = new User();
                masterAdmin.setEmail(MASTER_ADMIN_EMAIL);
                masterAdmin.setPassword(passwordEncoder.encode("Chandan@123"));
                userRepository.save(masterAdmin);
                System.out.println("Master admin user created: " + MASTER_ADMIN_EMAIL);
            }
        } catch (Exception e) {
            // Log the error but do NOT crash the application.
            // Default users can be seeded on first login attempt instead.
            System.err.println("[WARN] Could not seed default admin users during startup: " + e.getMessage());
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

    /**
     * Step 1 of admin registration:
     * - Validates email is not already registered
     * - Stores the pending registration (email + hashed password)
     * - Sends an OTP to the MASTER_ADMIN_EMAIL for approval
     */
    public void initiateAdminRegistration(String email, String password) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("An admin with this email already exists.");
        }
        if (email == null || email.isBlank() || !email.contains("@")) {
            throw new RuntimeException("Invalid email address.");
        }
        if (password == null || password.length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters.");
        }

        // Store hashed password in pending map, keyed by the new admin's email
        String hashedPassword = passwordEncoder.encode(password);
        pendingRegistrations.put(email, hashedPassword);

        // Generate OTP keyed so we can verify it
        String otpKey = "register:" + email;
        String otp = otpService.generateOtp(otpKey);

        // Notify master admin with the OTP
        emailService.sendAdminRegistrationOtp(MASTER_ADMIN_EMAIL, email, otp);
    }

    /**
     * Step 2 of admin registration:
     * - Verifies the OTP that was sent to the master admin email
     * - If valid, creates the new admin account
     */
    public void completeAdminRegistration(String email, String otp) {
        String otpKey = "register:" + email;

        if (!otpService.validateOtp(otpKey, otp)) {
            throw new RuntimeException("Invalid or expired OTP. Please request a new registration.");
        }

        String hashedPassword = pendingRegistrations.remove(email);
        if (hashedPassword == null) {
            throw new RuntimeException(
                    "No pending registration found for this email. Please start the registration process again.");
        }

        // Double-check email not already taken (race condition guard)
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("An admin with this email already exists.");
        }

        User newAdmin = new User();
        newAdmin.setEmail(email);
        newAdmin.setPassword(hashedPassword);
        userRepository.save(newAdmin);

        System.out.println("New admin registered: " + email);
    }
}
