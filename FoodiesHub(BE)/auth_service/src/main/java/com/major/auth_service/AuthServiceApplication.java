package com.major.auth_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;
import org.springframework.core.Ordered;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.Collections;
@EnableDiscoveryClient
@SpringBootApplication
@EnableFeignClients
public class AuthServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(AuthServiceApplication.class, args);
	}

//	@Bean
//	public FilterRegistrationBean<JwtAuthorizationFilter> jwtAuthorizationFilter() {
//		FilterRegistrationBean<JwtAuthorizationFilter> registrationBean = new FilterRegistrationBean<>();
//		registrationBean.setFilter(new JwtAuthorizationFilter());
//		registrationBean.addUrlPatterns("/product-app/admin/*");
//		registrationBean.addUrlPatterns("/product-app/admin/addProduct");
//		registrationBean.addUrlPatterns("/product-app/getUserDetails");
//		registrationBean.addUrlPatterns("/product-app/get-All-Users");
//		registrationBean.addUrlPatterns("/auth-app/admin/get-all");
//		registrationBean.addUrlPatterns("/product-app/addProductToCart");
//		registrationBean.addUrlPatterns("/product-app/deleteFromCart/*");
//		registrationBean.addUrlPatterns("/product-app/updateCartItem/*");
//
//
//		return registrationBean;
//	}


//	@Bean
//	public FilterRegistrationBean<CorsFilter> corsFilter() {
//		CorsConfiguration config = new CorsConfiguration();
//		config.addAllowedOrigin("http://localhost:4200");
//		config.addAllowedHeader("*");
//		config.addAllowedMethod("*");
//		config.setAllowCredentials(true);
//
//		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//		source.registerCorsConfiguration("/**", config);
//
//		FilterRegistrationBean<CorsFilter> bean = new FilterRegistrationBean<>(new CorsFilter(source));
//		bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
//
//		return bean;
//	}


}
