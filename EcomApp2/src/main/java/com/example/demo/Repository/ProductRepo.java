package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.Entity.Product;



@Repository
public interface ProductRepo extends JpaRepository< Product,Long> {
    
    List<Product> findByNameContainingIgnoreCase(String name);
}
