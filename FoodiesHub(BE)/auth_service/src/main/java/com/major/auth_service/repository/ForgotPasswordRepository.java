package com.major.auth_service.repository;

import com.major.auth_service.model.ForgotPassword;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ForgotPasswordRepository extends JpaRepository<ForgotPassword, String > {
}