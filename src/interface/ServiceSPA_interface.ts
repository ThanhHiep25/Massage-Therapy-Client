interface Step {
  stepOrder: number;
  description: string;
}

export interface StepFull {
  stepId?: number;
  stepOrder: number;
  description: string;
}

export interface CloudinaryResponse {
  secure_url: string;
}

export interface Category {
  categoryId: number;
  categoryName: string;
}

export interface CategoryForm {
  categoryName: string;
}

export interface ServiceSPAForm {
  name: string;
  description: string;
  price: number;
  duration: number;
  categoryId: number;
  imageUrls: string[];
  serviceType: string;
  steps: Step[];
}

export interface ServiceSPAFormUpdate {
    name: string;
    description: string;
    price: number;
    duration: number;
    categoryId: number;
    serviceType: string;
    steps: StepFull[];
    images: string[];
}

export interface ServiceFull {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  categoryId: number;
  images: string[];
  serviceType: string;
  steps: StepFull[];
  status: string;
  createdAt: string;
  updatedAt: string;
}
