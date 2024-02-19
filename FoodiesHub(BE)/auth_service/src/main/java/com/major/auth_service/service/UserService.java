package com.major.auth_service.service;

import com.major.auth_service.exception.UserAlreadyExistException;
import com.major.auth_service.exception.UserNotFoundException;
import com.major.auth_service.feign.SignUpData;
import com.major.auth_service.model.EmailVerification;
import com.major.auth_service.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {

    User registerUser(User user) throws UserAlreadyExistException;

    User registerUserFeign(SignUpData signUpData) throws  UserAlreadyExistException;
    User login(String emailId, String password) throws UserNotFoundException;

    boolean verifyOtp(String emailId, String enteredOtp);

    boolean isEmailDuplicate(String emailId);

    boolean changePassword(String emailId, String newPassword) throws UserNotFoundException;

    Optional<User> getUser(String emailId);

    List<User> getAllEmails();

}
