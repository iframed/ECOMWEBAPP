import { CommonModule, isPlatformBrowser, ViewportScroller } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterModule } from '@angular/router';

import { Category } from '../models/category';
import { Product } from '../models/product';
import { CategoryServiceService } from '../services/category-service.service';
import { ProductService } from '../services/product.service';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-sub-sub-category',
  standalone: true,
  imports: [RouterLink, CommonModule, RouterModule, FormsModule],
  templateUrl: './sub-sub-category.component.html',
  styleUrls: ['./sub-sub-category.component.css']
})
export class SubSubCategoryComponent implements OnInit {
  
  subCategory: Category | null = null;
  subSubCategory: Category | null = null;
  products: ProductWithSelectedImage[] = [];
  imageUrl: string | null = null;
  priceFilter: number = 1000;
  subCategoryFilter: string = '';
  filteredProducts: ProductWithSelectedImage[] = [];

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryServiceService,
    private productService: ProductService,
    private router: Router,
    private viewportScroller: ViewportScroller)
    { }

  ngOnInit(): void {
    // Utilise paramMap pour obtenir les paramètres de la route
    this.route.paramMap.subscribe(params => {
      const subSubCategoryId = +params.get('id')!;
      this.loadSubSubCategory(subSubCategoryId);

    });

    // Écoute les événements de navigation pour charger la sous-sous-catégorie
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const subSubCategoryId = +this.route.snapshot.paramMap.get('id')!;
      this.loadSubSubCategory(subSubCategoryId);
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }

  loadSubSubCategory(subSubCategoryId: number): void {
    this.categoryService.getCategoryById(subSubCategoryId).subscribe((data: Category) => {
      this.subSubCategory = data;
      this.imageUrl = data.picturePath;
      this.loadProducts(subSubCategoryId);
    }, error => {
      console.error('Error fetching sub-sub-category:', error);
    });
  }

  loadProducts(subSubCategoryId: number): void {
    this.productService.getProductsBySubSubCategoryId(subSubCategoryId).subscribe((products: Product[]) => {
      this.products = products.map(product => {
        const firstColor = product.colors[0];
        const selectedImage = product.images[firstColor] ? product.images[firstColor][0] : null;
        return {
          ...product,
          selectedImage
        };
      });
      this.filteredProducts = [...this.products]; // Initialize filtered products
      this.applyFilters();
    }, error => {
      console.error('Error fetching products:', error);
    });
  }

  selectColor(product: ProductWithSelectedImage, color: string): void {
    product.selectedImage = product.images[color] ? product.images[color][0] : null;
  }

  getDiscountedPrice(product: ProductWithSelectedImage): number {
    return product.price - (product.price * (product.discount / 100));
  }

  goToProductDetail(productId: number): void {
    this.router.navigate(['/product-detail', productId]); // Naviguer vers le composant de détail du produit
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesPrice = product.price <= this.priceFilter;
      const matchesSubCategory = !this.subCategoryFilter || product.categoryId === parseInt(this.subCategoryFilter, 10);
      return matchesPrice && matchesSubCategory;
    });
  }
}

interface ProductWithSelectedImage extends Product {
  selectedImage: string | null;
}
