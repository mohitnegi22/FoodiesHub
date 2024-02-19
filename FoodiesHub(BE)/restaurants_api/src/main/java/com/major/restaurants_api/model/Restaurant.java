package com.major.restaurants_api.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "restaurant")
public class Restaurant {
    @Id
    private String _id;
    private String name;
    private String address;
    private String city;
    private String state;
    private double rating;
//    private Coordinates coordinates;
    private Contact contact;
    private List<String> cuisine;
    private List<Menu> menu;
    private List<Review> reviews;
    private Features features;
    private String images;
    private SocialMedia social_media;
    private List<String> payment_methods;
    private Specials specials;
    private HealthSafety health_safety;
}
