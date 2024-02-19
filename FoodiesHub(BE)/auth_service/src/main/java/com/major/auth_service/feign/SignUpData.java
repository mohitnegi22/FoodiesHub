package com.major.auth_service.feign;


import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
public class SignUpData {

    private String emailId;
    private String password;
    private String name;
    private String city;
    private String state;
    private int zipCode;
    private String fullAddress;
    private long mobileNumber;
    private String otp;
    private String profileImagePath;
}