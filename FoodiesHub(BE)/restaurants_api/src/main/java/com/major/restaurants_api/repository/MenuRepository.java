package com.major.restaurants_api.repository;


import com.major.restaurants_api.model.Menu;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;



@Repository
public interface MenuRepository extends MongoRepository<Menu, String> {

    List<Menu> findByRestaurantId(String restaurantId);
}


