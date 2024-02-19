package com.major.restaurants_api.repository;

import com.major.restaurants_api.model.Feedback;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FeedbackRepository extends MongoRepository<Feedback, String> {
}