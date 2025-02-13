package com.example.demo.Service;

import java.util.List;

import com.example.demo.Dto.CustomerDTO;

public interface CustomerService  {
    
    List<CustomerDTO> getAllCustomers();
    CustomerDTO getCustomerById(Long id);
    CustomerDTO createCustomer(CustomerDTO customerDTO);
    CustomerDTO updateCustomer(Long id, CustomerDTO customerDTO);
    void deleteCustomer(Long id);
}
