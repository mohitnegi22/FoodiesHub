package com.major.restaurants_api.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Document(collection = "user")
public class User {
    @Id
    private String emailId;
    private String name;
    private String city;
    private String state;
    private int zipCode;
    private String fullAddress;
    private long mobileNumber;
    private double totalCartPrice;

    private List<Item> cart;
    private List<?> orderHistory;
    private List<Restaurant> favourites;
    private String profileImagePath;



}
