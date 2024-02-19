package com.major.restaurants_api.service;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigInteger;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequest {

    String emailId;
    String restaurantName;
    private List<OrderItem> items;
    BigInteger totalAmount;
    String fullAddress;
    String city;
    String state;
    String zipCode;

}