import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Category } from '../models/category';
import { Product } from '../models/product';


@Injectable({
  providedIn: 'root'
})
export class CategoryServiceService {

  private apiUrl = 'http://localhost:85/api/categories';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}`);
  }

  getCategoryWithSubCategories(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}/with-subcategories`);
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  /*createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/create`, category);
  }

  createSubCategory(parentId: number, category: Category): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/create-subcategory?parentId=${parentId}`, category);
  }

  createSubSubCategory(parentId: number, category: Category): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/create-subsubcategory?parentId=${parentId}`, category);
  }*/

  createCategory(formData: FormData): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/create`, formData);
  }

  createSubCategory(formData: FormData): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/create-subcategory`, formData);
  }



  createSubSubCategory(formData: FormData): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/create-subsubcategory`, formData);
  }

  getProductsBySubSubCategoryId(id: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/${id}/products`).pipe(
      catchError(this.handleError)
    );
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  updateCategory(id: number, formData: FormData): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/update/${id}`, formData).pipe(
      catchError(this.handleError)
    );
  }
 
  



  private handleError(error: HttpErrorResponse) {
    console.error('Error fetching data:', error);
    return throwError('An error occurred while fetching data. Please try again later.');
  }

  
}
