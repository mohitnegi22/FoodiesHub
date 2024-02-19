package com.major.restaurants_api.controller;

import com.major.restaurants_api.exceptions.ItemNotFoundException;
import com.major.restaurants_api.model.Item;
import com.major.restaurants_api.model.User;
import com.major.restaurants_api.service.UserServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/food-app")
public class UserController {

    @Autowired
    private Environment environment;

    @Value("${upload.directory}")
    private String uploadDirectory;
    @Autowired
    private UserServiceImpl userService;

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {

        try {
            System.out.println("food-app received feign data " + user);
            user.setCart(new ArrayList<>());
            user.setFavourites(new ArrayList<>());
            user.setOrderHistory(new ArrayList<>());

            User registeredUser = userService.registerUser(user);
            System.out.println("food-app user final data " + registeredUser);
            return new ResponseEntity<>(registeredUser, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getUserDetails")
    public ResponseEntity<?> getUserDetails(HttpServletRequest request){

        String currentUserEmailId = (String)request.getAttribute("currentUserEmailId");

        System.out.println("request received by controller" + currentUserEmailId);
        return new ResponseEntity<>(userService.getUserDetails(currentUserEmailId), HttpStatus.OK);
    }
    //====================================CART====================================================================

    @PostMapping("/addProductToCart")
    public ResponseEntity<?> addProductToCart(@RequestBody Item item, HttpServletRequest request) {
        try {
            String currentUserEmailId = (String) request.getAttribute("currentUserEmailId");
            userService.addProductToCart(currentUserEmailId, item);

            return new ResponseEntity<>(userService.getUserDetails(currentUserEmailId), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error adding product.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @DeleteMapping("/clearCart")
    public ResponseEntity<?> clearCart(HttpServletRequest request) {
        try {
            System.out.println("clearing");
            String currentUserEmailId = (String) request.getAttribute("currentUserEmailId");
            userService.clearCartItems(currentUserEmailId);
            return new ResponseEntity<>(userService.getUserDetails(currentUserEmailId), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error clearing cart: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PostMapping("/addProductToCartt")
    public ResponseEntity<?> addProductToCart2(@RequestBody Item item, HttpServletRequest request) {
        try {
            System.out.println(item);
            String currentUserEmailId = (String) request.getAttribute("currentUserEmailId");
            userService.addProductToCartt(currentUserEmailId, item);
            System.out.println(item);
            return new ResponseEntity<>(userService.getUserDetails(currentUserEmailId), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error adding product.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/decrease")
    public ResponseEntity<?> decreaseProductFromCart(@RequestBody Item item, HttpServletRequest request) {
        try {
            String currentUserEmailId = (String) request.getAttribute("currentUserEmailId");
            userService.decreaseQuantityAndPrice(currentUserEmailId, item);

            return new ResponseEntity<>(userService.getUserDetails(currentUserEmailId), HttpStatus.OK);
        } catch (ItemNotFoundException e) {
            return new ResponseEntity<>("Product not found in cart.", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error decreasing product.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @DeleteMapping("/removeProductFromCart")
    public ResponseEntity<?> removeProductFromCart(@RequestBody Item item, HttpServletRequest request) {
        try {
            String currentUserEmailId = (String) request.getAttribute("currentUserEmailId");
            userService.removeProductFromCart(currentUserEmailId, item);

            return new ResponseEntity<>(userService.getUserDetails(currentUserEmailId), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error removing product: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PostMapping("/addToFavorites/{restaurantId}")
    public ResponseEntity<User> addFavoriteRestaurant(@PathVariable String restaurantId, HttpServletRequest request) {
        String currentUserEmailId = (String) request.getAttribute("currentUserEmailId");
        User user = userService.addFavoriteRestaurant(currentUserEmailId, restaurantId);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/removeFromFavorites/{restaurantId}")
    public ResponseEntity<User> removeFavoriteRestaurant(@PathVariable String restaurantId, HttpServletRequest request) {
        String currentUserEmailId = (String) request.getAttribute("currentUserEmailId");
        System.out.println(restaurantId + request);
        User user = userService.removeFavoriteRestaurant(currentUserEmailId, restaurantId);
        return ResponseEntity.ok(user);
    }
    //============================================================================================================
    @PostMapping("/upload-profile-image")
    public ResponseEntity<?> uploadProfileImage(@RequestParam("emailId") String emailId,
                                                @RequestPart("profileImage") MultipartFile profileImage, HttpServletRequest request) {

        String currentUserEmailId = (String) request.getAttribute("currentUserEmailId");
        System.out.println("Request received by controller for profile image upload = " + currentUserEmailId);

        Map<String, String> responseMap = new HashMap<>();

        if (currentUserEmailId != null) {
            try {
                String imageUrl = userService.uploadProfileImage(currentUserEmailId, profileImage);

                responseMap.put("status", "success");
                responseMap.put("message", "Profile image uploaded successfully.");
                responseMap.put("imageUrl", imageUrl);
            } catch (Exception e) {
                responseMap.put("status", "error");
                responseMap.put("message", "Failed to upload profile image: " + e.getMessage());
            }
        } else {
            responseMap.put("status", "forbidden");
            responseMap.put("message", "Forbidden");
        }

        return ResponseEntity.ok(responseMap);
    }


    @PutMapping("/updateUserDetails")
    public ResponseEntity<?> updateUserDetails(@RequestBody User user, HttpServletRequest request) {
        String currentUserEmailId = (String) request.getAttribute("currentUserEmailId");

        try {
            User updatedUser = userService.updateUserDetails(currentUserEmailId, user);
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating user details: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getUserDetailsForImage")
    public ResponseEntity<?> getUserDetailsForImage(HttpServletRequest request) {
        String currentUserEmailId = (String) request.getAttribute("currentUserEmailId");

        System.out.println("getUserDetailsForImage emaild = " + currentUserEmailId);

        User userDetails = userService.getUserDetails(currentUserEmailId);
        System.out.println("getUserDetailsForImage userdetails = " + userDetails);


        if (userDetails != null && userDetails.getProfileImagePath() != null) {
            System.out.println("img path = "+userDetails.getProfileImagePath());
            Map<String, Object> response = new HashMap<>();
            response.put("user", userDetails);
            response.put("uploadDirectory", environment.getProperty("upload.directory"));
            System.out.println("response inside if block = " + response);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            System.out.println("something is null");
            return new ResponseEntity<>("User details or profile image not found", HttpStatus.NOT_FOUND);
        }
    }


    @GetMapping("/getImage/{imageName}")
    public ResponseEntity<byte[]> getImage(@PathVariable String imageName) throws IOException {
        if (imageName == null) {
            System.out.println("Image name is null");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        String decodedImageName = URLDecoder.decode(imageName, StandardCharsets.UTF_8.toString());
        System.out.println("Decoded image name = " + decodedImageName);

        String filePath = Paths.get(uploadDirectory, decodedImageName).toString();
        Path path = Paths.get(filePath);

        System.out.println("Path of image = " + path);
        byte[] media = Files.readAllBytes(path);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        headers.setContentType(MediaType.IMAGE_JPEG);

        return new ResponseEntity<>(media, headers, HttpStatus.OK);
    }


    @PostMapping("/uploadSignUpProfileImage")
    public ResponseEntity<Map<String, Object>> uploadSignUpProfileImage(
            @RequestParam String emailId,
            @RequestPart("profileImage") MultipartFile profileImage) {

        Map<String, Object> responseMap = new HashMap<>();

        try {
//            ResponseEntity<Map<String, Object>> uploadResponse = userService.uploadSignUpProfileImage(emailId, profileImage);
            String imageUrl = userService.uploadSignUpProfileImage(emailId, profileImage);

//            responseMap.putAll(uploadResponse.getBody());
            responseMap.put("status", "success");
            responseMap.put("message", "Profile image uploaded successfully");
            responseMap.put("imageUrl", imageUrl);
            return ResponseEntity.ok(responseMap);

        } catch (Exception e) {
            responseMap.put("status", "error");
            responseMap.put("message", "Failed to upload profile image: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseMap);

        }
    }
}
