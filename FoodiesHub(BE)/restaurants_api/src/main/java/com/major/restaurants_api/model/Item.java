package com.major.restaurants_api.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Objects;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Document
public class Item {


    @Id
    private String itemid;
    private String name;
    private double price;
    private double rating;
    private String image;
    private int quantity;
    private double updatedPrice;
    @Getter
    private String restaurantId;
    // Getter and setter methods for restaurantName
    @Getter
    private String restaurantName;


    public void increaseQuantity(int quantity) {
        if (quantity > 0) {
            this.quantity += quantity;
            this.updatedPrice = this.quantity * this.price;
        }
    }

    public void increaseQuantity2() {
        this.quantity++;
        this.updatedPrice = this.quantity * this.price;
    }

    public void decreaseQuantity() {
        if (this.quantity > 0) {
            this.quantity--;
            this.updatedPrice = this.quantity * this.price;
        }
    }

    
    public String getId() {
        return Objects.requireNonNullElse(itemid, "");
    }
}
