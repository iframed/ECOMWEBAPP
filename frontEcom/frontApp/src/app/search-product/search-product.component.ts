import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { routes } from '../app.routes';
import { Product } from '../models/product';

@Component({
  selector: 'app-search-product',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './search-product.component.html',
  styleUrl: './search-product.component.css'
})
export class SearchProductComponent implements OnInit {
  searchResults: Product[] = [];

   constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { results: Product[] };
    if (state && state.results) {
      this.searchResults = state.results;
    }
  }

  ngOnInit(): void {}


  getProductImage(product: Product): string {
    if (product.images && Object.keys(product.images).length > 0) {
      // Get the first color key
      const firstColorKey = Object.keys(product.images)[0];
      // Get the first image URL for that color
      if (product.images[firstColorKey] && product.images[firstColorKey].length > 0) {
        return this.getFullImageUrl(product.images[firstColorKey][0]);
      }
    }
    return 'path/to/default-image.jpg'; // Default image path if no images are found
  }

  private getFullImageUrl(relativeUrl: string): string {
    // Assuming your images are served from a base URL
    const baseUrl = 'http://localhost:85/'; // Replace with your actual base URL
    return baseUrl + relativeUrl;
  }

  goToProductDetail(productId: number): void {
    this.router.navigate(['/product-detail', productId]); // Naviguer vers le composant de détail du produit
  }

}
