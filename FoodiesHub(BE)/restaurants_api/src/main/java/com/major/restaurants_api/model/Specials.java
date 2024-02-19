package com.major.restaurants_api.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Specials {
    private String discount;
    private String happy_hour;
}
