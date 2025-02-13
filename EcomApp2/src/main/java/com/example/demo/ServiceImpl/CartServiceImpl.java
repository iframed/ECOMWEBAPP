package com.example.demo.ServiceImpl;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.example.demo.Service.ICartService;

import jakarta.annotation.PostConstruct;

@Service
public class CartServiceImpl implements ICartService {

    private static final String CART_KEY = "cart";

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    private HashOperations<String, String, String> hashOperations;

    @PostConstruct
    private void init() {
        hashOperations = redisTemplate.opsForHash();
    }

    @Override
    public void addToCart(String userId, String productId, int quantity) {
        String key = CART_KEY + ":" + userId;
        // Stocker la quantité en tant que String
        hashOperations.put(key, productId, String.valueOf(quantity));
    }

    @Override
    public Map<String, Integer> getCart(String userId) {
        String key = CART_KEY + ":" + userId;
        Map<String, String> rawCart = hashOperations.entries(key);

        // Convertir les valeurs String en Integer
        Map<String, Integer> cart = new HashMap<>();
        rawCart.forEach((product, quantity) -> {
            try {
                cart.put(product, Integer.parseInt(quantity));  // Convertir de String à Integer
            } catch (NumberFormatException e) {
                // Gérer les erreurs de conversion si nécessaire
                System.out.println("Erreur de conversion pour " + product + ": " + quantity);
            }
        });

        return cart;
    }

    @Override
    public void removeFromCart(String userId, String productId) {
        String key = CART_KEY + ":" + userId;
        hashOperations.delete(key, productId);
    }

    @Override
    public void clearCart(String userId) {
        String key = CART_KEY + ":" + userId;
        redisTemplate.delete(key);
    }
}
