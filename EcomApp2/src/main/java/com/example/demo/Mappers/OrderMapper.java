package com.example.demo.Mappers;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.demo.Dto.OrderDTO;
import com.example.demo.Dto.OrderItemDTO;

import com.example.demo.Entity.OrderItem;
import com.example.demo.Entity.order;
import com.example.demo.Repository.ProductRepo;



import java.util.stream.Collectors;

@Component
public class OrderMapper {
    @Autowired
    private AddressMapper addressMapper;
    @Autowired
    private ProductRepo productRepository; // Add this line

    public OrderDTO toOrderDTO(order order) {
        if (order == null) return null;
        OrderDTO orderDTO = new OrderDTO();
        BeanUtils.copyProperties(order, orderDTO);
        if (order.getCustomer() != null) {
            orderDTO.setCustomerId(order.getCustomer().getId());
        }
        /*if (order.getShippingAddress() != null) {
            orderDTO.setShippingAddress(addressMapper.toAddressDTO(order.getShippingAddress()));
        }
        if (order.getBillingAddress() != null) {
            orderDTO.setBillingAddress(addressMapper.toAddressDTO(order.getBillingAddress()));
        }*/
        if (order.getOrderItems() != null) {
            orderDTO.setOrderItems(order.getOrderItems().stream()
                    .map(this::toOrderItemDTO)
                    .collect(Collectors.toList()));
        }
        return orderDTO;
    }

    public order toOrder(OrderDTO orderDTO) {
        if (orderDTO == null) return null;
        order order = new order();
        BeanUtils.copyProperties(orderDTO, order);
       /*  if (orderDTO.getShippingAddress() != null) {
            order.setShippingAddress(addressMapper.toAddress(orderDTO.getShippingAddress()));
        }
        if (orderDTO.getBillingAddress() != null) {
            order.setBillingAddress(addressMapper.toAddress(orderDTO.getBillingAddress()));
        }*/
        if (orderDTO.getOrderItems() != null) {
            order.setOrderItems(orderDTO.getOrderItems().stream()
                    .map(this::toOrderItem)
                    .collect(Collectors.toList()));
        }
        return order;
    }

    private OrderItemDTO toOrderItemDTO(OrderItem orderItem) {
        if (orderItem == null) return null;
        OrderItemDTO orderItemDTO = new OrderItemDTO();
        BeanUtils.copyProperties(orderItem, orderItemDTO);
        if (orderItem.getProduct() != null) {
            orderItemDTO.setProductId(orderItem.getProduct().getId());
        }
        return orderItemDTO;
    }

    private OrderItem toOrderItem(OrderItemDTO orderItemDTO) {
        if (orderItemDTO == null) return null;
        OrderItem orderItem = new OrderItem();
        BeanUtils.copyProperties(orderItemDTO, orderItem);
        if (orderItemDTO.getProductId() != null) {
            orderItem.setProduct(productRepository.findById(orderItemDTO.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found")));
        }
        return orderItem;
    }
}
