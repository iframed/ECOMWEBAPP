import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { Category } from '../models/category';
import { CategoryServiceService } from '../services/category-service.service';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {
  category: Category | null = null;
  currentImageIndices: { [key: number]: number } = {}; // Indices d'images pour chaque sous-sous-catégorie
  selectedImages: { [productId: number]: string | null } = {}; // Images sélectionnées pour chaque produit
  subCategoryIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryServiceService,
    private productService: ProductService // Assurez-vous que ce service est importé correctement
  ) { }

  /*ngOnInit(): void {
    const categoryId = +this.route.snapshot.paramMap.get('id')!;
    this.categoryService.getCategoryById(categoryId).subscribe((data: Category) => {
      this.category = data;
      this.initializeImageIndices(data);
    }, error => {
      console.error('Error fetching category:', error);
    });
  }*/
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const categoryId = +params.get('id')!;
      this.loadCategory(categoryId);
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const categoryId = +this.route.snapshot.paramMap.get('id')!;
      this.loadCategory(categoryId);
    });
  }
  loadCategory(categoryId: number): void {
    this.categoryService.getCategoryById(categoryId).subscribe((data: Category) => {
      this.category = data;
      this.initializeImageIndices(data);
    }, error => {
      console.error('Error fetching category:', error);
    });
  }

  initializeImageIndices(category: Category): void {
    if (!category.subCategories) return;

    category.subCategories.forEach(subCategory => {
      if (subCategory.subCategories) {
        subCategory.subCategories.forEach(subSubCategory => {
          this.currentImageIndices[subSubCategory.id] = 0;
          if (subSubCategory.products) {
            subSubCategory.products.forEach(product => {
              this.selectedImages[product.id] = product.images[product.colors[0]] ? product.images[product.colors[0]][0] : null;
            });
          }
        });
      }
    });
  }

  selectColor(product: Product, color: string): void {
    this.selectedImages[product.id] = product.images[color] ? product.images[color][0] : null;
  }

  prevSubCategory(): void {
    if (this.subCategoryIndex > 0) {
      this.subCategoryIndex--;
    } else if (this.category && this.category.subCategories) {
      this.subCategoryIndex = this.category.subCategories.length - 1;
    }
  }

  nextSubCategory(): void {
    if (this.category && this.category.subCategories && this.subCategoryIndex < this.category.subCategories.length - 1) {
      this.subCategoryIndex++;
    } else {
      this.subCategoryIndex = 0;
    }
  }

  prevProductImage(subSubCategoryId: number): void {
    const currentIndex = this.currentImageIndices[subSubCategoryId];
    if (currentIndex > 0) {
      this.currentImageIndices[subSubCategoryId]--;
    } else {
      const subSubCategory = this.findSubSubCategoryById(subSubCategoryId);
      if (subSubCategory && subSubCategory.products) {
        this.currentImageIndices[subSubCategoryId] = subSubCategory.products.length - 1;
      }
    }
  }

  nextProductImage(subSubCategoryId: number): void {
    const currentIndex = this.currentImageIndices[subSubCategoryId];
    const subSubCategory = this.findSubSubCategoryById(subSubCategoryId);
    if (subSubCategory && subSubCategory.products) {
      if (currentIndex < subSubCategory.products.length - 1) {
        this.currentImageIndices[subSubCategoryId]++;
      } else {
        this.currentImageIndices[subSubCategoryId] = 0;
      }
    }
  }

  findSubSubCategoryById(id: number): Category | null {
    if (this.category && this.category.subCategories) {
      for (const subCategory of this.category.subCategories) {
        if (subCategory.subCategories) {
          const subSubCategory = subCategory.subCategories.find(subSub => subSub.id === id);
          if (subSubCategory) {
            return subSubCategory;
          }
        }
      }
    }
    return null;
  }

  getCurrentProducts(subSubCategoryId: number): Product[] {
    const subSubCategory = this.findSubSubCategoryById(subSubCategoryId);
    if (!subSubCategory || !subSubCategory.products) {
      return [];
    }
    const currentIndex = this.currentImageIndices[subSubCategoryId];
    return subSubCategory.products.slice(currentIndex, currentIndex + 6);
  }


  goToProductDetail(productId: number): void {
    this.router.navigate(['/product-detail', productId]); // Naviguer vers le composant de détail du produit
  }
}
