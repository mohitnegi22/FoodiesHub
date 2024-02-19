package com.major.restaurants_api.service;

import com.major.restaurants_api.model.Restaurant;
import com.major.restaurants_api.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RestaurantServiceImpl implements RestaurantService{

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Override
    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    @Override
    public Restaurant getRestaurantById(String id) {
        return restaurantRepository.findById(id).orElse(null);
    }


    @Override
    public List<Restaurant> getRestaurantsByStateAndCity(String state, String city) {

        return restaurantRepository.findByStateAndCity(state, city);
    }
    @Override
    public List<String> getDistinctStates() {
        return restaurantRepository.findDistinctStates();
    }

    @Override
    public List<String> getCitiesByState(String state) {
        return restaurantRepository.findCitiesByState(state);
    }

    @Override
    public List<String> findAllCitiesByState(String state) {
        return restaurantRepository.findAllCitiesByState(state);
    }

}
