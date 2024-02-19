package com.major.restaurants_api.service;

import com.major.restaurants_api.model.Item;
import com.major.restaurants_api.model.Menu;
import com.major.restaurants_api.model.User;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface UserService {

    User registerUser(User user);

    User getUserDetails(String emailId);

    User addProductToCart(String emailid, Item item);
    User addProductToCartt(String emailid, Item item);
    User decreaseQuantityAndPrice(String emailid, Item item);
    User removeProductFromCart(String emailId, Item item);


    User clearCartItems(String emailId);

    User addFavoriteRestaurant(String emailId, String restaurantId);
    User removeFavoriteRestaurant(String emailId, String restaurantId);
    String uploadProfileImage(String emailId, MultipartFile profileImage) throws IOException;
    User updateUserDetails(String emailId, User updatedUser);

}