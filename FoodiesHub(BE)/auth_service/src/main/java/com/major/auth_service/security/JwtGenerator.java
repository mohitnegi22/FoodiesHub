package com.major.auth_service.security;

import com.major.auth_service.model.User;

import java.util.Map;

public interface JwtGenerator {

    Map<String,String> generateJwt(User user);

}