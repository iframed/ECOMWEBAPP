package com.example.demo.Service;

import java.util.Map;

public interface ICartService {
    
        void addToCart(String userId, String productId, int quantity);
       // Map<String, Map<String, Integer>> getCart(String userId);
       Map<String, Integer> getCart(String userId);
        void removeFromCart(String userId, String productId);
        void clearCart(String userId);
}
