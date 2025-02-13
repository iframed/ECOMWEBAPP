package com.example.demo.ServiceImpl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Dto.ProductDTO;
import com.example.demo.Entity.Category;
import com.example.demo.Entity.Product;
import com.example.demo.Exception.ResourceNotFoundException;
import com.example.demo.Mappers.ProductMapper;
import com.example.demo.Repository.CategoryRepo;
import com.example.demo.Repository.ProductRepo;
import com.example.demo.Service.ProductService;


@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepo productRepository;

    @Autowired
    private CategoryRepo categoryRepository;

    @Autowired
    private ProductMapper productMapper;

    @Override
    public ProductDTO createProduct(ProductDTO productDTO) {
        Category category = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        Product product = productMapper.toProduct(productDTO);
        product.setCategory(category);
        return productMapper.fromProduct(productRepository.save(product));
    }

    @Override
    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return productMapper.fromProduct(product);
    }

    @Override
    public List<ProductDTO> getProductsByCategoryId(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        return category.getProducts().stream()
                .map(productMapper::fromProduct)
                .collect(Collectors.toList());
    }


    @Override
    public ProductDTO updateDiscount(Long id, double discount) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        product.setDiscount(discount);
        return productMapper.fromProduct(productRepository.save(product));
    }

    @Override
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found");
        }
        productRepository.deleteById(id);
    }

    @Override
    public List<ProductDTO> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return products.stream().map(productMapper::fromProduct).collect(Collectors.toList());
    }

    @Override
    public List<ProductDTO> searchProductsByName(String name) {
        List<Product> products = productRepository.findByNameContainingIgnoreCase(name);
        return products.stream()
                .map(productMapper::fromProduct)
                .collect(Collectors.toList());
    }
}
