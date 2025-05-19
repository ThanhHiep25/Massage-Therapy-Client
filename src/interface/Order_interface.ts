import { CustomerDataFull } from "./CustomerData_interface";

export interface OrderItemResponse {
    id: number;
    product: Product;
    nameProduct: string;
    price: number;
    imageUrl: string;
    quantity: number;
}


export interface OrderItem {
    productId: number;
    quantity: number;
}

export interface Order {
    userId?: number;
    guestName?:string;
    shippingAddress?: string;
    shippingPhone?: string;
    notes: string;
    orderItems: OrderItem[];
}

export interface Product {
    id: number;
    nameProduct: string;
    description: string;
    price: number;
    category: {
        id: number;
        name: string;
    };
    imageUrl: string;
    quantity: number;
    createdAt: string | null;
    updatedAt: string | null;
    productStatus: string;
}

export interface OrderItemDetailResponse {
    id: number;
    product: Product;
    quantity: number;
    price: number;
    subTotal: number;
}

export interface OrderResponse {
    id: number;
    user?: CustomerDataFull; // Thông tin khách hàng (nếu có)
    guestName: string | null; // Tên khách hàng ẩn danh (nếu không có user)
    orderDate: string;
    totalAmount: number;
    status: string;
    shippingAddress: string;
    shippingPhone: string;
    notes: string;
    orderItems: OrderItemDetailResponse[]; // Danh sách sản phẩm trong đơn hàng
    createdAt: string;
    updatedAt: string;
    isNew: boolean;
}