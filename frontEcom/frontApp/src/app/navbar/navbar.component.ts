
import { CommonModule, ViewportScroller } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Category } from '../models/category';
import { CategoryServiceService } from '../services/category-service.service';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule,FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  categories: Category[] = [];
  parentCategories: Category[] = [];
  selectedCategory: Category | null = null;
  searchVisible: boolean = false;
  searchQuery: string = '';

  iconText = '';
  iconPosition = { top: 0, left: 0 };
  iconVisible = false;

  constructor(private categoryService: CategoryServiceService,
     private router: Router,
     public authService: AuthService,
     private productService: ProductService,
      private viewportScroller: ViewportScroller
    ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadCategories();
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe((data: Category[]) => {
      console.log('Categories received from API:', JSON.stringify(data, null, 2));
      this.categories = data;
      this.parentCategories = data.filter(category => !category.parentId);
      console.log('Parent Categories:', JSON.stringify(this.parentCategories, null, 2));
    }, error => {
      console.error('Error fetching categories:', error);
    });
  }

  getSubCategories(category: Category): Category[] {
    const subCategories = this.categories.filter(cat => cat.parentId === category.id);
    console.log(`Subcategories of ${category.name}:`, JSON.stringify(subCategories, null, 2));
    return subCategories;
  }

  onCategoryMouseEnter(category: Category): void {
    this.selectedCategory = category;
  }

  onCategoryMouseLeave(): void {
    this.selectedCategory = null;
  }

  toggleSearch(): void {
    this.searchVisible = !this.searchVisible;
  }

  showSearch(): void {
    this.searchVisible = true;
  }

  hideSearch(): void {
    this.searchVisible = false;
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/category/4']);
  }


  showIconText(event: MouseEvent, text: string) {
    this.iconText = text;
    this.iconPosition = { top: event.clientY, left: event.clientX + 20 };
    this.iconVisible = true;
  }

  hideIconText() {
    this.iconText = '';
  }


  searchProducts(): void {
    if (this.searchQuery.trim()) {
      this.productService.searchProductsByName(this.searchQuery).subscribe(
        (results: Product[]) => {
          console.log('Search results:', results);
          this.router.navigate(['/search-product'], { state: { results } });
        },
        error => {
          console.error('Error searching for products:', error);
        }
      );
    }
  }


  onSubCategoryClick(subCategoryId: number): void {
    this.router.navigate(['/subcategory', subCategoryId]).then(() => {
      this.selectedCategory = null; // Réinitialiser la catégorie sélectionnée pour forcer la mise à jour
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }
  
  onSubSubCategoryClick(subSubCategoryId: number): void {
    this.router.navigate(['/subsubcategory', subSubCategoryId]).then(() => {
      this.selectedCategory = null; // Réinitialiser la catégorie sélectionnée pour forcer la mise à jour
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }
  
  executeSearch(): void {
    this.searchProducts();
    this.searchQuery = ''; // Vider le champ de recherche
  }

}

