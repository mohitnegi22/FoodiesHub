package com.major.restaurants_api.controller;

import com.major.restaurants_api.model.Order;
import com.major.restaurants_api.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestBody Order order) {
        try {
            Order createdOrder = orderService.createOrder(order);
            return new ResponseEntity<>(createdOrder, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error creating order: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/user/{emailId}")
    public ResponseEntity<?> getUserOrders(@PathVariable String emailId) {
        try {
            System.out.println("Fetching orders for emailId: " + emailId);
            List<Order> userOrders = orderService.getUserOrders(emailId);
            System.out.println("User orders: " + userOrders);
            return new ResponseEntity<>(userOrders, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("Error retrieving user orders: " + e.getMessage());
            return new ResponseEntity<>("Error retrieving user orders: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/restaurant/{restaurantName}")
    public ResponseEntity<?> getRestaurantOrders(@PathVariable String restaurantName) {
        try {
            List<Order> restaurantOrders = orderService.getRestaurantOrders(restaurantName);
            return new ResponseEntity<>(restaurantOrders, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving restaurant orders: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/update-admin-status/{orderId}")
    public void updateAdminStatus(@PathVariable String orderId) {
        orderService.updateAdminStatus(orderId);
    }
}