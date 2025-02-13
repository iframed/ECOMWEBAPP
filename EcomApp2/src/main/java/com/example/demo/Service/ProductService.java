package com.example.demo.Service;

import java.util.List;

import com.example.demo.Dto.ProductDTO;

public interface ProductService  {
    ProductDTO createProduct(ProductDTO productDTO);
    ProductDTO getProductById(Long id);
    List<ProductDTO> getProductsByCategoryId(Long categoryId);
    void deleteProduct(Long id);
    ProductDTO updateDiscount(Long id, double discount);
    List<ProductDTO> getAllProducts();
    List<ProductDTO> searchProductsByName(String name);

    
}
