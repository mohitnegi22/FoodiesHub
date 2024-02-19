package com.major.auth_service.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Getter
@Setter
@Entity

public class Admin {
    @Id
    private String id;      //restaurant ID
    private String password;
    private String role;
}