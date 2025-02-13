import { Routes } from '@angular/router';
import { AddProductComponent } from './add-product/add-product.component';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from './auth.guard';

import { CategoryComponent } from './category/category.component';
import { ContactComponent } from './contact/contact.component';


import { LoginComponent } from './login/login.component';

import { NavbarComponent } from './navbar/navbar.component';
import { OrderFormComponent } from './order-form/order-form.component';
import { PanierComponent } from './panier/panier.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { RegistrationComponent } from './registration/registration.component';
import { SearchProductComponent } from './search-product/search-product.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';
import { SubSubCategoryComponent } from './sub-sub-category/sub-sub-category.component';

export const routes: Routes = [

    { path: '', component: CategoryComponent},
    { path: 'nav', component: NavbarComponent },
    { path: 'admin', component: AdminComponent },
    { path: 'category/:id', component: CategoryComponent },
    { path: 'subcategory/:id', component: SubCategoryComponent },
    { path: 'subsubcategory/:id', component: SubSubCategoryComponent },
    { path: 'add', component: AddProductComponent },
    { path: 'product-detail/:id', component: ProductDetailComponent }, 
    { path: 'pro', component: SubSubCategoryComponent },
    { path: 'cart', component: PanierComponent },
    { path: 'order-form', component: OrderFormComponent,  canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'login/register', component: RegistrationComponent },
    { path: 'search-product', component: SearchProductComponent},
    { path: 'contact', component: ContactComponent}
    
    
  
];
