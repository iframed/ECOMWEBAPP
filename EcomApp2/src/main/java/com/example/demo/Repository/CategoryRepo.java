package com.example.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.Entity.Category;


@Repository
public interface CategoryRepo  extends JpaRepository<Category,Long> {
    
}
