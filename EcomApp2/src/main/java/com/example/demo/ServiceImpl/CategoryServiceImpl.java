package com.example.demo.ServiceImpl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.Dto.CategoryDTO;
import com.example.demo.Entity.Category;
import com.example.demo.Exception.ResourceNotFoundException;
import com.example.demo.Mappers.CategoryMapper;
import com.example.demo.Repository.CategoryRepo;
import com.example.demo.Service.CategoryService;

@Service
public class CategoryServiceImpl implements CategoryService {
    @Autowired
    private CategoryRepo categoryRepository;

    @Autowired
    private CategoryMapper categoryMapper;


    private final String uploadDir = "/Users/moha/Desktop/ECOMAPPWEB/EcomApp2/uploads/images/";



    


    @Override
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(categoryMapper::fromCategory)
                .collect(Collectors.toList());
    }



    @Override
    public CategoryDTO getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        return categoryMapper.fromCategory(category);
    }


    @Override
    public CategoryDTO saveCategory(CategoryDTO categoryDTO) {
        Category category = categoryMapper.toCategory(categoryDTO);
        if (categoryDTO.getParentId() != null) {
            Category parentCategory = categoryRepository.findById(categoryDTO.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent category not found"));
            category.setParentCategory(parentCategory);
        }
        return categoryMapper.fromCategory(categoryRepository.save(category));
    }

    @Override
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }



    @Override
    public CategoryDTO getCategoryWithSubCategories(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        return categoryMapper.fromCategory(category);
    }


    @Override
    public CategoryDTO saveCategory(String name, String description, MultipartFile file, Long parentId) {
        String fileName = file != null ? StringUtils.cleanPath(file.getOriginalFilename()) : null;
        String relativePath = fileName != null ? "uploads/images/" + fileName : null;

        if (fileName != null) {
            Path path = Paths.get(uploadDir + fileName);
            try {
                Files.createDirectories(path.getParent());
                Files.copy(file.getInputStream(), path);
            } catch (IOException e) {
                e.printStackTrace();
                throw new RuntimeException("Failed to store file " + fileName, e);
            }
        }

        CategoryDTO categoryDTO = new CategoryDTO();
        categoryDTO.setName(name);
        categoryDTO.setDescription(description);
        if (parentId != null) {
            categoryDTO.setParentId(parentId);
        }
        if (relativePath != null) {
            categoryDTO.setPicturePath(relativePath);
        }

        return saveCategory(categoryDTO);
    }

   

    @Override
    public CategoryDTO updateCategory(Long id, String name, String description, String picturePath) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        category.setName(name);
        category.setDescription(description);
        if (picturePath != null) {
            category.setPicturePath(picturePath);
        }
        return categoryMapper.fromCategory(categoryRepository.save(category));
    }



}
