package com.major.restaurants_api.controller;

import com.major.restaurants_api.exceptions.UserNotFoundException;
import com.major.restaurants_api.model.Restaurant;
import com.major.restaurants_api.service.AdminService;
import com.major.restaurants_api.service.RestaurantService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/food-app")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private RestaurantService restaurantService;

    @GetMapping("/getAccounts")
    public ResponseEntity<?> getAllUsers(HttpServletRequest request){

        String role = (String)request.getAttribute("role");
        System.out.println("role in controller" + role);
        if("Admin".equals(role)) {
            return new ResponseEntity<>(adminService.getAllUsers(), HttpStatus.OK);
        }else{
            return new ResponseEntity<>("Oops! Access Denied", HttpStatus.FORBIDDEN);
        }
    }
    @DeleteMapping("/deleteAccount")
    public ResponseEntity<?> deleteUserAccount(@RequestBody Map<String,String> requestMap, HttpServletRequest request )
            throws UserNotFoundException {

        String emailId = requestMap.get("emailId");
        String role = (String) request.getAttribute("role");

        if("admin".equals(role)){
            try {
                adminService.deleteUserAccount(emailId);
                Map<String, String> SuccessResponse = new HashMap<>();
                SuccessResponse.put("message", "Deleted");
                return new ResponseEntity<>(SuccessResponse, HttpStatus.OK);
            }catch(UserNotFoundException e){
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "User not found");
                return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
            }
        }else{
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Unauthorized");
            return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/restaurants/{id}")
    public ResponseEntity<?> getRestaurantById(@PathVariable String id) {

        System.out.println("request recieved by conteroller " + id);
        Restaurant restaurant = restaurantService.getRestaurantById(id);
        return restaurant != null
                ? new ResponseEntity<>(restaurant, HttpStatus.OK)
                : new ResponseEntity<>("Restaurant not found", HttpStatus.NOT_FOUND);
    }

}