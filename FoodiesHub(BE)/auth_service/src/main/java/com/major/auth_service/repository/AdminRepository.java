package com.major.auth_service.repository;

import com.major.auth_service.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin,String> {
}