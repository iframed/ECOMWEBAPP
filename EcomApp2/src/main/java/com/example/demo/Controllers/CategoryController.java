package com.example.demo.Controllers;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.Dto.CategoryDTO;
import com.example.demo.Service.CategoryService;



@RestController
@CrossOrigin("http://localhost:4200")
@RequestMapping("/api")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;



    private final String uploadDir = "/Users/moha/Desktop/ECOMAPPWEB/EcomApp2/uploads/images/";

   /*  @PostMapping("/categories/create")
    public CategoryDTO createCategory(@RequestBody CategoryDTO categoryDTO) {
        return categoryService.saveCategory(categoryDTO);
    }*/
    @PostMapping("/categories/create")
    public ResponseEntity<CategoryDTO> createCategory(@RequestPart("name") String name,
                                                      @RequestPart("description") String description,
                                                      @RequestPart(value = "file", required = false) MultipartFile file) {
        return ResponseEntity.ok(categoryService.saveCategory(name, description, file, null));
    }


   /* @PostMapping("/categories/create-subcategory")
    public CategoryDTO createSubCategory(@RequestBody CategoryDTO categoryDTO, @RequestParam Long parentId) {
        categoryDTO.setParentId(parentId);
        return categoryService.saveCategory(categoryDTO);
    }*/ 
    @PostMapping("/categories/create-subcategory")
    public ResponseEntity<CategoryDTO> createSubCategory(@RequestPart("name") String name,
                                                         @RequestPart("description") String description,
                                                         @RequestPart(value = "file", required = false) MultipartFile file,
                                                         @RequestParam Long parentId) {
        return ResponseEntity.ok(categoryService.saveCategory(name, description, file, parentId));
    }

    /* @PostMapping("/categories/create-subsubcategory")
    public CategoryDTO createSubSubCategory(@RequestBody CategoryDTO categoryDTO, @RequestParam Long parentId) {
        categoryDTO.setParentId(parentId);
        return categoryService.saveCategory(categoryDTO);
    }*/

    @PostMapping("/categories/create-subsubcategory")
    public ResponseEntity<CategoryDTO> createSubSubCategory(@RequestPart String name,
                                                                     @RequestPart String description,
                                                                     @RequestPart("file") MultipartFile file,
                                                                     @RequestParam Long parentId) {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        Path path = Paths.get(uploadDir + fileName);

        try {
            Files.createDirectories(path.getParent());
            Files.copy(file.getInputStream(), path);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }

        String relativePath = "uploads/images/" + fileName;

        CategoryDTO categoryDTO = new CategoryDTO();
        categoryDTO.setName(name);
        categoryDTO.setDescription(description);
        categoryDTO.setParentId(parentId);
        categoryDTO.setPicturePath(relativePath);

        return ResponseEntity.ok(categoryService.saveCategory(categoryDTO));
    }


    @GetMapping("/categories/{id}/with-subcategories")
    public CategoryDTO getCategoryWithSubCategories(@PathVariable Long id) {
        return categoryService.getCategoryWithSubCategories(id);
    }

    @GetMapping("/categories")
    public List<CategoryDTO> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @GetMapping("/categories/{id}")
    public CategoryDTO getCategoryById(@PathVariable Long id) {
        return categoryService.getCategoryById(id);
    }


    @PutMapping("/categories/update/{id}")
public ResponseEntity<CategoryDTO> updateCategory(@PathVariable Long id,
                                                  @RequestPart("name") String name,
                                                  @RequestPart("description") String description,
                                                  @RequestPart(value = "file", required = false) MultipartFile file) {
    String relativePath = null;
    if (file != null) {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        Path path = Paths.get(uploadDir + fileName);
        try {
            Files.createDirectories(path.getParent());
            if (Files.exists(path)) {
                // Si le fichier existe déjà, générez un nouveau nom de fichier
                String newFileName = System.currentTimeMillis() + "_" + fileName;
                path = Paths.get(uploadDir + newFileName);
                relativePath = "uploads/images/" + newFileName;
            } else {
                relativePath = "uploads/images/" + fileName;
            }
            Files.copy(file.getInputStream(), path);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    return ResponseEntity.ok(categoryService.updateCategory(id, name, description, relativePath));
}


    @DeleteMapping("/categories/{id}")
    public void deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
    }
}
