import { AppointmentResponse } from "./Appointment_interface";
import { DepartmentResponse } from "./Department_interface";
import { StaffDataFull } from "./StaffData_interface";


export interface AssignmentFormData {
    staffId: number;
    appointmentId: number;
    departmentId: number;
    assignedDate: string;
    note?: string;
}

export interface AssignmentStaffData {
    id: number;
    staff: StaffDataFull;
    appointment: AppointmentResponse;
    department: DepartmentResponse;
    assignedDate: string;
    note?: string;
    status : string; 
}
