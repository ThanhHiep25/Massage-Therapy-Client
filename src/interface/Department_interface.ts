export interface DepartmentIS {
  departmentName: string;
  description?: string;
}


export interface DepartmentResponse {
  departmentId: number;
  departmentName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  status: string;
}