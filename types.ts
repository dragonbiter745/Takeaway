
export enum Page {
  Login,
  Menu,
  Checkout,
  OrderStatus,
  OrderHistory,
}

export interface User {
  name: string;
  emailOrPhone: string;
}

export interface FoodItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  items: FoodItem[];
}

export interface CartItem {
  item: FoodItem;
  quantity: number;
  restaurant: string;
}

export interface Order {
  id: string;
  customerName: string;
  items: CartItem[];
  status: 'Pending' | 'Preparing' | 'Ready for Pickup' | 'Picked Up';
  timestamp: Date;
  pickupTime: Date;
  total: number;
}
