package com.chandan.ChandanSpringDev.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class OtpService {

    // Store OTPs in memory for simplicity: Map<Email, OTP Data>
    private final Map<String, OtpData> otpStorage = new HashMap<>();
    private final Random random = new Random();

    public String generateOtp(String email) {
        // Generate 6 digit OTP
        String otp = String.format("%06d", random.nextInt(999999));

        // Expiration = 5 minutes from now
        long expirationTime = System.currentTimeMillis() + (5 * 60 * 1000);

        otpStorage.put(email, new OtpData(otp, expirationTime));
        return otp;
    }

    public boolean validateOtp(String email, String otp) {
        OtpData otpData = otpStorage.get(email);

        if (otpData == null) {
            return false;
        }

        if (System.currentTimeMillis() > otpData.getExpirationTime()) {
            otpStorage.remove(email); // expired
            return false;
        }

        if (otpData.getOtp().equals(otp)) {
            otpStorage.remove(email); // successful verification, consume it
            return true;
        }

        return false;
    }

    private static class OtpData {
        private final String otp;
        private final long expirationTime;

        public OtpData(String otp, long expirationTime) {
            this.otp = otp;
            this.expirationTime = expirationTime;
        }

        public String getOtp() {
            return otp;
        }

        public long getExpirationTime() {
            return expirationTime;
        }
    }
}
