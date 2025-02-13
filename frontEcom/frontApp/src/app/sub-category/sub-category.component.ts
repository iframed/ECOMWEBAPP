import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { Category } from '../models/category';
import { Product } from '../models/product';
import { CategoryServiceService } from '../services/category-service.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-sub-category',
  standalone: true,
  imports: [RouterLink, CommonModule, RouterModule,FormsModule],
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.css']
})
export class SubCategoryComponent implements OnInit {
  
  products: ProductWithSelectedImage[] = [];
  currentPageIndex = 0;
  subSubCategoryImages: { name: string, imagePath: string }[] = [];
  currentImagePage: { name: string, imagePath: string }[] = [];
  priceFilter: number = 1000;
  subCategoryFilter: string = '';
  filteredProducts: ProductWithSelectedImage[] = [];
  subCategories: Category[] = [];
  subCategory: Category | null = null;
  

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryServiceService,
    private productService: ProductService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    // Utilise paramMap pour obtenir les paramètres de la route
    this.route.paramMap.subscribe(params => {
      const subCategoryId = +params.get('id')!;
      this.loadSubCategory(subCategoryId);
    });

    // Écoute les événements de navigation pour charger la sous-catégorie
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const subCategoryId = +this.route.snapshot.paramMap.get('id')!;
      this.loadSubCategory(subCategoryId);
    });
  }

  loadSubCategory(subCategoryId: number): void {
    console.log('SubCategoryId:', subCategoryId); 
    this.categoryService.getCategoryById(subCategoryId).subscribe((data: Category) => {
      console.log('Category Data:', data); 
      this.subCategory = data;
      this.subCategories = data.subCategories || [];
      this.extractSubSubCategoryImages(data);
      this.loadProducts(data);
    }, error => {
      console.error('Error fetching sub-category:', error);
    });
  }

  loadProducts(category: Category): void {
    this.productService.getProductsBySubCategories(category).subscribe((products: Product[]) => {
      console.log('Products Data:', products); 
      this.products = products.map(product => ({
        ...product,
        selectedImage: product.images[product.colors[0]] ? product.images[product.colors[0]][0] : null
      }));
      this.filteredProducts = [...this.products]; // Initialize filtered products
      this.applyFilters();
      console.log('Processed Products:', this.products);
      
    }, error => {
      console.error('Error fetching products:', error);
    });
  }

  extractSubSubCategoryImages(category: Category): void {
    const subSubCategoryImages: { name: string, imagePath: string }[] = [];
    console.log('Extracting images from sub-categories:', category.subCategories);

    if (category.subCategories) {
      category.subCategories.forEach(subCategory => {
        console.log('SubCategory:', subCategory);
        if (subCategory.picturePath) {
          console.log('Adding image from SubCategory:', subCategory.picturePath);
          subSubCategoryImages.push({ name: subCategory.name, imagePath: subCategory.picturePath });
        }
        if (subCategory.subCategories) {
          subCategory.subCategories.forEach(subSubCategory => {
            console.log('SubSubCategory:', subSubCategory);
            if (subSubCategory.picturePath) {
              console.log('Adding image from SubSubCategory:', subSubCategory.picturePath);
              subSubCategoryImages.push({ name: subSubCategory.name, imagePath: subSubCategory.picturePath });
            }
          });
        }
      });
    }

    this.subSubCategoryImages = subSubCategoryImages;
    this.updateCurrentImagePage();
    console.log('Extracted images:', this.subSubCategoryImages);
  }

  updateCurrentImagePage(): void {
    const start = this.currentPageIndex * 3;
    const end = start + 3;
    this.currentImagePage = this.subSubCategoryImages.slice(start, end);
  }

  prevImagePage(): void {
    if (this.currentPageIndex > 0) {
      this.currentPageIndex--;
    } else {
      this.currentPageIndex = Math.floor(this.subSubCategoryImages.length / 3) - 1;
    }
    this.updateCurrentImagePage();
    console.log('Current page index:', this.currentPageIndex);
  }

  nextImagePage(): void {
    if (this.currentPageIndex < Math.floor(this.subSubCategoryImages.length / 3) - 1) {
      this.currentPageIndex++;
    } else {
      this.currentPageIndex = 0;
    }
    this.updateCurrentImagePage();
    console.log('Current page index:', this.currentPageIndex);
  }

  selectColor(product: ProductWithSelectedImage, color: string): void {
    product.selectedImage = product.images[color] ? product.images[color][0] : null;
  }

  goToProductDetail(productId: number): void {
    this.router.navigate(['/product-detail', productId]); // Navigate to the product detail component
  }
  
  

  applyFilters(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesPrice = product.price <= this.priceFilter;
      const matchesSubCategory = !this.subCategoryFilter || product.categoryId === Number(this.subCategoryFilter);
      return matchesPrice && matchesSubCategory;
    });
  }


}



interface ProductWithSelectedImage extends Product {
  selectedImage: string | null;
}
