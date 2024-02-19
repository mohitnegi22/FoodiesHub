package com.major.auth_service.security;

import com.major.auth_service.model.Admin;
import com.major.auth_service.service.AdminService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class AdminTokenGenerator {


    private static final String ISSUER = "auth-app";
    private static final String SIGNING_KEY = "SecretKey123SecretKey123SecretKey123SecretKey123SecretKey123SecretKey123SecretKey123SecretKey123";


    public Map<String, String> generateJwt(Admin admin) {

        Map<String, String> result = new HashMap<String, String>();
        Map<String, Object> claims = new HashMap<String,Object>();

        claims.put("id",admin.getId());
        claims.put("role",admin.getRole());

        Date expirationDate = new Date(System.currentTimeMillis() + 1000*60*60); // valid for 60 mins

        String jwt = Jwts.builder()
                .setSubject("testing token")
                .setExpiration(expirationDate)
                .setClaims(claims)
                .setIssuer(ISSUER)
                .setIssuedAt(new Date())
                .signWith(SignatureAlgorithm.HS256, SIGNING_KEY)
                .compact();
        result.put("key",jwt);
        result.put("message","Login is successFul");
        result.put("id" , admin.getId());

        return result;
    }

}
