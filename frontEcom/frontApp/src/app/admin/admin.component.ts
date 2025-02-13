import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryServiceService } from '../services/category-service.service';
import { Category } from '../models/category';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { OrderService } from '../services/order.service';
import { Order } from '../models/order';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  categoryForm: FormGroup;
  categories: Category[] = [];
  subCategories: Category[] = [];
  parentCategories: Category[] = [];
  selectedFile: File | null = null;
  orderHistory: Order[] = [];
  products: Product[] = [];
  editingCategory: Category | null = null;
  showUpdateForm = false;

 



  constructor(private fb: FormBuilder, private categoryService: CategoryServiceService, private orderService: OrderService,  private productService: ProductService,
  private authService: AuthService, private router: Router ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      parentCategoryId: [null],
      parentSubCategoryId: [null]
    });

   
  }
  

 

  ngOnInit(): void {
    this.loadCategories();
    this.loadOrders();
    this.loadProducts();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe((data: Category[]) => {
      this.categories = data;
      this.parentCategories = data.filter(category => !category.parentId);
    }, error => {
      console.error('Error fetching categories:', error);
    });
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe((data: Order[]) => {
      this.orderHistory = data;
    }, error => {
      console.error('Error fetching all orders:', error);
    });
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe((data: Product[]) => {
      this.products = data;
    }, error => {
      console.error('Error fetching products:', error);
    });
  }

  onParentCategoryChange(): void {
    const parentCategoryId = Number(this.categoryForm.get('parentCategoryId')?.value);
    console.log('Selected parent category ID:', parentCategoryId);
    if (parentCategoryId) {
      const parentCategory = this.categories.find(cat => cat.id === parentCategoryId);
      console.log('Found parent category:', parentCategory);
      this.subCategories = parentCategory?.subCategories || [];
      console.log('Subcategories for selected parent:', this.subCategories);
    } else {
      this.subCategories = [];
    }
  }



  onSubmit(): void {
    if (this.categoryForm.valid) {
      const formData = new FormData();
      formData.append('name', this.categoryForm.get('name')?.value);
      formData.append('description', this.categoryForm.get('description')?.value);
      if (this.selectedFile) {
        formData.append('file', this.selectedFile);
      }
      const parentCategoryId = this.categoryForm.get('parentCategoryId')?.value;
      const parentSubCategoryId = this.categoryForm.get('parentSubCategoryId')?.value;

      if (parentSubCategoryId) {
        formData.append('parentId', parentSubCategoryId);
      } else if (parentCategoryId) {
        formData.append('parentId', parentCategoryId);
      }

      if (this.editingCategory) {
        this.categoryService.updateCategory(this.editingCategory.id, formData).subscribe(
          response => {
            console.log('Category updated successfully', response);
            this.resetForm();
          },
          error => {
            console.error('Error updating category', error);
          }
        );
      } else {
        this.categoryService.createCategory(formData).subscribe(
          response => {
            console.log('Category with image created successfully', response);
            this.resetForm();
          },
          error => {
            console.error('Error creating category with image', error);
          }
        );
      }
    }
  }


  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  private resetForm(): void {
    this.categoryForm.reset();
    this.subCategories = [];
    this.selectedFile = null;
    this.showUpdateForm = false;
  }

  deleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe(() => {
        this.loadCategories();
      }, error => {
        console.error('Error deleting category:', error);
      });
    }
  }

  editCategory(category: Category): void {
    this.editingCategory = category;
    this.categoryForm.patchValue({
      name: category.name,
      description: category.description,
      parentCategoryId: category.parentId || null
    });
    this.showUpdateForm = true; // Show the update form
  }

  

}
  