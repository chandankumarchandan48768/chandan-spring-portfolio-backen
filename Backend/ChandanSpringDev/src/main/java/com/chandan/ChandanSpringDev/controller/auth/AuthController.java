package com.chandan.ChandanSpringDev.controller.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.chandan.ChandanSpringDev.service.AuthService;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            String token = authService.authenticate(request.get("email"), request.get("password"));
            return ResponseEntity.ok(Map.of("token", token));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            authService.initiatePasswordReset(request.get("email"));
            return ResponseEntity.ok(Map.of("message", "OTP sent to email"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            authService.completePasswordReset(
                    request.get("email"),
                    request.get("otp"),
                    request.get("newPassword"));
            return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Step 1: Initiate admin registration.
     * Sends an OTP to the master admin (chandankumarchandan48768@gmail.com) for
     * approval.
     *
     * Request body: { "email": "newadmin@example.com", "password": "securepassword"
     * }
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String password = request.get("password");
            authService.initiateAdminRegistration(email, password);
            return ResponseEntity.ok(Map.of(
                    "message",
                    "Registration request submitted. An OTP has been sent to the master admin email for approval. Please obtain the OTP from the master admin to complete registration."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Step 2: Verify OTP and complete admin registration.
     * The OTP was sent to the master admin and must be entered here to create the
     * account.
     *
     * Request body: { "email": "newadmin@example.com", "otp": "123456" }
     */
    @PostMapping("/verify-registration")
    public ResponseEntity<?> verifyRegistration(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String otp = request.get("otp");
            authService.completeAdminRegistration(email, otp);
            return ResponseEntity.ok(Map.of("message", "Admin account created successfully! You can now log in."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
