package com.major.restaurants_api.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HealthSafety {
    private boolean compliance;
    private String covid_measures;
}
