import { Listbox } from "@headlessui/react";
import { StaffDataFull } from "../../../interface/StaffData_interface";

interface EmployeeListProps {
    employees: StaffDataFull[];
    formData: { staffId: number };
    setFormData: (data: { staffId: number }) => void;
    searchStaff: string;
    setSearchStaff: (value: string) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ employees, formData, setFormData, searchStaff, setSearchStaff }) => {
    const filteredStaff = employees.filter((staff) =>
        staff.name.toLowerCase().includes(searchStaff.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-2 w-full">
            <p className="block text-sm mb-2 font-semibold">Danh sách nhân viên:</p>
            <Listbox value={formData.staffId} onChange={(val) => setFormData({ ...formData, staffId: val })}>
                <div className="relative w-full">
                    <Listbox.Button className="border p-2 w-full text-left rounded-md flex items-center gap-3">
                        {formData.staffId ? (
                            <>
                                <img
                                    src={employees.find((e) => e.staffId === formData.staffId)?.imageUrl}
                                    alt="avatar"
                                    className="w-16 h-16 rounded-full object-cover outline-green-400 outline"
                                />
                                <div className="flex flex-col ml-6">
                                    <span>
                                        {employees.find((e) => e.staffId === formData.staffId)?.name}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {employees.find((e) => e.staffId === formData.staffId)?.email}
                                    </span>
                                    <span>
                                        {employees.find((e) => e.staffId === formData.staffId)?.position?.positionName}
                                    </span>
                                </div>

                            </>
                        ) : (
                            <span className="text-gray-400">Chọn nhân viên</span>
                        )}
                    </Listbox.Button>

                    <Listbox.Options className="absolute z-10 w-full border mt-1 bg-white max-h-60 overflow-y-auto rounded-md shadow-md cursor-pointer">
                        <div className="p-2">
                            <input
                                type="text"
                                placeholder="Tìm nhân viên..."
                                value={searchStaff}
                                onChange={(e) => setSearchStaff(e.target.value)}
                                className="w-full px-2 py-1 border rounded-md text-sm focus:outline-none focus:ring focus:ring-blue-300"
                            />
                        </div>
                        {filteredStaff.length > 0 ? (
                            filteredStaff.map((staff) => (
                                <Listbox.Option
                                    key={staff.staffId}
                                    value={staff.staffId}
                                    className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                                >
                                    <div className="flex items-center gap-4">
                                        <img src={staff.imageUrl} alt={staff.name} className="w-11 h-11 rounded-full" />
                                        <div className="flex flex-col gap-y-1">
                                            <p className="text-sm text-gray-500">{staff.name}</p>
                                            <p className="text-sm text-gray-500">{staff.email}</p>
                                            <p className="text-sm text-gray-500">{staff.position?.positionName}</p>
                                        </div>
                                    </div>
                                </Listbox.Option>
                            ))
                        ) : (
                            <div className="px-4 py-2 text-gray-400 text-sm">Không tìm thấy nhân viên nào.</div>
                        )}
                    </Listbox.Options>
                </div>
            </Listbox>
        </div>
    );
};

export default EmployeeList;