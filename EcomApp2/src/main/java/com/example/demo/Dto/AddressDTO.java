package com.example.demo.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AddressDTO {
    private Long id;
    private Long customerId;
    private String street;
    private String city;
    private String state;
    private String postalCode;
    private String country;
}
