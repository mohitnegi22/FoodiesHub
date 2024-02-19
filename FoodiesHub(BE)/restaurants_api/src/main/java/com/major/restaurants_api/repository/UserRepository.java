package com.major.restaurants_api.repository;

import com.major.restaurants_api.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {

}