package com.major.restaurants_api.repository;

import com.major.restaurants_api.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByEmailId(String emailId);
    List<Order> findByRestaurantName(String restaurantName);

    List<Order> findByRazorpayOrderId(String razorpayOrderId);

    List<Order> findByRazorpayPaymentId(String razorpayPaymentId);
}