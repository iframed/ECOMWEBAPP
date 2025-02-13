package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.Entity.order;

@Repository
public interface OrderRepository extends JpaRepository<order, Long> {
    List<order> findByCustomerEmail(String email);
}
