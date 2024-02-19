package com.major.restaurants_api.controller;

import com.major.restaurants_api.model.Restaurant;
import com.major.restaurants_api.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class RestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    @GetMapping("/restaurants")
    public ResponseEntity<?> getRestaurants(@RequestParam(required = false) String state,
                                            @RequestParam(required = false) String city) {
        if (state != null && city != null) {
            System.out.println(state + city);
            List<Restaurant> restaurants = restaurantService.getRestaurantsByStateAndCity(state, city);
            System.out.println(restaurants);
            return new ResponseEntity<>(restaurants, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(restaurantService.getAllRestaurants(), HttpStatus.OK);
        }
    }

    @GetMapping("/restaurants/{id}")
    public ResponseEntity<?> getRestaurantById(@PathVariable String id) {
        Restaurant restaurant = restaurantService.getRestaurantById(id);
        return restaurant != null
                ? new ResponseEntity<>(restaurant, HttpStatus.OK)
                : new ResponseEntity<>("Restaurant not found", HttpStatus.NOT_FOUND);
    }

    @GetMapping("/states")
    public ResponseEntity<List<String>> getDistinctStates() {
        List<String> states = restaurantService.getDistinctStates();
        System.out.println("It works");
        System.out.println(states);
        return new ResponseEntity<>(states, HttpStatus.OK);
    }

    @GetMapping("/cities/{state}")
    public ResponseEntity<List<String>> getCitiesByState(@PathVariable String state) {
        System.out.println("city block works");
        List<String> cities = restaurantService.getCitiesByState(state);
        System.out.println(cities);
        return new ResponseEntity<>(cities, HttpStatus.OK);
    }


    @GetMapping("/cities/{state}/all")
    public ResponseEntity<List<String>> getAllCitiesByState(@PathVariable String state) {
        List<String> cities = restaurantService.findAllCitiesByState(state);
        return new ResponseEntity<>(cities, HttpStatus.OK);
    }

}
