package com.major.auth_service.OTP;

import org.springframework.stereotype.Service;
import java.util.Random;

@Service
public class OtpService {

    private static final int LENGTH_OF_OTP = 6;

    public String generateOtp() {
        Random random = new Random();
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < LENGTH_OF_OTP; i++) {
            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }
}
