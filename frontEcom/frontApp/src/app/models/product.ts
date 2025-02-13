export class Product {

  id!: number;
  name!: string;
  description!: string;
  price!: number;
  discount!: number; 
  categoryId!: number;
  colors!: string[];
  sizes!: string[];
  stock!:number;
  
  images!: { [color: string]: string[] };
}
