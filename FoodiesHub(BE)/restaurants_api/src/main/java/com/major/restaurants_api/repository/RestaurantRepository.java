package com.major.restaurants_api.repository;

import com.major.restaurants_api.model.Menu;
import com.major.restaurants_api.model.Restaurant;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface RestaurantRepository extends MongoRepository<Restaurant,String> {
    List<Restaurant> findByStateAndCity(String state, String city);

    @Query(value = "{'state': {$exists: true}}", fields = "{'state': 1}")
    List<String> findDistinctStates();

    @Query(value = "{'state': ?0, 'city': {$exists: true}}", fields = "{'city': 1, '_id': 0}")
    List<String> findCitiesByState(String state);


    @Query(value = "{'state': ?0, 'city': {$exists: true}}", fields = "{'city': 1, '_id': 0}")
    List<String> findAllCitiesByState(String state);

}
