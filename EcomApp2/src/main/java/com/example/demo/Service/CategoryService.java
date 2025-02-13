package com.example.demo.Service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.example.demo.Dto.CategoryDTO;

public interface CategoryService {

    List<CategoryDTO> getAllCategories();
    CategoryDTO getCategoryById(Long id);
    CategoryDTO saveCategory(CategoryDTO categoryDTO);
    void deleteCategory(Long id);
    CategoryDTO getCategoryWithSubCategories(Long id);
    CategoryDTO saveCategory(String name, String description, MultipartFile file, Long parentId);
    CategoryDTO updateCategory(Long id, String name, String description, String picturePath);

}
