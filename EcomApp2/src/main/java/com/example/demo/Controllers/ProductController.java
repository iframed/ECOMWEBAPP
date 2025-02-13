package com.example.demo.Controllers;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.Dto.ProductDTO;
import com.example.demo.Service.ProductService;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api")
public class ProductController {
    
    @Autowired
    private ProductService productService;

    private final String uploadDir = "/Users/moha/Desktop/ECOMAPPWEB/EcomApp2/uploads/images/";

    @PostMapping("/products/create")
public ResponseEntity<ProductDTO> createProduct(@RequestParam("name") String name,
                                                @RequestParam("description") String description,
                                                @RequestParam("price") double price,
                                                @RequestParam("categoryId") Long categoryId,
                                                @RequestParam("sizes") String sizes,
                                                @RequestParam("colors") String colors,
                                                @RequestParam("stock") int stock,
                                                @RequestParam("images") MultipartFile[] images) throws IOException {

    System.out.println("Entering createProduct method");
    System.out.println("Name: " + name);
    System.out.println("Description: " + description);
    System.out.println("Price: " + price);
    System.out.println("CategoryId: " + categoryId);
    System.out.println("Colors: " + colors);

    if (images != null) {
        System.out.println("Number of Images: " + images.length);
    } else {
        System.out.println("No images provided");
    }

    // Save images and get paths
    Map<String, List<String>> imagePaths = new HashMap<>();
    if (images != null) {
        imagePaths = saveFiles(colors.split(","), images);
    }

    // Create product
    ProductDTO productDTO = new ProductDTO();
    productDTO.setName(name);
    productDTO.setDescription(description);
    productDTO.setPrice(price);
    productDTO.setCategoryId(categoryId);
    productDTO.setSizes(List.of(sizes.split(","))); 
    productDTO.setColors(List.of(colors.split(",")));
    productDTO.setImages(imagePaths);
    productDTO.setStock(stock);
    return ResponseEntity.ok(productService.createProduct(productDTO));
}

private Map<String, List<String>> saveFiles(String[] colors, MultipartFile[] files) throws IOException {
    Map<String, List<String>> filePaths = new HashMap<>();
    for (String color : colors) {
        filePaths.put(color, new ArrayList<>());
    }

    for (MultipartFile file : files) {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        String color = getColorFromFileName(fileName, colors);
        if (color != null) {
            Path path = Paths.get(uploadDir + fileName);
            Files.createDirectories(path.getParent());
            Files.copy(file.getInputStream(), path);
            filePaths.get(color).add("uploads/images/" + fileName);
        }
    }
    return filePaths;
}

private String getColorFromFileName(String fileName, String[] colors) {
    for (String color : colors) {
        if (fileName.toLowerCase().contains(color.toLowerCase())) {
            return color;
        }
    }
    return null;
}

    
    @GetMapping("/products/{id}")
    public ProductDTO getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    @GetMapping("/products/category/{categoryId}")
    public List<ProductDTO> getProductsByCategoryId(@PathVariable Long categoryId) {
        return productService.getProductsByCategoryId(categoryId);
    }

    @PutMapping("/{id}/discount")
    public ResponseEntity<ProductDTO> updateDiscount(@PathVariable Long id, @RequestBody double discount) {
        ProductDTO updatedProduct = productService.updateDiscount(id, discount);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/products")
    public List<ProductDTO> getAllProducts() {
        return productService.getAllProducts();
    }
    @GetMapping("/products/search")
    public List<ProductDTO> searchProductsByName(@RequestParam("name") String name) {
        return productService.searchProductsByName(name);
    }
    
}
