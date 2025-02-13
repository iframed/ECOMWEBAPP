package com.example.demo.Mappers;

import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;

import org.springframework.stereotype.Component;

import com.example.demo.Dto.CategoryDTO;
import com.example.demo.Entity.Category;


@Component
public class CategoryMapper {


   
    private final ProductMapper productMapper;

    public CategoryMapper(ProductMapper productMapper) {
        this.productMapper = productMapper;
    }

    public CategoryDTO fromCategory(Category category) {
        CategoryDTO categoryDTO = new CategoryDTO();
        BeanUtils.copyProperties(category, categoryDTO);
        if (category.getParentCategory() != null) {
            categoryDTO.setParentId(category.getParentCategory().getId());
        }
        if (category.getSubCategories() != null) {
            categoryDTO.setSubCategories(category.getSubCategories().stream()
                    .map(this::fromCategory)
                    .collect(Collectors.toList()));
        }
        if (category.getProducts() != null) {
            categoryDTO.setProducts(category.getProducts().stream()
                    .map(productMapper::fromProduct)
                    .collect(Collectors.toList()));
        }
        return categoryDTO;
    }

    public Category toCategory(CategoryDTO categoryDTO) {
        Category category = new Category();
        BeanUtils.copyProperties(categoryDTO, category);
        return category;
    }
}
