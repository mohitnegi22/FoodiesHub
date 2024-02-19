package com.major.restaurants_api.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Document(collection = "orders")
public class Order {
    @Id
    private String id;

    private String emailId;
    private String restaurantName;
    private String city;
    private String state;
    private int zipCode;
    private String fullAddress;
    private List<OrderItem> items;
    private double totalAmount;
    private String status;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;

    private List<Feedback> feedback = new ArrayList<>();

}
