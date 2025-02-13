package com.example.demo.ServiceImpl;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.example.demo.Dto.OrderDTO;
import com.example.demo.Entity.Customer;
import com.example.demo.Entity.OrderItem;
import com.example.demo.Entity.Product;
import com.example.demo.Entity.order;
import com.example.demo.Repository.AddressRepository;
import com.example.demo.Repository.OrderRepository;
import com.example.demo.Repository.ProductRepo;
import com.example.demo.Service.OrderService;
import com.example.demo.Service.UserService;

import jakarta.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;




@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private com.example.demo.Mappers.OrderMapper orderMapper;

    @Autowired
    private ProductRepo productRepository;
    @Autowired
    private UserService userService;

    @Override
    public List<OrderDTO> getAllOrders() {
        List<order> orders = orderRepository.findAll();
        return orders.stream()
                .map(orderMapper::toOrderDTO)
                .collect(Collectors.toList());
    }

    @Override
    public OrderDTO getOrderById(Long id) {
        order order = orderRepository.findById(id).orElse(null);
        return orderMapper.toOrderDTO(order);
    }

    
    @Override
    @Transactional
    public OrderDTO createOrder(OrderDTO orderDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User must be authenticated to place an order");
        }

        String userEmail = authentication.getName();
        System.out.println(userEmail);
        Customer customer = userService.findByCustomerEmail(userEmail);
        if (customer == null) {
            throw new RuntimeException("Authenticated user not found");
        }

        orderDTO.setCustomerId(customer.getId());
        order order = orderMapper.toOrder(orderDTO);

        if (order.getShippingAddress() != null) {
            addressRepository.save(order.getShippingAddress());
        }
        
        if (order.getBillingAddress() != null) {
            addressRepository.save(order.getBillingAddress());
        }

        double totalAmount = 0;
        if (order.getOrderItems() != null) {
            for (OrderItem item : order.getOrderItems()) {
                item.setOrder(order);
                Product product = productRepository.findById(item.getProduct().getId())
                        .orElseThrow(() -> new RuntimeException("Product not found"));
                if (product.getStock() < item.getQuantity()) {
                    throw new RuntimeException("Insufficient stock for product: " + product.getName());
                }
                product.setStock(product.getStock() - item.getQuantity()); // Réduire le stock
                productRepository.save(product);
                item.setProduct(product);
                totalAmount += item.getPrice() * item.getQuantity();
            }
        }
        order.setTotalAmount(totalAmount);

        order = orderRepository.save(order);
        return orderMapper.toOrderDTO(order);
    }

    @Override
    public OrderDTO updateOrder(Long id, OrderDTO orderDTO) {
        order order = orderMapper.toOrder(orderDTO);
        order.setId(id);
        order updatedOrder = orderRepository.save(order);
        return orderMapper.toOrderDTO(updatedOrder);
    }

    @Override
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }


    @Override
    public List<OrderDTO> getOrdersByEmail(String email) {
        List<order> orders = orderRepository.findByCustomerEmail(email);
        return orders.stream()
                .map(orderMapper::toOrderDTO)
                .collect(Collectors.toList());
    }
}
