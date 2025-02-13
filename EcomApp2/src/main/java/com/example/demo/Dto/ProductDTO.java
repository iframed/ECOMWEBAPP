package com.example.demo.Dto;

import java.util.List;
import java.util.Map;

import lombok.Data;

@Data
public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private double price;
    private Long categoryId;
    private List<String> colors;
    private Map<String, List<String>> images; 
    private double discount;
    private List<String> sizes;
    private int stock;
}
