package com.example.demo.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Dto.OrderDTO;
import com.example.demo.Entity.Customer;
import com.example.demo.Service.OrderService;
import com.example.demo.Service.UserService;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@CrossOrigin("http://localhost:4200")
@RequestMapping("/api/orders")
public class OrderController {

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;


    @GetMapping
    public List<OrderDTO> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/{id}")
    public OrderDTO getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id);
    }
    @GetMapping("/history/{email}")
public List<OrderDTO> getOrderHistory(@PathVariable String email) {
    logger.info("Fetching order history for: {}", email);  // Message pour vérifier
    List<OrderDTO> orders = orderService.getOrdersByEmail(email);
    for (OrderDTO order : orders) {
        order.setCustomerEmail(email);
    }
    return orders;
}


    @PostMapping("/createorder")
    public OrderDTO createOrder(@RequestBody OrderDTO orderDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User must be authenticated to place an order");
        }

        String userEmail = authentication.getName();
        logger.info("Authenticated user email: {}", userEmail);
        Customer customer = userService.findByCustomerEmail(userEmail);
        if (customer == null) {
            throw new RuntimeException("Authenticated user not found");
        }

        logger.info("Authenticated user ID: {}", customer.getId());
        orderDTO.setCustomerId(customer.getId());
        return orderService.createOrder(orderDTO);
    }
    @PutMapping("/{id}")
    public OrderDTO updateOrder(@PathVariable Long id, @RequestBody OrderDTO orderDTO) {
        return orderService.updateOrder(id, orderDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable Long id) {
        
      orderService.deleteOrder(id);
    } 
    
    
 }

