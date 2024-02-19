package com.major.auth_service.security;

import com.major.auth_service.model.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtGeneratorImpl implements JwtGenerator{


    private static final String ISSUER = "auth-app";
    private static final String SIGNING_KEY = "SecretKey123SecretKey123SecretKey123SecretKey123SecretKey123SecretKey123SecretKey123SecretKey123";

    @Override
    public Map<String, String> generateJwt(User user) {

        Map<String, String> result = new HashMap<String, String>();
        Map<String, Object> claims = new HashMap<String,Object>();

        claims.put("emailId",user.getEmailId());
        claims.put("role",user.getRole());
        claims.put("name", user.getName());

        Date expirationDate = new Date(System.currentTimeMillis() + 1000*60*25); // valid for 25 mins

        String jwt = Jwts.builder()
                .setSubject("testing token")
                .setExpiration(expirationDate)
                .setClaims(claims)
                .setIssuer(ISSUER)
                .setIssuedAt(new Date())
                .signWith(SignatureAlgorithm.HS512, SIGNING_KEY)
                .compact();
        result.put("key",jwt);
        result.put("message","Login is successFul");
        result.put("emailId" , user.getEmailId());

        return result;
    }


}
