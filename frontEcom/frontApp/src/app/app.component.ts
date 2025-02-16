import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { CategoryComponent } from "./category/category.component";

import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    RouterModule,
    NavbarComponent,
    FooterComponent,
    CategoryComponent,
    CommonModule
   
]
})
export class AppComponent {
  title = 'ecom2';
}
