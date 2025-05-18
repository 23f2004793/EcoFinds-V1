
export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  avatar?: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: ProductCategory;
  imageUrl: string;
  sellerId: string;
  sellerName: string;
  createdAt: string;
  condition: ProductCondition;
}

export type ProductCategory = 
  | "clothing" 
  | "furniture" 
  | "electronics"
  | "books"
  | "home_decor"
  | "sports"
  | "toys"
  | "other";

export type ProductCondition = 
  | "new" 
  | "like_new"
  | "good"
  | "fair"
  | "worn";

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Purchase {
  id: string;
  userId: string;
  products: {
    product: Product;
    quantity: number;
  }[];
  totalAmount: number;
  purchasedAt: string;
}

// MongoDB specific interfaces
export interface MongoUser extends Omit<User, 'id'> {
  _id?: string;
  password: string; // We would store hashed passwords in a real app
}

export interface MongoProduct extends Omit<Product, 'id'> {
  _id?: string;
}

export interface MongoPurchase extends Omit<Purchase, 'id'> {
  _id?: string;
}
