import { Injectable } from '@angular/core';
import { CartItem } from '../models/cart-item';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:8080/api/cart';

  constructor(private http: HttpClient) {}

  getCart(userId: string): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.apiUrl}/${userId}`).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération du panier:', error);
        return throwError(error);
      })
    );
  }


  addToCart(userId: string, productId: number, quantity: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/add`, { userId, productId, quantity }).pipe(
      catchError(error => {
        console.error('Erreur lors de l’ajout au panier:', error);
        return throwError(error);
      })
    );
  }
  
  removeFromCart(userId: string, productId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove`, {
      params: { userId, productId: productId.toString() }
    }).pipe(
      catchError(error => {
        console.error('Erreur lors de la suppression de l’article:', error);
        return throwError(error);
      })
    );
  }

  clearCart(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/clear/${userId}`).pipe(
      catchError(error => {
        console.error('Erreur lors du vidage du panier:', error);
        return throwError(error);
      })
    );
  }
}
