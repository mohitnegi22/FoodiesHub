package com.major.restaurants_api.model;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Document
public class Feedback {

    @Id
    private String emailId;
    private String reaction;
    private String suggestion;
    private String orderid;

}
