import { Component, OnInit } from '@angular/core';
import { CartItem } from '../models/cart-item';
import { Order } from '../models/order';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';
import { Address } from '../models/address';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-panier',
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.css']
})
export class PanierComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalAmount: number = 0;
  userId: string = '';
  userOrders: Order[] = [];

  constructor(
    private cartService: CartService, 
    private authService: AuthService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    if (!this.userId) {
      console.error('Erreur: User ID non trouvé');
      return;
    }
    this.loadCartItems();
    this.loadUserOrders();
  }

  loadCartItems(): void {
    this.cartService.getCart(this.userId).pipe(
      catchError(error => {
        console.error('Erreur lors du chargement du panier:', error);
        return of([]);
      })
    ).subscribe((cart: CartItem[]) => {
      this.cartItems = cart || [];
      this.calculateTotal();
    });
  }

  loadUserOrders(): void {
    const userEmail = this.authService.getUserEmail();
    if (!userEmail) {
      console.error('Erreur: Email utilisateur non trouvé');
      return;
    }
    this.orderService.getOrderHistory(userEmail).pipe(
      catchError(error => {
        console.error('Erreur lors du chargement des commandes:', error);
        return of([]);
      })
    ).subscribe((orders: Order[]) => {
      this.userOrders = orders || [];
    });
  }

  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce((acc, item) => 
      item.product ? acc + item.product.price * item.quantity : acc, 0);
  }

  removeItem(productId: number): void {
    if (!this.userId) return;
    this.cartService.removeFromCart(this.userId, productId).subscribe({
      next: () => this.loadCartItems(),
      error: err => console.error('Erreur lors de la suppression du produit:', err)
    });
  }

  clearCart(): void {
    if (!this.userId) return;
    this.cartService.clearCart(this.userId).subscribe({
      next: () => {
        this.cartItems = [];
        this.totalAmount = 0;
      },
      error: err => console.error('Erreur lors du vidage du panier:', err)
    });
  }

  placeOrder(): void {
    const email = this.authService.getUserEmail();
    if (!email) {
      console.error('Erreur: Email utilisateur non trouvé');
      return;
    }

    const order: Order = this.createOrder(email);

    this.orderService.createOrder(order).subscribe({
      next: (newOrder: Order) => {
        this.userOrders.push(newOrder);
        this.clearCart();
      },
      error: err => console.error('Erreur lors de la création de la commande:', err)
    });
  }

  private createOrder(customerEmail: string): Order {
    return {
      id: 0,
      customerId: Number(this.userId),
      orderDate: new Date().toISOString(),
      status: 'Pending',
      totalAmount: this.totalAmount,
      orderItems: this.cartItems.map(item => ({
        productId: item.product?.id || 0,
        productName: item.product?.name || 'Produit inconnu',
        quantity: item.quantity,
        price: item.product?.price || 0,
        discount: 0
      })),
      shippingAddress: this.getAddress(),
      billingAddress: this.getAddress(),
      customerEmail: customerEmail
    };
  }

  private getAddress(): Address {
    return {
      street: '123 Rue Exemple',
      city: 'Casablanca',
      state: 'Casablanca',
      postalCode: '20000',
      country: 'Maroc'
    };
  }
}
