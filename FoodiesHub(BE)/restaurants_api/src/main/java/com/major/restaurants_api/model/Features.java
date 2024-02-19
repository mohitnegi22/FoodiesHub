package com.major.restaurants_api.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Features {
    private boolean delivery;
    private boolean takeout;
    private boolean reservation;
}
