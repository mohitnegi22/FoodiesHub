package com.major.restaurants_api.service;


import com.major.restaurants_api.model.Menu;
import com.major.restaurants_api.repository.MenuRepository;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MenuServiceImpl implements MenuService {

    @Autowired
    private MenuRepository menuRepository;

    @Override
    public List<Menu> getRestaurantMenu(String restaurantId) {

        return menuRepository.findByRestaurantId(restaurantId);
    }

    @Override
    public List<Menu> addDishToMenu(String restaurantId, Menu dish) {

        dish.setRestaurantId(restaurantId);

        menuRepository.save(dish);
        return menuRepository.findByRestaurantId(restaurantId);
    }

    @Override
    public List<Menu> removeDishFromMenu(String restaurantId, String dishId) {

        menuRepository.deleteById(dishId);
        return menuRepository.findByRestaurantId(restaurantId);
    }

    @Override
    public List<Menu> updateDishInMenu(String restaurantId, String dishId, Menu updatedDish) {

        updatedDish.setId(dishId);
        updatedDish.setRestaurantId(restaurantId);
        menuRepository.save(updatedDish);
        return menuRepository.findByRestaurantId(restaurantId);
    }
}

