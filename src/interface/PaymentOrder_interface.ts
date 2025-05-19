interface CategoryResponse {
  id: number;
  name: string;
}

interface ProductResponse {
  id: number;
  nameProduct: string;
  description: string;
  price: number;
  category: CategoryResponse;
  imageUrl: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  productStatus: string;
}

interface OrderItemResponse {
  id: number;
  product: ProductResponse;
  quantity: number;
  price: number;
  subTotal: number;
}

interface UserResponse {
  id: number;
  name: string;
  username: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  phone: string;
  imageUrl: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderResponse {
  id: number;
  user: UserResponse | null;
  guestName: string | null;
  orderDate: string;
  totalAmount: number;
  status: string;
  shippingAddress: string
  shippingPhone: string;
  notes: string | null;
  orderItems: OrderItemResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface PaymentOrderResponse {
  id: number;
  paymentMethod: string;
  order: OrderResponse;
  transactionId: string;
  amount: number;
  paymentDate: string;
  transactionTime: string;
  bankCode: string | null;
  status: string;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}
