package com.major.auth_service.service;

import com.major.auth_service.model.EmailVerification;
import com.major.auth_service.repository.EmailVerificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class EmailVerfifcationService {

    @Autowired
    private EmailVerificationRepository emailVerificationRepository;

    public void saveEmailVerification(String emailId, String otp) {
        EmailVerification emailVerification = new EmailVerification();
        emailVerification.setEmailId(emailId);
        emailVerification.setOtp(otp);
        emailVerificationRepository.save(emailVerification);
    }

    public Optional<EmailVerification> getEmailVerification(String emailId) {
        return emailVerificationRepository.findById(emailId);
    }

    public void removeEmailVerification(String emailId) {
        emailVerificationRepository.deleteById(emailId);
    }

    public boolean verifyOtp(String emailId, String enteredOtp) {
        Optional<EmailVerification> emailVerification = getEmailVerification(emailId);

        if (emailVerification.isPresent() && emailVerification.get().getOtp().equals(enteredOtp)) {

            System.out.println(emailVerification.get().getEmailId());
            System.out.println(emailVerification.get().getOtp());
            return true;
        } else {
            return false;
        }
    }

}
