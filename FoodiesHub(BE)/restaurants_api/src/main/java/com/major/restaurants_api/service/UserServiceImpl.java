package com.major.restaurants_api.service;

import com.major.restaurants_api.model.Item;
import com.major.restaurants_api.model.Restaurant;
import com.major.restaurants_api.model.User;
import com.major.restaurants_api.repository.RestaurantRepository;
import com.major.restaurants_api.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Objects;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private RestaurantRepository restaurantRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private GridFsTemplate gridFsTemplate;

    @Autowired
    private GridFsOperations gridFsOperations;

    @Override
    public User registerUser(User user) {
        System.out.println("food-app service received " + user);
        return userRepository.save(user);

    }

    @Override
    public User getUserDetails(String emailId) {
        System.out.println("Received request for user details. Email: " + emailId);

        try {
            Optional<User> optionalUser = userRepository.findById(emailId);
            User user = optionalUser.orElse(null);
            System.out.println("User details retrieved: " + user);
            return user;
        } catch (Exception e) {
            System.err.println("Error fetching user details: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    //======================================CART================================================

    @Override
    public User addProductToCart(String emailid, Item item) {
        User user = userRepository.findById(emailid).orElseThrow(() -> new RuntimeException("User not found"));
        System.out.println("hello"+user);
        Optional<Item> existingItem = user.getCart().stream()
                .filter(cartItem -> cartItem.getName().equals(item.getName()))
                .findFirst();
        System.out.println("item quantity is "+item.getQuantity());
        if (existingItem.isPresent()) {
            existingItem.get().increaseQuantity(item.getQuantity());
        } else {
            item.setQuantity(item.getQuantity());
            item.setUpdatedPrice(item.getPrice()*item.getQuantity());
            item.setRestaurantId(item.getRestaurantId());
            item.setRestaurantName(item.getRestaurantName());
            user.getCart().add(item);
        }
        System.out.println(item);
        updateTotalCartPrice(user);
        System.out.println(user);
        return userRepository.save(user);
    }

    @Override
    public User addProductToCartt(String emailid, Item item) {
        System.out.println("it works");
        User user = userRepository
                .findById(emailid).orElseThrow(() -> new RuntimeException("User not found"));
        System.out.println("b works");
        System.out.println(item);
        Optional<Item> existingItem = user.getCart().stream()
                .filter(cartItem -> cartItem.getName().equals(item.getName()))
                .findFirst();
        System.out.println(existingItem);
        System.out.println("item quantity is "+item.getQuantity());
        if (existingItem.isPresent()) {
            existingItem.get().increaseQuantity2();
        } else {
            item.setQuantity(1);
            item.setUpdatedPrice(item.getPrice());
            item.setRestaurantId(item.getRestaurantId());
            item.setRestaurantName(item.getRestaurantName());
            user.getCart().add(item);
        }
        System.out.println(item);
        updateTotalCartPrice(user);
        System.out.println(user);
        return userRepository.save(user);
    }

    @Override
    public User decreaseQuantityAndPrice(String emailid, Item item) {
        User user = userRepository.findById(emailid).orElseThrow(() -> new RuntimeException("User not found"));

        Optional<Item> existingItem = user.getCart().stream()
                .filter(cartItem -> cartItem.getName().equals(item.getName()))
                .findFirst();

        existingItem.ifPresent(cartItem -> {
            cartItem.decreaseQuantity();

            if (cartItem.getQuantity() == 0) {
                user.getCart().remove(cartItem);
            }
        });
        updateTotalCartPrice(user);
        return userRepository.save(user);
    }

    private void updateTotalCartPrice(User user) {
        double totalCartPrice = user.getCart().stream()
                .mapToDouble(item -> item.getUpdatedPrice())
                .sum();
        user.setTotalCartPrice(totalCartPrice);
    }

    @Override
    public User removeProductFromCart(String emailId, Item item) {
        System.out.println("Removing product: " + item);
        User user = userRepository.findById(emailId).orElse(null);

        if (user != null) {
            String productNameToRemove = item.getName();

            if (productNameToRemove != null) {
                user.getCart().removeIf(p -> productNameToRemove.equals(p.getName()));
                updateTotalCartPrice(user);
            } else {
                throw new RuntimeException("Product name is null");
            }

            System.out.println("User after removal: " + user);
            return userRepository.save(user);
        } else {
            throw new RuntimeException("User not found");
        }
    }


    @Override
    public User clearCartItems(String emailId) {
        User user = userRepository.findById(emailId).orElseThrow(() -> new RuntimeException("User not found"));

        if (user != null) {
            user.getCart().clear();
            updateTotalCartPrice(user);
            return userRepository.save(user);
        } else {
            throw new RuntimeException("User not found");
        }
    }

    @Override
    public User addFavoriteRestaurant(String emailId, String restaurantId) {
        try {
            Optional<User> optionalUser = userRepository.findById(emailId);
            User user = optionalUser.orElse(null);

            if (user != null && restaurantId != null) {
                Restaurant restaurant = restaurantRepository.findById(restaurantId)
                        .orElseThrow(() -> new RuntimeException("Restaurant not found"));

                if (!user.getFavourites().contains(restaurant)) {
                    user.getFavourites().add(restaurant);
                    userRepository.save(user);
                }
            }

            return user;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public User removeFavoriteRestaurant(String emailId, String restaurantId) {
        try {
            Optional<User> optionalUser = userRepository.findById(emailId);
            User user = optionalUser.orElse(null);

            if (user != null && restaurantId != null) {
                Restaurant restaurant = restaurantRepository.findById(restaurantId)
                        .orElseThrow(() -> new RuntimeException("Restaurant not found"));

                user.getFavourites().remove(restaurant);
                userRepository.save(user);
            }

            return user;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @Value("${upload.directory}")
    private String uploadDirectory;

    @Override
    public String uploadProfileImage(String emailId, MultipartFile profileImage) throws IOException {

        String fileName = generateUniqueFileName(profileImage.getOriginalFilename());
        Path filePath = Paths.get(uploadDirectory, fileName);

        Files.copy(profileImage.getInputStream(), filePath);
        String imageUrl = fileName;
        System.out.println("Profile image stored. Image URL: " + imageUrl);

        User user = userRepository.findById(emailId).orElse(null);
        if (user != null) {
            user.setProfileImagePath(imageUrl);
            userRepository.save(user);
        }

        return imageUrl;
    }


    private String generateUniqueFileName(String originalFileName) {
        return System.currentTimeMillis() + "_" + originalFileName;
    }


    @Override
    public User updateUserDetails(String emailId, User updatedUser) {
        User user = userRepository.findById(emailId).orElseThrow(() -> new EntityNotFoundException("User not found"));

        user.setName(updatedUser.getName());
        user.setCity(updatedUser.getCity());
        user.setState(updatedUser.getState());
        user.setZipCode(updatedUser.getZipCode());
        user.setFullAddress(updatedUser.getFullAddress());
        user.setMobileNumber(updatedUser.getMobileNumber());

        return userRepository.save(user);
    }

//============================================================================================



//    public String uploadProfileImage(String emailId, MultipartFile profileImage) throws IOException {
//        String fileName = storeProfileImage(profileImage);
//
//        System.out.println("Profile image stored. FileName: " + fileName);
//
//        User user = userRepository.findById(emailId)
//                .orElseThrow(() -> new EntityNotFoundException("User not found"));
//
//        user.setProfileImageUrl("/uploads/" + fileName);
//        userRepository.save(user);
//
//        System.out.println("User profile image updated. New URL: " + user.getProfileImageUrl());
//
//        return user.getProfileImageUrl();
//    }

//    private String storeProfileImage(MultipartFile profileImage) throws IOException {
//        String fileName = Objects.requireNonNull(profileImage.getOriginalFilename());
//
//        System.out.println("Storing profile image. FileName: " + fileName);
//
//        InputStream inputStream = profileImage.getInputStream();
//        String fileId = gridFsTemplate.store(inputStream, fileName, profileImage.getContentType()).toString();
//
//        System.out.println("Profile image stored in MongoDB. FileId: " + fileId);
//
//        return fileId;
//    }

    public String uploadSignUpProfileImage(String emailId, MultipartFile profileImage) {
        try {
            String fileName = System.currentTimeMillis() + "_" +
                    profileImage.getOriginalFilename();
            Path filePath = Paths.get(uploadDirectory, fileName);

            Files.copy(profileImage.getInputStream(), filePath);

            String imageUrl = fileName;

            System.out.println("Profile image stored. Image URL: " + imageUrl);
            return imageUrl;
        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("Error uploading profile image.");
            return null;
        }
    }

}