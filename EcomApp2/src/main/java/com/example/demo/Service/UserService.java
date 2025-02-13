package com.example.demo.Service;

import java.util.List;

import com.example.demo.Dto.CustomerDTO;
import com.example.demo.Entity.Customer;

public interface UserService {
    void saveUser(CustomerDTO customerDTO);

    Customer findByCustomerEmail(String email);

    List<CustomerDTO> findAllUsers();
    void updateUserRole(Long id, List<String> roles);

    void suprimer(long Id);
}
