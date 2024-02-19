package com.major.restaurants_api.service;

import com.major.restaurants_api.exceptions.OrderNotFoundException;
import com.major.restaurants_api.model.Order;
import com.major.restaurants_api.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Override
    public Order createOrder(Order order) {
        order.setStatus("Ordered");
        return orderRepository.save(order);
    }

    @Override
    public List<Order> getUserOrders(String emailId) {
        return orderRepository.findByEmailId(emailId);
    }

    @Override
    public List<Order> getRestaurantOrders(String restaurantName) {
        return orderRepository.findByRestaurantName(restaurantName);
    }

    @Override
    public List<Order> getOrdersByRazorpayOrderId(String razorpayOrderId) {
        return orderRepository.findByRazorpayOrderId(razorpayOrderId);
    }

    @Override
    public List<Order> getOrdersByRazorpayPaymentId(String razorpayPaymentId) {
        return orderRepository.findByRazorpayPaymentId(razorpayPaymentId);
    }

    @Override
    public void updateAdminStatus(String orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new OrderNotFoundException("Order not found with ID: " + orderId));
        order.setStatus("Delivered");
        orderRepository.save(order);
    }
}
