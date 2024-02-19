package com.major.restaurants_api.service;

import com.major.restaurants_api.exceptions.UserNotFoundException;
import com.major.restaurants_api.model.User;
import com.major.restaurants_api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers(){
        return userRepository.findAll();
    }

    public void deleteUserAccount(String emailId) throws UserNotFoundException {
        Optional<User> user = userRepository.findById(emailId);
        if(user.isEmpty()){
            throw new UserNotFoundException();
        }else{
            userRepository.deleteById(emailId);
        }
    }
}