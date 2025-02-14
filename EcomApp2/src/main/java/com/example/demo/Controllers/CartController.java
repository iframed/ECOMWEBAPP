package com.example.demo.Controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Service.ICartService;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin("http://localhost:4200")
public class CartController {
    @Autowired
    private ICartService cartService;

    @PostMapping("/add")
    public void addToCart(@RequestParam String userId, @RequestParam String productId, @RequestParam int quantity) {
        cartService.addToCart(userId, productId, quantity);
    }

    @GetMapping("/{userId}")
    public Map<String, Integer> getCart(@PathVariable String userId) {
        return cartService.getCart(userId);
    }


    @DeleteMapping("/remove")
    public void removeFromCart(@RequestParam String userId, @RequestParam String productId) {
        cartService.removeFromCart(userId, productId);
    }

    @DeleteMapping("/clear/{userId}")
    public void clearCart(@PathVariable String userId) {
        cartService.clearCart(userId);
    }
}
