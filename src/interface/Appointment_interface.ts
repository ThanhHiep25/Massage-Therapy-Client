export interface AppointmentForm {
  userId?: number;
  appointmentDateTime: string;
  totalPrice: number;
  notes: string;
  serviceIds: number[];
}


export interface AppointmentData {
    id: number;
    userId: number;
    serviceIds: [];
    appointmentDateTime: string;
    notes: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  name: string;
  address: string;
  imageUrl: string;
  description: string;
  role: string;
  status: string;
}

export interface Step {
  stepId: number;
  stepOrder: number;
  description: string;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  categoryId: number;
  images: string[];
  serviceType: string;
  steps: Step[];
  status: string;
}

export interface AppointmentResponse {
  id: number;
  userId?: User;
  gustName?: string,
  appointmentDateTime: string; // ISO format
  totalPrice: number;
  notes: string;
  status: string;
  serviceIds: Service[];
  createdAt: string;
}


