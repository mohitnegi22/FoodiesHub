package com.major.restaurants_api.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.GenericFilterBean;
import io.jsonwebtoken.SignatureException;

import java.io.IOException;

public class AdminAuthFilter extends GenericFilterBean {

    private static final String SIGNING_KEY = "SecretKey123SecretKey123SecretKey123SecretKey123SecretKey123SecretKey123SecretKey123SecretKey123";


    @Override
    public void doFilter(jakarta.servlet.ServletRequest servletRequest, jakarta.servlet.ServletResponse servletResponse, jakarta.servlet.FilterChain filterChain) throws IOException, jakarta.servlet.ServletException {

        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("header is null");
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or missing Authorization header");
            return;
        }
        String token = authHeader.substring(7);
        System.out.println("Token : " + token);
        try {
            System.out.println("try block in filter running ");

            Claims claims = Jwts.parser().setSigningKey(SIGNING_KEY).parseClaimsJws(token).getBody();

            String id = (String) claims.get("id");
            String role = (String) claims.get("role");
            System.out.println("adminId in try block " + id);
            System.out.println("role from token : " + role);

            request.setAttribute("currentAdminId", id);
            request.setAttribute("role", role);

            filterChain.doFilter(request, servletResponse);
            System.out.println("filter try block running");

        } catch (SignatureException e) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token signature");
        } catch (JwtException e) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
        }
    }

}