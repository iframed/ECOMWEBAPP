import { Component, OnInit } from '@angular/core';
import { CartItem } from '../models/cart-item';
import { Order } from '../models/order';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';
import { ProductService } from '../services/product.service';  // Import du service ProductService
import { catchError } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Address } from '../models/address';

@Component({
  selector: 'app-panier',
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.css'],
  standalone: true,
  imports: [
    CommonModule  
  ]
})
export class PanierComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalAmount: number = 0;
  userId: string = '';
  userOrders: Order[] = [];

  constructor(
    private cartService: CartService, 
    private authService: AuthService,
    private orderService: OrderService,
    private productService: ProductService  // Injection de ProductService
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
        return of({});  // Retourne un objet vide en cas d'erreur
      })
    ).subscribe((cart: any) => {
      console.log('Cart items:', cart);  // Affichez pour vérifier le format des données
    
      if (cart && typeof cart === 'object') {
        // Créez un tableau de requêtes pour obtenir les détails des produits
        const productDetailsRequests = Object.keys(cart).map(productId => {
          const quantity = cart[productId];  // La quantité obtenue depuis Redis
    
          return this.productService.getProductById(Number(productId)).pipe(
            catchError(error => {
              console.error(`Erreur de récupération des détails du produit ${productId}:`, error);
              return of(null);  // Retourne null en cas d'erreur
            })
          );
        });

        // Utilisez forkJoin pour attendre que toutes les requêtes des produits soient terminées
        forkJoin(productDetailsRequests).subscribe((productDetails: any[]) => {
          this.cartItems = productDetails
            .filter(product => product !== null)  // Ignore les produits avec une erreur
            .map((product, index) => ({
              product: product,  // Les détails complets du produit
              quantity: cart[Object.keys(cart)[index]],  // La quantité associée au produit
              size: 'L'  // Gérer la taille si nécessaire
            }));

          this.calculateTotal();  // Recalcule le total après avoir récupéré tous les produits
        });
      }
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
