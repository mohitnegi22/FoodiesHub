package com.major.auth_service.service;

import com.major.auth_service.model.ForgotPassword;
import com.major.auth_service.repository.ForgotPasswordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ForgotPasswordService {
    @Autowired
    private ForgotPasswordRepository forgotPasswordRepository;

    public void saveOTP(String emailId, String otp) {
        ForgotPassword forgotPassword = new ForgotPassword();
        forgotPassword.setEmailId(emailId);
        forgotPassword.setOtp(otp);
        forgotPasswordRepository.save(forgotPassword);
    }

    public Optional<ForgotPassword> getForgotPsswordOTP(String emailId) {
        return forgotPasswordRepository.findById(emailId);
    }

    public boolean verifyOtp(String emailId, String enteredOtp) {
        Optional<ForgotPassword> forgotPasswordOTP = getForgotPsswordOTP(emailId);
        return forgotPasswordOTP.isPresent() && forgotPasswordOTP.get().getOtp().equals(enteredOtp);
    }

    public void removeEmailVerification(String emailId) {
        forgotPasswordRepository.deleteById(emailId);
    }
}
