package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.Entity.Roles;

@Repository
public interface RoleRepository extends JpaRepository< Roles,Long> {
    Roles findByName(String name);

    List<Roles> findAllByNameIn(List<String> roles);
}
