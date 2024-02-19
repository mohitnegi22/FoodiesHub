package com.major.restaurants_api.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Menu {
    @Id
    private String id;
    private String name;
    private double price;
    private double rating;
    private String image;
    private String type;
    private String restaurantId;
}
