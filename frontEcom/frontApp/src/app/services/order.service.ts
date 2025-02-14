import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Order } from '../models/order';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'http://localhost:85/api/orders';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.accessToken;
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/createorder`, order, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Erreur lors de la création de la commande:', error);
        return throwError(error);
      })
    );
  }

  getOrderHistory(email: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/history/${email}`, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des commandes:', error);
        return throwError(error);
      })
    );
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}`).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération de toutes les commandes:', error);
        return throwError(error);
      })
    );
  }
}
