package com.major.auth_service.feign;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name="food-app", url="localhost:8888")
public interface UserProxy {

    @PostMapping("/food-app/register")
    ResponseEntity<?> sendDataToFoodApp(UserDTO userDTO);

}
