package com.major.restaurants_api.service;

import com.major.restaurants_api.model.Order;

import java.util.List;

public interface OrderService {
    Order createOrder(Order order);
    List<Order> getUserOrders(String emailId);
    List<Order> getRestaurantOrders(String restaurantName);

    void updateAdminStatus(String orderId);
    List<Order> getOrdersByRazorpayOrderId(String razorpayOrderId);

    List<Order> getOrdersByRazorpayPaymentId(String razorpayPaymentId);
}