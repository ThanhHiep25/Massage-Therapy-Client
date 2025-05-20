import { useState } from "react";
import { addDepartment } from "../../../service/apiDepartment";
import { DepartmentIS } from "../../../interface/Department_interface";
import { toast } from "react-toastify";


/**
 * Component để thêm phòng
 * 
 * Có 2 phần:
 * 1. Phần nhập tên phòng
 * 2. Phần nhập mô tả
 * 
 * Nhấn vào nút "Thêm phòng" để thêm phòng
 * 
 * @returns React component
 */

interface Props {
    onReload: () => void;
}

const Department: React.FC<Props> = ({ onReload }) => {
    const [department, setDepartment] = useState('')
    const [description, setDescription] = useState('')



    const handleCreateDepartment = async () => {

        if (department === '') {
            toast.warning("Vui lòng nhập tên phòng!");
            return;
        }
        
        try {
            const newDepartment: DepartmentIS = {
                departmentName: department,
                description: description
            }
            await addDepartment(newDepartment);
            onReload();
            setDepartment('');
            setDescription('');
            toast.success("Thêm phòng thành công!");
        } catch (error: unknown) {
            if ((error as { response?: { data?: { code?: number } } })?.response?.data?.code === 1006) {
                toast.warning("Phòng này đã được tạo!");
                return;
            }

            toast.error("Đã xảy ra lỗi, vui lòng thử lại!");
        }
    }


    return (
        <div className="bg-white p-5 rounded-lg dark:text-black">
            <div className="flex flex-col">
                <label htmlFor="department" className="text-sm ">Tên phòng: <i className="text-gray-500">(Vd: 101 hoặc 101-ST)</i></label>
                <input type="text" name="department" id="department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="sm:w-[50%] h-[50%] mt-2 outline text-sm  outline-1 outline-gray-200 px-3 py-3 rounded-lg" required />
            </div>

            <div className="flex flex-col mt-4">
                <label htmlFor="description" className="text-sm ">Mô tả phòng: </label>
                <input type="text" name="description" id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="sm:w-[50%] h-[50%] mt-2 outline text-sm  outline-1 outline-gray-200 px-3 py-3 rounded-lg" />
            </div>

            <button type='submit' className='sm:w-[20%] text-sm  bg-blue-200 text-gray-500 px-2 py-2 rounded-md hover:bg-blue-400 hover:text-white mt-3'
                onClick={() => handleCreateDepartment()}
            ><span>Thêm phòng</span></button>
        </div>
    )
}

export default Department