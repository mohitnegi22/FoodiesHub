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
public class User {

    @Id
    private String emailId;
    private String password;
    private String role;
    private String name;

}