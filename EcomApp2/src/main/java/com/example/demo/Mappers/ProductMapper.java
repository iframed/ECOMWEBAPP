package com.example.demo.Mappers;


import org.springframework.stereotype.Component;

import com.example.demo.Dto.ProductDTO;
import com.example.demo.Entity.Product;

@Component


public class ProductMapper {


   

/*  public ProductDTO fromProduct(Product product) {
        ProductDTO productDTO = new ProductDTO();
        BeanUtils.copyProperties(product, productDTO);
        if (product.getCategory() != null) {
            productDTO.setCategoryId(product.getCategory().getId());
        }
        return productDTO;
    }

    public Product toProduct(ProductDTO productDTO) {
        Product product = new Product();
        BeanUtils.copyProperties(productDTO, product);
        return product;
    }*/
    public ProductDTO fromProduct(Product product) {
        ProductDTO productDTO = new ProductDTO();
        productDTO.setId(product.getId());
        productDTO.setName(product.getName());
        productDTO.setDescription(product.getDescription());
        productDTO.setPrice(product.getPrice());
        productDTO.setCategoryId(product.getCategory().getId());
        productDTO.setColors(product.getColors());
        productDTO.setImages(product.getImages());
        productDTO.setDiscount(product.getDiscount());
        productDTO.setSizes(product.getSizes());
        productDTO.setStock(product.getStock());
        return productDTO;
    }

    public Product toProduct(ProductDTO productDTO) {
        Product product = new Product();
        product.setId(productDTO.getId());
        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setPrice(productDTO.getPrice());
        product.setColors(productDTO.getColors());
        product.setImages(productDTO.getImages());
        product.setDiscount(productDTO.getDiscount());
        product.setSizes(productDTO.getSizes());
        product.setStock(productDTO.getStock());
        return product;
    }
   
}
