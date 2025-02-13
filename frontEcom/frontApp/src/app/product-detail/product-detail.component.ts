import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { CartService } from '../services/cart.service';
import { catchError, Observable, throwError } from 'rxjs';



@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: ProductWithSelectedImage | null = null;
  selectedColor: string | null = null;
  selectedColorImages: string[] = [];
  currentImageIndex: number = 0;
  selectedSize: string | null = null;
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
   
  ) { }

  ngOnInit(): void {
    const productId = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getProductById(productId).subscribe((product: Product) => {
      this.product = {
        ...product,
        selectedImage: product.images[product.colors[0]][0]
      };
      this.selectColor(product.colors[0]);
    });
  }




  selectColor(color: string): void {
    if (this.product) {
      this.selectedColor = color;
      this.selectedColorImages = this.product.images[color] || [];
      this.currentImageIndex = 0;
    }
  }

  prevImage(): void {
    if (this.selectedColorImages.length > 0) {
      this.currentImageIndex = (this.currentImageIndex > 0) ? this.currentImageIndex - 1 : this.selectedColorImages.length - 1;
    }
  }

  nextImage(): void {
    if (this.selectedColorImages.length > 0) {
      this.currentImageIndex = (this.currentImageIndex < this.selectedColorImages.length - 1) ? this.currentImageIndex + 1 : 0;
    }
  }

  getDiscountedPrice(product: ProductWithSelectedImage): number {
    return product.price - (product.price * (product.discount / 100));
  }


  

  deleteProduct(): void {
    if (this.product) {
      this.productService.deleteProduct(this.product.id).subscribe(() => {
        // Handle product deletion (e.g., navigate to another page or show a success message)
      });
    }
  }
}

interface ProductWithSelectedImage extends Product {
  selectedImage: string | null;
}
