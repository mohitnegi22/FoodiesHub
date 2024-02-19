package com.major.restaurants_api.controller;

import com.major.restaurants_api.model.Feedback;
import com.major.restaurants_api.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/food-app")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;


    @PostMapping("/submitFeedback")
    public ResponseEntity<?> saveFeedback(@RequestBody Feedback feedback){
        System.out.println("Feedback data in controller = " + feedback);
        Map<String, Object> response = new HashMap<>();

        try{
            Feedback savedFeedback = feedbackService.saveFeedback(feedback);
            response.put("success", true);
            response.put("message", "Feedback saved successfully");
            return ResponseEntity.ok(response);

        }catch(Exception e){
            response.put("success", false);
            response.put("message", "Error saving feedback");
            return ResponseEntity.status(500).body(response);
        }
    }

}