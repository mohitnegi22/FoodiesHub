package com.major.auth_service.service;

import com.major.auth_service.exception.UserNotFoundException;
import com.major.auth_service.model.Admin;
import com.major.auth_service.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    public Admin login(String id, String password) throws UserNotFoundException {
        if (id == null) {
            return null;
        }
        Optional<Admin> optionalUser = adminRepository.findById(id);
        if(optionalUser.isPresent()){
            if(optionalUser.get().getPassword().equals(password)){
                return optionalUser.get();
            }
        }
        return null;
    }
}
