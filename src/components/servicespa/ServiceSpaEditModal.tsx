import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import { Category, ServiceFull, ServiceSPAFormUpdate, StepFull } from "../../interface/ServiceSPA_interface";


interface ServiceSpaEditModalProps {
    isEditDialogOpen: boolean;
    handleCloseEditDialog: () => void;
    editService: ServiceFull | null;
    steps: StepFull[];
    handleUpdateService: (id: number, dataToUpdate: ServiceSPAFormUpdate) => void;
    handleStepChange: (index: number, description: string) => void;
    handleRemoveStep: (index: number) => void;
    handleAddStep: () => void;
    categories: Category[] ;
}

const ServiceSpaEditModal: React.FC<ServiceSpaEditModalProps> = ({ isEditDialogOpen, handleCloseEditDialog, editService, steps, handleUpdateService, handleStepChange, handleRemoveStep, handleAddStep, categories }) => {
    return (
        <Dialog open={isEditDialogOpen} onClose={handleCloseEditDialog} maxWidth="md" fullWidth>
                        {editService && (
                            <>
                                <DialogTitle className="text-2xl font-bold text-gray-800 border-b pb-2">
                                    Cập nhật dịch vụ
                                </DialogTitle>
                                <DialogContent className="bg-gray-50 p-6 mt-4">
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            if (!editService) return; 
        
                                            const formElement = e.currentTarget;
                                            const formData = new FormData(formElement);
        
                                            // Chuẩn bị mảng steps từ state `steps` đã được quản lý trên UI
                                            const finalSteps: StepFull[] = steps.map((step, index) => ({
                                                stepId: step.stepId, 
                                                stepOrder: index + 1, 
                                                description: step.description,
                                            }));
        
                                            // Tạo payload theo interface ServiceSPAFormUpdate
                                            const updatedServiceData: ServiceSPAFormUpdate = {
                                                name: formData.get("name") as string,
                                                description: formData.get("description") as string,
                                                price: Number(formData.get("price")),
                                                duration: Number(formData.get("duration")),
                                                categoryId: Number(formData.get("categoryId")),
                                                serviceType: formData.get("serviceType") as string,
                                                steps: finalSteps,
                                                images: editService.images,
                                               
                                            };
        
                                            // Gọi hàm handleUpdateService
                                            handleUpdateService(editService.id, updatedServiceData);
                                        }}
                                        className="sm:space-y-6"
                                    >
                                        <div>
                                            <label className="block sm:text-sm text-[12px] font-medium text-gray-700 mb-1">
                                                Tên dịch vụ
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                defaultValue={editService.name}
                                                className="w-full px-4 py-2 sm:text-sm text-[12px] border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                                placeholder="Nhập tên dịch vụ"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block sm:text-sm text-[12px] font-medium text-gray-700 sm:mb-1 mt-2">
                                                Mô tả
                                            </label>
                                            <textarea
                                                name="description"
                                                defaultValue={editService.description}
                                                className="w-full px-4 py-2 sm:text-sm text-[12px] border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                                placeholder="Nhập mô tả dịch vụ"
                                                rows={4}
                                                required
                                            />
                                        </div>
                                        <div className="sm:grid sm:grid-cols-2 sm:gap-4 flex flex-col gap-y-2">
                                            <div>
                                                <label className="block sm:text-sm text-[12px] font-medium text-gray-700 mb-1">
                                                    Giá (VND)
                                                </label>
                                                <input
                                                    type="number"
                                                    name="price"
                                                    defaultValue={editService.price}
                                                    className="w-full px-4 py-2 sm:text-sm text-[12px] border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                                    placeholder="Nhập giá dịch vụ"
                                                    required
                                                />
                                            </div>
        
                                            <div>
                                                <label className="block sm:text-sm text-[12px] font-medium text-gray-700 mb-1"> {/* Giữ class label cũ cho nhất quán nếu muốn */}
                                                    Thời gian thực hiện (phút)
                                                </label>
                                                <select
                                                    name="duration"
                                                    className="w-full p-3 sm:text-sm text-[12px] border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700" // Điều chỉnh class cho giống các input khác nếu cần
                                                    defaultValue={editService.duration.toString()} // <<<< QUAN TRỌNG: defaultValue của select nên là string
                                                    required
                                                >
                                                    <option value="" disabled>Chọn thời gian</option> {/* Thêm disabled cho option mặc định */}
                                                    {Array.from({ length: (120 - 30) / 5 + 1 }, (_, index) => {
                                                        const value = 30 + index * 5;
                                                        return (
                                                            <option key={value} value={value.toString()}> {/* value của option cũng nên là string */}
                                                                {value} phút
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block sm:text-sm text-[12px] font-medium text-gray-700 mb-1 mt-1">
                                                Danh mục
                                            </label>
                                            <select
                                                name="categoryId"
                                                defaultValue={editService.categoryId}
                                                className="w-full px-4 py-2 border sm:text-sm text-[12px] border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                                required
                                            >
                                                {categories.map((category) => (
                                                    <option key={category.categoryId} value={category.categoryId}>
                                                        {category.categoryName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block sm:text-sm text-[12px] font-medium text-gray-700 mb-1 mt-1">
                                                Loại dịch vụ
                                            </label>
                                            <input
                                                type="text"
                                                name="serviceType"
                                                defaultValue={editService.serviceType}
                                                className="w-full px-4 py-2 sm:text-sm text-[12px] border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                                placeholder="Nhập loại dịch vụ"
                                                required
                                            />
                                        </div>
                                        {/* Chỉnh sửa các bước thực hiện */}
                                        <div>
                                            <label className="block sm:text-sm text-[12px] font-medium text-gray-700 mb-1 mt-1">Các bước thực hiện</label>
                                            {steps.map((step, index) => (
                                                <div key={index} className="flex items-center space-x-2 mb-2">
                                                    <textarea
                                                        value={step.description}
                                                        onChange={(e) => handleStepChange(index, e.target.value)}
                                                        className="w-full px-4 py-2 sm:text-sm text-[12px] border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                                        placeholder={`Nhập bước ${index + 1}`}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveStep(index)}
                                                        className="bg-red-500 sm:text-sm text-[12px] text-white px-3 py-1 rounded"
                                                    >
                                                        Xóa
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={handleAddStep}
                                                className="bg-blue-500 text-white px-4 py-2 rounded sm:text-sm text-[12px]"
                                            >
                                                + Thêm bước
                                            </button>
                                        </div>
        
                                        <DialogActions className="flex justify-end space-x-4 mt-4">
                                            <Button
                                                onClick={handleCloseEditDialog}
                                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-md"
                                            >
                                                Hủy
                                            </Button>
                                            <Button
                                                type="submit"
                                                className="bg-blue-500 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg shadow-md"
                                            >
                                                Cập nhật
                                            </Button>
                                        </DialogActions>
                                    </form>
                                </DialogContent>
                            </>
                        )}
                    </Dialog>
    )
}

export default ServiceSpaEditModal