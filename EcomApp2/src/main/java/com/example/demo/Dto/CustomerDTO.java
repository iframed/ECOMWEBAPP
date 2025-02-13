package com.example.demo.Dto;

import java.util.List;

import lombok.Data;

@Data


public class CustomerDTO {
    private Long id;
    private String name;
    private String email;
    private String password;
    private String phone;
    private List<AddressDTO> addresses;
    private List<OrderDTO> orders;
    private List<String> roles;
    
}
