

  // add-product.component.ts
  import { CommonModule } from '@angular/common';
  import { Component, OnInit } from '@angular/core';
  import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
  import { RouterLink } from '@angular/router';
  import { Category } from '../models/category';
  import { ProductService } from '../services/product.service';
  import { CategoryServiceService } from '../services/category-service.service';
  
  @Component({
    selector: 'app-add-product',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink, CommonModule],
    templateUrl: './add-product.component.html',
    styleUrls: ['./add-product.component.css']
  })
  export class AddProductComponent implements OnInit {
    productForm: FormGroup;
    categories: Category[] = [];
    subCategories: Category[] = [];
    selectedFiles: File[] = [];
  
    constructor(
      private fb: FormBuilder,
      private categoryService: CategoryServiceService,
      private productService: ProductService
    ) {
      this.productForm = this.fb.group({
        name: ['', Validators.required],
        description: ['', Validators.required],
        price: ['', Validators.required],
        discount: [0, Validators.required],
        sizes: ['', Validators.required] ,
        stock: [0, Validators.required],
        categoryId: [null, Validators.required],
        colors: ['', Validators.required]
      });
    }
  
    ngOnInit(): void {
      this.categoryService.getCategories().subscribe((data: Category[]) => {
        this.categories = data;
      });
    }
  
    onCategoryChange(): void {
      const categoryId = this.productForm.get('categoryId')?.value;
      this.subCategories = this.categories.filter(category => category.parentId === categoryId);
    }
  
    onFileSelected(event: any): void {
      this.selectedFiles = Array.from(event.target.files);
    }
  
    onSubmit(): void {
      if (this.productForm.valid) {
        const formData = new FormData();
        formData.append('name', this.productForm.get('name')?.value);
        formData.append('description', this.productForm.get('description')?.value);
        formData.append('price', this.productForm.get('price')?.value);
        formData.append('discount', this.productForm.get('discount')?.value);
        formData.append('categoryId', this.productForm.get('categoryId')?.value);
        formData.append('stock', this.productForm.get('stock')?.value);
        formData.append('colors', this.productForm.get('colors')?.value);
        formData.append('sizes', this.productForm.get('sizes')?.value);
  
        this.selectedFiles.forEach(file => {
          formData.append('images', file);
        });

        console.log( formData);
  
        this.productService.createProduct(formData).subscribe(
          response => {
            console.log('Product created successfully', response);
            this.productForm.reset();
            this.selectedFiles = [];
          },
          error => {
            console.error('Error creating product', error);
          }
        );
      }
    }
  }
  