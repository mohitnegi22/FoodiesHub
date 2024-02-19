package com.major.restaurants_api.service;

import com.major.restaurants_api.model.Menu;

import java.util.List;

import java.util.List;

public interface MenuService {
    List<Menu> getRestaurantMenu(String restaurantId);

    List<Menu> addDishToMenu(String restaurantId, Menu dish);

    List<Menu> removeDishFromMenu(String restaurantId, String dishId);

    List<Menu> updateDishInMenu(String restaurantId, String dishId, Menu updatedDish);
}

