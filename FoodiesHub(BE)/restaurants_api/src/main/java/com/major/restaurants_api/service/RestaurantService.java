package com.major.restaurants_api.service;

import com.major.restaurants_api.model.Restaurant;

import java.util.List;

public interface RestaurantService {
    List<Restaurant> getAllRestaurants();

    Restaurant getRestaurantById(String id);

    List<Restaurant> getRestaurantsByStateAndCity(String state, String city);

    List<String> getDistinctStates();

    List<String> getCitiesByState(String state);

     List<String> findAllCitiesByState(String state);


}
