import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, throwError } from 'rxjs';
import { Category } from '../models/category';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:85/api';

  constructor(private http: HttpClient) {}

  /*createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products/create`, product);
  }*/
  createProduct(formData: FormData): Observable<Product> {
    console.log('Sending form data:', formData);
    return this.http.post<Product>(`${this.apiUrl}/products/create`, formData).pipe(
      catchError(this.handleError)
    );
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`).pipe(
      catchError(this.handleError)
    );
  }

  getProductsByCategoryId(categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/category/${categoryId}`);
  }

  getProductsBySubCategories(category: Category): Observable<Product[]> {
    if (!category.subCategories || category.subCategories.length === 0) {
      return this.getProductsByCategoryId(category.id);
    }

    const productsObservables = category.subCategories.map(subCategory =>
      this.getProductsBySubCategories(subCategory)
    );

    return forkJoin(productsObservables).pipe(
      map(productsArray => productsArray.flat())
    );
  }



  getProductsBySubSubCategoryId(id: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/category/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  updateDiscount(id: number, discount: number): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/products/${id}/discount`, { discount }).pipe(
      catchError(this.handleError)
    );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  deleteProduct(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${productId}`);
  }


  searchProductsByName(name: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/search`, {
      params: { name }
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error fetching data:', error);
    return throwError('An error occurred while fetching data. Please try again later.');
  }



  
}
