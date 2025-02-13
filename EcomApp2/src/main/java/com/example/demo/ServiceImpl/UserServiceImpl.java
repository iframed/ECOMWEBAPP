package com.example.demo.ServiceImpl;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.Dto.CustomerDTO;
import com.example.demo.Entity.Customer;
import com.example.demo.Entity.Roles;
import com.example.demo.Repository.CustomerRepository;
import com.example.demo.Repository.RoleRepository;
import com.example.demo.Service.UserService;

import jakarta.persistence.EntityNotFoundException;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private CustomerRepository userRepository;
    private RoleRepository roleRepository;
    private PasswordEncoder passwordEncoder;

    public UserServiceImpl(CustomerRepository userRepository,
                           RoleRepository roleRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    
    @Override
    public void saveUser(CustomerDTO userDto) {
        
        
        if (userDto.getPassword() == null) {
            throw new IllegalArgumentException("Password cannot be null");
        }
        Customer user = new Customer();
        user.setFirstname(userDto.getName() + " " + userDto.getEmail());
        user.setEmail(userDto.getEmail());
        // encrypt the password using spring security
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));

       Roles role = roleRepository.findByName("ADMIN");
       
       if(role == null){
            role = checkRoleExist();
        }
        user.setRoles(Arrays.asList(role));
       
        userRepository.save(user);
       
    }

    @Override
    public Customer findByCustomerEmail(String email) {
        return userRepository.findByEmail(email);
    }


   

    @Override
    public List<CustomerDTO> findAllUsers() {
        List<Customer> users = userRepository.findAll();
        return users.stream()
                .map((user) -> mapToUserDto(user))
                .collect(Collectors.toList());
    }

    private CustomerDTO mapToUserDto(Customer user){
        CustomerDTO userDto = new CustomerDTO();
        String[] str = user.getFirstname().split(" ");
        userDto.setId(user.getId());
        userDto.setName(str[0]);
        userDto.setPhone(str[1]);
        userDto.setEmail(user.getEmail());
        userDto.setPassword(user.getPassword());
        List<String> roles = user.getRoles().stream()
                                .map(role -> role.getName())
                                .collect(Collectors.toList());
                                userDto.setRoles(roles);
        return userDto;
    }

    private Roles checkRoleExist(){
        Roles role = new Roles();
        role.setName("ADMIN");
        return roleRepository.save(role);

    }


    

    
    
    @Override
    public void updateUserRole(Long id, List<String> newRoles) {
        Optional<Customer> userOptional = userRepository.findById(id);
        if (!userOptional.isPresent()) {
            throw new EntityNotFoundException("User not found");
        }
        Customer user = userOptional.get();
        List<Roles> userRoles = roleRepository.findAllByNameIn(newRoles);
        user.setRoles(userRoles);
        userRepository.save(user);
    }
    


    @Override
    public void suprimer(long Id) {
       
    }
    
}
