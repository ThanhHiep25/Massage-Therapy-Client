
export interface PaymentResponse {
    id: number;
    paymentMethod: string;
    appointment: {
      id: number;
      gustName: string | null; // Cho phép giá trị null
      userId: User | null;     // Cho phép giá trị null nếu userId có thể không có
      appointmentDateTime: string;
      totalPrice: number;
      serviceIds: {
        id: number;
        name: string;
      }[];
    };
    transactionId: string;
    bankCode: string;
    amount: number;
    paymentDate: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  }


  export interface User {
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