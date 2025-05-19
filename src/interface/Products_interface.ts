

export interface ProductForm {
    nameProduct: string;
    description: string;
    price: number;
    categoryId: number;
    imageUrl?: string;
    quantity: number;
}

export interface ProductResponse {
    id: number;
    nameProduct: string;
    description: string;
    price: number;
    category: CategoryPR;
    imageUrl?: string;
    quantity: number;
    createdAt: string;
    updatedAt: string;
    productStatus: string;
    isNew?: boolean;
}


export interface CategoryPR{
    id: number;
    name: string;
}