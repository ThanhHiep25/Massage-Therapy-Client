export interface CustomerDataFull {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  description: string;
  imageUrl?: string;
  status: string;
  role?: string;
  createdAt: string;
  updatedAt: string;
  isNew?: boolean;
}


export interface CustomerData {
  name: string;
  email: string;
  phone: string;
  password: string;
  address?: string;
  description?: string;
  imageUrl?: string;
}