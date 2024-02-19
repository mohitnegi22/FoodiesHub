package com.major.restaurants_api;

import com.major.restaurants_api.filter.AdminAuthFilter;
import com.major.restaurants_api.filter.JwtAuthFilter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.core.Ordered;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@SpringBootApplication
@EnableDiscoveryClient
public class RestaurantsApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(RestaurantsApiApplication.class, args);
	}

	@Bean
	public FilterRegistrationBean<JwtAuthFilter> jwtAuthorizationFilter() {
		FilterRegistrationBean<JwtAuthFilter> registrationBean = new FilterRegistrationBean<>();
		registrationBean.setFilter(new JwtAuthFilter());
		registrationBean.addUrlPatterns("/food-app/getAccounts");
		registrationBean.addUrlPatterns("/food-app/deleteAccount");
		registrationBean.addUrlPatterns("/food-app/getUserDetails");
		registrationBean.addUrlPatterns("/food-app/addProductToCart");
		registrationBean.addUrlPatterns("/food-app/addProductToCartt");
		registrationBean.addUrlPatterns("/food-app/clearCart");
		registrationBean.addUrlPatterns("/food-app/decrease");
		registrationBean.addUrlPatterns("/food-app/removeProductFromCart");
		registrationBean.addUrlPatterns("/food-app/addToFavorites/*");
		registrationBean.addUrlPatterns("/food-app/removeFromFavorites/*");
		registrationBean.addUrlPatterns("/food-app/upload-profile-image");
		registrationBean.addUrlPatterns("/food-app/getUserDetailsForImage");
		registrationBean.addUrlPatterns("/food-app/getImage");
		registrationBean.addUrlPatterns("/food-app/updateUserDetails");
		registrationBean.addUrlPatterns("/cities/{state}");
//		registrationBean.addUrlPatterns("/restaurants/*");

		return registrationBean;
	}

//	@Bean
//	public FilterRegistrationBean<CorsFilter> corsFilter() {
//		final CorsConfiguration config = new CorsConfiguration();
//		config.setAllowCredentials(true);
//		config.addAllowedOrigin("http://localhost:4200");
//		config.addAllowedHeader("*");
//		config.addAllowedMethod("*");
//
//		final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//		source.registerCorsConfiguration("/**", config);
//
//		FilterRegistrationBean<CorsFilter> registrationBean = new FilterRegistrationBean<>(new CorsFilter(source));
//		registrationBean.setOrder(Ordered.HIGHEST_PRECEDENCE);
//
//		return registrationBean;
//	}
	@Bean
	public FilterRegistrationBean<AdminAuthFilter> AdminAuthFilter() {
		FilterRegistrationBean<AdminAuthFilter> AdminregistrationBean = new FilterRegistrationBean<>();
		AdminregistrationBean.setFilter(new AdminAuthFilter());
//		AdminregistrationBean.addUrlPatterns("/food-app/admin/getAccounts");
//		AdminregistrationBean.addUrlPatterns("/food-app/admin/deleteAccount");
		AdminregistrationBean.addUrlPatterns("/food-app/admin/restaurants/*");

		return AdminregistrationBean;
	}
}
