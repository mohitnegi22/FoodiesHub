package com.major.restaurants_api.service;

import com.major.restaurants_api.model.Feedback;
import com.major.restaurants_api.model.Order;
import com.major.restaurants_api.repository.FeedbackRepository;
import com.major.restaurants_api.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private OrderRepository orderRepository;

    public Feedback saveFeedback(Feedback feedback){

        System.out.println("feedback service recived = " + feedback);

        Optional<Order> optionalOrder = orderRepository.findById(feedback.getOrderid());
        if(optionalOrder.isPresent()){
            Order order = optionalOrder.get();
            List<Feedback> feedBackList =  order.getFeedback();
            feedBackList.add(feedback);
            order.setFeedback(feedBackList);
            orderRepository.save(order);
        }
        return null; //later needs to be changed
    }











//    public Order addFeedbackToOrder(String orderId, Feedback feedback) {
//        Order order = orderRepository.findById(orderId)
//                .orElseThrow(() -> new OrderNotFoundException("Order not found with ID: " + orderId));
//
//        feedback.setOrder(order);
//
//        if (order.getFeedback() == null) {
//            order.setFeedback(new ArrayList<>());
//        }
//
//        order.getFeedback().add(feedback);
//        orderRepository.save(order);
//
//        return order;
//    }


}

