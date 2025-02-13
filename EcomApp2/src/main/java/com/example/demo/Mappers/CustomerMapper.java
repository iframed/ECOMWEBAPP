package com.example.demo.Mappers;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import com.example.demo.Dto.CustomerDTO;
import com.example.demo.Entity.Customer;

@Component
public class CustomerMapper {
    public CustomerDTO toCustomerDTO(Customer customer) {
        if (customer == null) return null;
        CustomerDTO customerDTO = new CustomerDTO();
        BeanUtils.copyProperties(customer, customerDTO);
        return customerDTO;
    }

    public Customer toCustomer(CustomerDTO customerDTO) {
        if (customerDTO == null) return null;
        Customer customer = new Customer();
        BeanUtils.copyProperties(customerDTO, customer);
        return customer;
    }
}
