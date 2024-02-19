package com.major.restaurants_api.controller;

import java.math.BigInteger;

import com.major.restaurants_api.service.OrderRequest;
import com.major.restaurants_api.service.OrderResponse;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.*;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;

@RestController
@RequestMapping("/pg")
public class RazorpayController {

    private RazorpayClient client;
    private static final String SECRET_ID1 = "rzp_test_4ddJIE4qOr1O6c";
    private static final String SECRET_KEY1 = "va3xQnJGvPhyigNvgFq5b385";
    private static final String SECRET_ID2 = "rzp_test_J4fInjDpTX475d";
    private static final String SECRET_KEY2 = "r8fNXAB78RmsVfdiQbWGwyjr";

    @RequestMapping(path = "/createOrder", method = RequestMethod.POST)
    public OrderResponse createOrder(@RequestBody OrderRequest orderRequest) {
        System.out.println("Received OrderRequest: " + orderRequest);
        OrderResponse response = new OrderResponse();
        try {

            if (orderRequest.getTotalAmount().intValue() > 1000) {
                client = new RazorpayClient(SECRET_ID1, SECRET_KEY1);
            } else {
                client = new RazorpayClient(SECRET_ID2, SECRET_KEY2);
            }

            Order order = createRazorPayOrder(orderRequest.getTotalAmount());
            System.out.println("---------------------------");
            String orderId = (String) order.get("id");
            System.out.println("Order ID: " + orderId);
            System.out.println("---------------------------");
            response.setRazorpayOrderId(orderId);
            response.setApplicationFee("" + orderRequest.getTotalAmount());
            if (orderRequest.getTotalAmount().intValue() > 1000) {

                response.setSecretKey(SECRET_KEY1);
                response.setSecretId(SECRET_ID1);
                response.setPgName("razor1");
            } else {
                response.setSecretKey(SECRET_KEY2);
                response.setSecretId(SECRET_ID2);
                response.setPgName("razor2");
            }

            return response;
        } catch (RazorpayException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        return response;

    }

    private Order createRazorPayOrder(BigInteger amount) throws RazorpayException {

        JSONObject options = new JSONObject();
        options.put("amount", amount.multiply(new BigInteger("100")));
        options.put("currency", "INR");
        options.put("receipt", "txn_123456");
        options.put("payment_capture", 1); // You can enable this if you want to do Auto Capture.
        return client.orders.create(options);
    }
}