import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import { ServiceFull } from "../../interface/ServiceSPA_interface";
import { motion } from "framer-motion"

interface ServiceSpaDetailModalProps {
    open: boolean;
    handleCloseDialog: () => void;
    selectedService: ServiceFull | null;
}


const ServiceSpaDetailModal: React.FC<ServiceSpaDetailModalProps> = ({ open, handleCloseDialog, selectedService }) => {
    return (
        <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth >
            {selectedService && (
                <>
                    <DialogTitle className="text-2xl font-bold text-gray-800 border-b pb-2">{selectedService.name}</DialogTitle>
                    <DialogContent>
                        <motion.img
                            whileHover={{ scale: 1.02 }}
                            src={selectedService.images[0] || "https://via.placeholder.com/300"}
                            alt={selectedService.name}
                            className="w-full sm:h-60 h-28 object-cover mb-4 rounded-md"
                        />


                        <div className="flex w-full max-w-full overflow-x-scroll gap-2">

                            {selectedService.images.length > 0 && selectedService.images.map((image, index) => (
                                <motion.img
                                    whileHover={{ scale: 1.02 }}
                                    key={index}
                                    src={image || "https://via.placeholder.com/300"}
                                    alt={`Service Image ${index + 1}`}
                                    className="w-full sm:h-52 h-20 object-cover mb-4 rounded-md"
                                />
                            ))}
                        </div>

                        <div className="mt-4 flex flex-col gap-y-4">
                            <p className="text-gray-700 text-sm text-justify leading-relaxed">Mô tả: {selectedService.description}</p>
                            <p className="text-gray-600 text-sm">Loại dịch vụ: {selectedService.serviceType}</p>
                            <p className="text-gray-600 text-sm">Giá: {selectedService.price.toLocaleString("vi-VN")} VND</p>
                            <p className="text-gray-600 text-sm">Thời gian: {selectedService.duration} phút</p>
                        </div>
                        <h4 className="text-lg font-semibold mt-4 mb-2">Các bước thực hiện:</h4 >
                        <ul>
                            {selectedService.steps.map((step) => (
                                <li key={step.stepId} className="mb-2 text-sm">
                                    <p className="font-semibold">Bước  {step.stepOrder}:</p>
                                    <p className="text-gray-600 text-justify leading-relaxed"> 
                                        {step.description}
                                    </p>

                                </li>
                            ))}
                        </ul>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="primary">
                            Đóng
                        </Button>
                    </DialogActions>
                </>
            )}
        </Dialog>
    )
}

export default ServiceSpaDetailModal