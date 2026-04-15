export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  createdAt: string;
}

export interface CheckoutPayload {
  items: CartItem[];
  discountCodes: string[];
}

export interface CheckoutResult {
  ok: boolean;
  orderId?: string;
  total?: number;
  error?: string;
}
