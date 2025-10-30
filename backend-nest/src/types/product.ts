import { Product, Category } from "generated/prisma/client";

export interface ProductWithCategories extends Product {
  categories: Category[];
}

export interface CategoryWithProducts extends Category {
  products: Product[];
}

export interface StockUpdate {
  productId: string;
  quantity: number;
}
