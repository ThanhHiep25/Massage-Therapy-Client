export interface StaffData {
  name: string;
  email: string;
  phone: string;
  address?: string;
  positionId?: number;
  imageUrl?: string;
  startDate: string;
}


export interface StaffDataFull {
    staffId: number;
    name: string;
    email: string;
    phone: string;
    address?: string;
    position?: {
      positionId: number;
      positionName: string;
    };
    status: string;
    startDate: string;
    imageUrl: string;
}


export interface Position {
  positionId: number;
  positionName: string;
}
