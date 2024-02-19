package com.major.auth_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

    @Service
    public class EmailService {

        @Autowired
        private JavaMailSender javaMailSender;

        public void sendOtpEmail(String toEmail, String otp) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("OTP Verification for Food Application Registration");


            String text = "Dear User,\n\n" +
                    "Thank you for choosing Food Application for your culinary journey. To ensure the security of your account, we require you to verify your email address.\n\n" +
                    "Your One-Time Password (OTP) for registration is: " + otp + "\n\n" +
                    "Please enter this OTP on the registration page to complete the verification process. If you did not initiate this registration, please ignore this email.\n\n" +
                    "Best regards,\n" +
                    "Customer Support Team\n" +
                    "Food Application";

            message.setText(text);

            javaMailSender.send(message);
        }
        //============================================================================
        public void sendWelcomeEmail(String toEmail) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Registration Succesfull!");

            String text = "Dear User," + " 😊\n\n" +
                    "Welcome to Food Application! We're excited to have you on board. 🎉\n" +
                    "Thank you for choosing our platform. 🙌\n\n" +
                    "If you have any questions or need assistance, feel free to contact our customer support. 🤝\n\n" +
                    "Enjoy using Food Application! 🍽️\n\n" +
                    "Best regards, 😃\n" +
                    "Customer Support Team\n" +
                    "Food Application";
            message.setText(text);
            javaMailSender.send(message);
        }
        //=================================================================================
        public void sendPasswordOtpEmail(String toEmail, String otp) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Password Reset for Food Application");


            String text = "Dear user,\n\n" +
                    "We received a request to reset your password for your Food Application account. Your OTP for resetting your password is: " + otp + "\n\n" +
                    "Please enter this OTP on the reset password page to create a new password for your account.\n\n" +
                    "If you did not request to reset your Food Application password, you can safely ignore this email." +
                    "\n\nThanks,\n" +
                    "Customer Support Team\n" +
                    "Food Application";

            message.setText(text);

            javaMailSender.send(message);
        }
        //==================================================================================
        public void sendPasswordChangedEmail(String toEmail) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Password Changed Successfully!");

            String text = "Dear User," + " 😊\n\n" +
                    "Your password for Food Application has been changed successfully. 🔒\n\n" +
                    "If you did not make this change, please contact our customer support immediately. 🚨\n\n" +
                    "Thank you for using Food Application! 🍽️\n\n" +
                    "Best regards, 😃\n" +
                    "Customer Support Team\n" +
                    "Food Application";
            message.setText(text);
            javaMailSender.send(message);
        }

    }

