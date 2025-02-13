package com.example.demo.Dto;

import java.util.List;

import lombok.Data;

@Data
public class CategoryDTO {
    private Long id;
    private String name;
    private String description;
    private Long parentId;
    private List<CategoryDTO> subCategories;
    List<ProductDTO> products;
    private String PicturePath;
}
