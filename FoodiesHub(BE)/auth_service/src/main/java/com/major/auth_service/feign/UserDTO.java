package com.major.auth_service.feign;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserDTO {

    private String emailId;
    private String name;
    private String city;
    private String state;
    private int zipCode;
    private String fullAddress;
    private long mobileNumber;
    private String profileImagePath;
}
