package com.major.restaurants_api.service;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {

    String secretKey;
    String razorpayOrderId;
    String applicationFee;
    String secretId;
    String pgName;


}
