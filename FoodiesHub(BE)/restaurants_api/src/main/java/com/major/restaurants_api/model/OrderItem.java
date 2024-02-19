package com.major.restaurants_api.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class OrderItem {
    private String name;
    private double price;
    private int quantity;
    private String image;
}
