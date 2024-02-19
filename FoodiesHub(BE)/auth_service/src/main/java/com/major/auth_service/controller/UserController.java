package com.major.auth_service.controller;

import com.major.auth_service.OTP.OtpService;
import com.major.auth_service.exception.UserAlreadyExistException;
import com.major.auth_service.exception.UserNotFoundException;
import com.major.auth_service.feign.SignUpData;
import com.major.auth_service.model.Admin;
import com.major.auth_service.model.User;
import com.major.auth_service.security.AdminTokenGenerator;
import com.major.auth_service.security.JwtGenerator;
import com.major.auth_service.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtGenerator jwtGenerator;

    @Autowired
    private OtpService otpService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private ForgotPasswordService forgotPasswordService;

    @Autowired
    private AdminService adminService;

    @Autowired
    private AdminTokenGenerator adminTokenGenerator;

    @Autowired
    EmailVerfifcationService emailVerfifcationService;
    //======================================REGISTER=========================================================
    @PostMapping("/generateAndSendOtp")
    public ResponseEntity<?> generateAndSendOtp(@RequestBody Map<String, String> request) {

        try {
            String emailId = request.get("emailId");
            System.out.println("generateAndSendOtp method in controller = "+emailId);
            String emailVerificationOtp;
            if (emailId != null) {
                emailVerificationOtp = otpService.generateOtp();
                emailVerfifcationService.saveEmailVerification(emailId, emailVerificationOtp);
                System.out.println("data saved  = " + emailId + " " + emailVerificationOtp);
                sendOtpToUserEmail(emailId, emailVerificationOtp);
                System.out.println("OTP sent");
                Map<String, String> successResponse = new HashMap<>();
                successResponse.put("message", "OTP generated and sent successfully");
                return new ResponseEntity<>(successResponse, HttpStatus.OK);
            } else {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Incorrect OTP");
                return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Internal Server Error");
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PostMapping("/registerUserFeign")
    public ResponseEntity<?> registerUser(@RequestBody SignUpData signUpData) throws UserAlreadyExistException {
        try {
            if (emailVerfifcationService.verifyOtp(signUpData.getEmailId(), signUpData.getOtp())) {
//                return new ResponseEntity<>(userService.registerUserFeign(signUpData), HttpStatus.OK);
                User response = userService.registerUserFeign(signUpData);
                emailService.sendWelcomeEmail(signUpData.getEmailId());
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Incorrect OTP");
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
            }
        } catch (UserAlreadyExistException e) {
            throw new UserAlreadyExistException();
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    @GetMapping("/getAllEmails")
    public ResponseEntity<?> getAllEmails() {

        List<User> AllExistingEmails = userService.getAllEmails();
        return new ResponseEntity<>(AllExistingEmails, HttpStatus.OK);
    }

    //==================================FORGOT PASSWORD=======================================================

    @PostMapping("/forgotPasswordOTP")
    public ResponseEntity<?> generateForgotPasswordOTP(@RequestBody Map<String,String> request){

        try {
            String emailId = request.get("emailId");
            Optional<User> userOptional = userService.getUser(emailId);
            String passwordOtp;
            if (userOptional.isPresent()) {
                passwordOtp = otpService.generateOtp();
                forgotPasswordService.saveOTP(emailId, passwordOtp);
                sendPasswordOtpEmail(emailId, passwordOtp);
                System.out.println("OTP sent to" + emailId);
                Map<String, String> successResponse = new HashMap<>();
                successResponse.put("message", "OTP generated and sent successfully");
                return new ResponseEntity<>(successResponse, HttpStatus.OK);
            } else {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "user Not Found");
                return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Internal Server Error");
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PostMapping("/verifyPasswordOTP")
    public ResponseEntity<?> verifyPasswordOtp(@RequestBody  Map<String, String> request){

        Map<String, Object> response = new HashMap<>();
        try {
            String emailId = request.get("emailId");
            String otp = request.get("otp");
            System.out.println("controller recived password request" + emailId + " " + otp);
            if(emailId == null || otp == null){
                response.put("error", "Invalid input parameters.");
                return ResponseEntity.badRequest().body("Invalid input parameters.");
            }
            boolean isOtpCorrect = forgotPasswordService.verifyOtp(emailId, otp);
            System.out.println("isOtpCorrect = "+isOtpCorrect);

            if(isOtpCorrect){
                response.put("status", "success");
                response.put("message", "OTP verified successfully.");
            }else{
                response.put("status", "error");
                response.put("message", "Incorrect OTP.");
            }
            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch(Exception e){
            response.put("status", "error");
            response.put("message", "Internal server error.");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/changePassword")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> changePasswordRequest) throws UserNotFoundException{
        Map<String, String> response = new HashMap<>();
        try{
            String emailId = changePasswordRequest.get("emailId");
            String newPassword = changePasswordRequest.get("password");

            System.out.println("email in controller "+ emailId);
            System.out.println("new password "+ newPassword);

            if(emailId == null || newPassword == null){
                response.put("status", "error");
                response.put("message", "Invalid input parameters.");
                return new ResponseEntity<>(response,HttpStatus.BAD_REQUEST);
            }
            boolean isPasswordChanged = userService.changePassword(emailId,newPassword);
            if(isPasswordChanged){
                emailService.sendPasswordChangedEmail(emailId);
                response.put("status", "success");
                response.put("message", "Password changed successfully.");
                return new ResponseEntity<>(response, HttpStatus.OK);
            }else{
                response.put("status", "error");
                response.put("message", "Error changing password. User not found.");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
        }catch(Exception e){
            response.put("status", "error");
            response.put("message", "Internal server error.");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    //=======================================LOGIN=============================================================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) throws UserNotFoundException {

        try{
            System.out.println(user);
            User result = userService.login(user.getEmailId(), user.getPassword());
            if(result!=null){
                return new ResponseEntity<>(jwtGenerator.generateJwt(result), HttpStatus.OK);
            }
            else{
                return new ResponseEntity<>(Map.of("message", "Login failed"), HttpStatus.UNAUTHORIZED);
            }
        }catch (UserNotFoundException e){
            throw new UserNotFoundException();
        }
    }
    //=========================================admin login============================================
    @PostMapping("/admin-login")
    public ResponseEntity<?> adminLogin(@RequestBody Admin admin) throws UserNotFoundException {

        try{

            Admin result = adminService.login(admin.getId(), admin.getPassword());

            if(result!=null){
                return new ResponseEntity<>(adminTokenGenerator.generateJwt(result), HttpStatus.OK);
            }
            else{
                return new ResponseEntity<>(Map.of("message", "Login failed"), HttpStatus.UNAUTHORIZED);
            }
        }catch (UserNotFoundException e){
            throw new UserNotFoundException();
        }
    }

    //===================================================================================================
    private void sendOtpToUserEmail(String userEmail, String otp) {
        emailService.sendOtpEmail(userEmail, otp);
    }

    private void sendPasswordOtpEmail(String userEmail, String otp) {
        emailService.sendPasswordOtpEmail(userEmail, otp);
    }

    //===================================================================================================
    @PostMapping("/checkDuplicateEmail")
    public ResponseEntity<Boolean> checkEmailDuplicate(@RequestBody String emailId) {
        boolean isDuplicate = userService.isEmailDuplicate(emailId);
        return ResponseEntity.ok(isDuplicate);
    }
}
