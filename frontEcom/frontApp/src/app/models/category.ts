import { Product } from "./product";

export class Category {

    id!: number;
  name!: string;
  description!: string;
  parentId?: number;
  subCategories?: Category[]; 
  picturePath!:string;
  products?: Product[];
 
}
