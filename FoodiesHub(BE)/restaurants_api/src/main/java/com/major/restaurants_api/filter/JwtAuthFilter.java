package com.major.restaurants_api.filter;

import io.jsonwebtoken.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;

public class JwtAuthFilter extends GenericFilterBean {

    private static final String SIGNING_KEY = "SecretKey123SecretKey123SecretKey123SecretKey123SecretKey123SecretKey123SecretKey123SecretKey123";

    @Override
    public void doFilter(jakarta.servlet.ServletRequest servletRequest, jakarta.servlet.ServletResponse servletResponse, jakarta.servlet.FilterChain filterChain) throws IOException, jakarta.servlet.ServletException {

        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        System.out.println("HttpServlet request in filter " + request);

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("header was null");
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or missing Authorization header");
            return;
        }
        String token = authHeader.substring(7);
        System.out.println("Token : " + token);
        try {
            System.out.println("try block in filter running ");

            Claims claims = Jwts.parser().setSigningKey(SIGNING_KEY).parseClaimsJws(token).getBody();
            System.out.println("Claims in try block is  = " + claims);

            String email = (String) claims.get("emailId");
            String role = (String) claims.get("role");
            System.out.println("emailId in try block " + email);
            System.out.println("emailId from token : " + email);

            request.setAttribute("currentUserEmailId", email);
            System.out.println("email extracted in filter = " + email);
            request.setAttribute("role", role);

            filterChain.doFilter(request, servletResponse);  //passing to controller
            System.out.println("filter try block running");

        } catch (SignatureException e) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token signature");
        } catch (JwtException e) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
        }
    }
}