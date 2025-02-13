package com.example.demo.Service;

import java.util.List;

import com.example.demo.Dto.OrderDTO;


public interface OrderService {
    List<OrderDTO> getAllOrders();
    OrderDTO getOrderById(Long id);
    OrderDTO createOrder(OrderDTO orderDTO);
    OrderDTO updateOrder(Long id, OrderDTO orderDTO);
    void deleteOrder(Long id);
    List<OrderDTO> getOrdersByEmail(String email);
}
