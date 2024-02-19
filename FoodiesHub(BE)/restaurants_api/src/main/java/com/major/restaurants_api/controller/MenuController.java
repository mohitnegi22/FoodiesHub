package com.major.restaurants_api.controller;

import com.major.restaurants_api.model.Menu;
import com.major.restaurants_api.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/restaurants/{restaurantId}/menu")
public class MenuController {

    @Autowired
    private MenuService menuService;

    @GetMapping
    public List<Menu> getRestaurantMenu(@PathVariable String restaurantId) {
        return menuService.getRestaurantMenu(restaurantId);
    }

    @PostMapping
    public List<Menu> addDishToMenu(@PathVariable String restaurantId, @RequestBody Menu dish) {
        return menuService.addDishToMenu(restaurantId, dish);
    }

    @DeleteMapping("/{dishId}")
    public List<Menu> removeDishFromMenu(@PathVariable String restaurantId, @PathVariable String dishId) {
        return menuService.removeDishFromMenu(restaurantId, dishId);
    }

    @PutMapping("/{dishId}")
    public List<Menu> updateDishInMenu(@PathVariable String restaurantId, @PathVariable String dishId, @RequestBody Menu updatedDish) {
        return menuService.updateDishInMenu(restaurantId, dishId, updatedDish);
    }
}
