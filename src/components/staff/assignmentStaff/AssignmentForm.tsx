import DatePicker from "react-datepicker";
import { AssignmentFormData } from "../../../interface/AssignmentStaff_interface";
import { DepartmentResponse } from "../../../interface/Department_interface";

interface AssignmentFormProps {
    formData: AssignmentFormData;
    setFormData: (data: Partial<AssignmentFormData>) => void;
    handleCreate: () => void;
    holidays: string[];
    department: DepartmentResponse[]
}

const AssignmentForm: React.FC<AssignmentFormProps> = ({ formData, setFormData, handleCreate, holidays, department }) => {
    const handleDateChange = (date: Date) => {
        setFormData({
            assignedDate: date.toISOString(),
            note: "",
        });
    };



    return (
        <div className="p-5 bg-white rounded-xl">
            <div className="w-[300px]">
                <label className="block text-sm mb-2 font-semibold">Ngày phân công</label>
                <DatePicker
                    selected={new Date(formData.assignedDate)}
                    onChange={(date) => date && handleDateChange(date)}
                    dateFormat="yyyy-MM-dd"
                    className="w-full border rounded p-2"
                    dayClassName={(date) => {
                        const dateStr = date.toISOString().split("T")[0];
                        return holidays.includes(dateStr)
                            ? "bg-red-200 text-red-700 font-bold"
                            : "";
                    }}
                />
            </div>

            <div className="w-[300px] mt-4">
                <label htmlFor="" className="block text-sm mb-2 font-semibold">Chọn phòng: </label>
                <select className="w-full border rounded p-2" value={formData.departmentId} onChange={(e) => setFormData({ ...formData, departmentId: Number(e.target.value) })}>
                    <option value="">Chọn</option>   
                    {department.map((item) => (
                        <option value={item.departmentId}>{item.departmentName}</option>

                    ))}
                </select>
            </div>

            <div className="mt-4 sm:w-[50%]">
                <label className="block text-sm mb-2 font-semibold">Ghi chú</label>
                <textarea
                    className="w-full border p-3 rounded-md"
                    placeholder="Ghi chú"
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                />
            </div>
            <button
                onClick={handleCreate}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            >
                Phân công
            </button>
        </div>
    );
};

export default AssignmentForm;