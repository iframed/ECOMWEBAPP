import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { CartItem } from '../models/cart-item';
import { Order } from '../models/order';
import { CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';
import { Address } from '../models/address'; // Assurez-vous d'importer le modèle d'adresse
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent implements OnInit {
  userId: string = '';

  cartItems: CartItem[] = [];
  order: Order = new Order();

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private authService: AuthService 
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    if (!this.authService.isAuthenticated) {
      alert('You must be logged in to place an order.');
      this.router.navigate(['/login']);
      return;
    }
    this.cartService.getCart(this.userId).subscribe(cart => {
      this.cartItems = cart || []; // Assurez-vous que ce soit bien un tableau
    });
    


    this.order.orderItems = this.cartItems.map(item => ({
      productId: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
      productName:item.product.name,
      discount: item.product.discount || 0
    }));
    this.order.shippingAddress = new Address(); // Initialize address
    this.order.billingAddress = new Address();  // Initialize address
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.order.totalAmount = this.order.orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  placeOrder(): void {
    if (this.order.shippingAddress && this.order.billingAddress) {
      const userEmail = this.authService.getUserEmail();
      if (!userEmail) {
        alert('User email is required to place an order.');
        return;
      }
      this.order.customerEmail = userEmail;
      this.orderService.createOrder(this.order).subscribe(() => {
        alert('Order placed successfully!');
        this.cartService.clearCart(this.userId).subscribe(() => {
          this.cartItems = []; // Vider localement aussi
        });
        
        this.router.navigate(['/']);
      });
    } else {
      alert('Please provide both shipping and billing addresses.');
    }
  }
  
}
