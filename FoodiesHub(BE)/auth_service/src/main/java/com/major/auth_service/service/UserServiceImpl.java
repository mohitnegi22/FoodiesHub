package com.major.auth_service.service;

import com.major.auth_service.exception.UserAlreadyExistException;
import com.major.auth_service.exception.UserNotFoundException;
import com.major.auth_service.feign.SignUpData;
import com.major.auth_service.feign.UserDTO;
import com.major.auth_service.feign.UserProxy;
import com.major.auth_service.model.EmailVerification;
import com.major.auth_service.model.User;
import com.major.auth_service.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl  implements  UserService{

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserProxy userProxy;

    @Autowired
    private  EmailVerfifcationService emailVerfifcationService;
    //===========================================================================================
    @Override
    public User registerUser(User user) throws UserAlreadyExistException {

        Optional<User> optionalUser = userRepository.findById(user.getEmailId());
        if(optionalUser.isPresent()){
            throw new UserAlreadyExistException();
        }
        return userRepository.save(user);
    }
        @Override
        public User registerUserFeign(SignUpData signUpData) throws UserAlreadyExistException {


            try{
                Optional<User> optionalUser = userRepository.findById(signUpData.getEmailId());
                if(optionalUser.isPresent()){
                    throw new UserAlreadyExistException();
                }
                UserDTO foodAppUserData = new UserDTO(signUpData.getEmailId(),signUpData.getName(),signUpData.getCity(),
                        signUpData.getState(),
                        signUpData.getZipCode(),
                        signUpData.getFullAddress(),
                        signUpData.getMobileNumber(),
                        signUpData.getProfileImagePath());

                ResponseEntity<?> response =  userProxy.sendDataToFoodApp(foodAppUserData);
                System.out.println("Data Sent to Food App = " + response);

                User authServiceData = new User(signUpData.getEmailId(),signUpData.getPassword(),"User", signUpData.getName());
                System.out.println("Auth app data = " + authServiceData);
                return userRepository.save(authServiceData);
            }catch (Exception e){
                e.printStackTrace();
                return  null;
            }
    }

    @Override
    public List<User> getAllEmails(){
        return userRepository.findAll();
    }

    //=========================================================================================================
    @Override
    public User login(String emailId, String password) {
        if (emailId == null) {
            return null;
        }
        Optional<User> optionalUser = userRepository.findById(emailId);
        if(optionalUser.isPresent()){
            if(optionalUser.get().getPassword().equals(password)){ // login success
                return optionalUser.get();
            }
        }
        return null; // login failed
    }
    //=========================================================================================================

    @Override
    public boolean verifyOtp(String emailId, String enteredOtp) {
        Optional<EmailVerification> emailVerification = emailVerfifcationService.getEmailVerification(emailId);

        if (emailVerification.isPresent() && emailVerification.get().getOtp().equals(enteredOtp)) {

            System.out.println(emailVerification.get().getEmailId());
            System.out.println(emailVerification.get().getOtp());
            return true;
        } else {
            return false;
        }
    }
    //================================================================
    @Override
    public boolean changePassword(String emailId, String newPassword) throws UserNotFoundException {
        Optional<User> optionalUser = userRepository.findById(emailId);
        if(optionalUser.isPresent()){
            User user = optionalUser.get();
            user.setPassword(newPassword);
            userRepository.save(user);
            return true;
        }else{
            return false;
        }
    }

    @Override
    public Optional<User> getUser(String emailId){
        return userRepository.findById(emailId);
    }

    //================================================================
    @Override
    public boolean isEmailDuplicate(String emailId){
        return userRepository.existsById(emailId);
    }

}
