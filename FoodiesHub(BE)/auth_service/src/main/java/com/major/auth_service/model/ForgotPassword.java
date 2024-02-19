package com.major.auth_service.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
@Entity
public class ForgotPassword {

    @Id
    private String emailId;
    private String otp;
}