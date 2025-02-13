package com.example.demo.Dto;

import java.util.Date;
import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class OrderDTO {
    private Long id;
    private Long customerId;
    private Date orderDate;
    private String status;
    private double totalAmount;
    private List<OrderItemDTO> orderItems;
   // private AddressDTO shippingAddress;
   // private AddressDTO billingAddress;
    private String customerEmail; //
}
