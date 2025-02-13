package com.example.demo.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.Customer;
import com.example.demo.Entity.Roles;
import com.example.demo.Repository.CustomerRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private CustomerRepository userRepository;

    public CustomUserDetailsService(CustomerRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Customer user = userRepository.findByEmail(email);

        if (user != null) {
            return new org.springframework.security.core.userdetails.User(user.getEmail(),
                    user.getPassword(),
                    getAuthorities(user.getRoles()));
                    //mapRolesToAuthorities(user.getRoles()));
        }else{
            throw new UsernameNotFoundException("Invalid username or password.");
        }
    }
    
    


     private Collection<? extends GrantedAuthority> getAuthorities(
  Collection<Roles> roles) {
    List<GrantedAuthority> authorities = new ArrayList<>();
    for (Roles role: roles) {
        authorities.add(new SimpleGrantedAuthority(role.getName()));
       
                 
    }
    
    return authorities;
}
    
}
