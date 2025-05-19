import { XIcon } from 'lucide-react';
import { useState } from 'react';
import { saveGooglePayPaymentInfo } from '../../service/apiPayment';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Payment } from '@mui/icons-material';
import GooglePayButton from '@google-pay/button-react';
import { OrderResponse } from '../../interface/Order_interface';
import { createPaymentOrder } from '../../service/apiPaymentOrder';
import { getDiscountCodeByCode } from '../../service/apiDiscountCode';
import { toast } from 'react-toastify';

interface Props {
    open: boolean;
    onClose: () => void;
    order: OrderResponse | null;
    onUpdateSuccess?: () => void;
    handleUpdateOrderPaidStatus: (orderId: number, orderName: string) => void;
}

const PaymentOrderModal: React.FC<Props> = ({ open, onClose, order, onUpdateSuccess, handleUpdateOrderPaidStatus }) => {
    const [discountedPrice, setDiscountedPrice] = useState<number | null>(null);
    const [discountError, setDiscountError] = useState("");
    const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
    const [discountCode, setDiscountCode] = useState("");
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const navigation = useNavigate();

    if (!open || !order) return null;

    const totalPriceToPay = discountedPrice !== null ? discountedPrice : order.totalAmount;

    const handleApplyDiscount = async () => {
        setIsApplyingDiscount(true);
        setDiscountError("");

        if (!discountCode.trim()) {
            setDiscountedPrice(null);
            setIsApplyingDiscount(false);
            toast.error("Vui lòng nhập mã giảm giá");
            return;

        }
        const dcode = await getDiscountCodeByCode(discountCode);
        setTimeout(() => {
            if (dcode != '') {
                const discountAmount = order.totalAmount * Number(dcode.discountAmount / 100); // Giảm 10%
                setDiscountedPrice(order.totalAmount - discountAmount);
            } else if (discountCode !== "") {
                setDiscountError("Mã giảm giá không hợp lệ.");
                setDiscountedPrice(null);
            } else {
                setDiscountedPrice(null);
            }
            setIsApplyingDiscount(false);
        }, 500);
    };

    const handleProceedPayment = async () => {
        setIsProcessingPayment(true);
        try {
            const amountToPay = discountedPrice !== null ? discountedPrice : order.totalAmount;
            const paymentData = {
                orderId: order.id,
                amount: amountToPay,
            };
            const paymentResponse = await createPaymentOrder(paymentData);

            if (paymentResponse && paymentResponse.paymentUrl) {
                window.location.href = paymentResponse.paymentUrl;
                onClose();
            } else {
                console.error("Không nhận được URL thanh toán từ server:", paymentResponse);
            }
        } catch (error: unknown) {
            console.error("Lỗi khi tạo yêu cầu thanh toán:", error);
        } finally {
            setIsProcessingPayment(false);
        }
    };

    const handleGooglePaySuccess = async (paymentData: any) => {
        setIsProcessingPayment(true);
        try {
            const payload = {
                orderId: order.id,
                amount: discountedPrice !== null ? discountedPrice : order.totalAmount,
                paymentMethodToken: paymentData.paymentMethodData.tokenizationData.token,
                transactionId: paymentData.paymentMethodData.transactionId,
            };

            const response = await saveGooglePayPaymentInfo(payload);

            if (response.status === 200) {
                console.log('Thanh toán Google Pay thành công và thông tin đã được lưu.');
                onClose();
                if (onUpdateSuccess) {
                    onUpdateSuccess();
                }
                navigation(`/google-pay-success?status=googlepay_success&transactionId=${payload.transactionId || 'N/A'}&amount=${payload.amount}`);
            } else {
                console.error('Lỗi khi lưu thông tin thanh toán Google Pay:', response);
                navigation(`/google-pay-success?status=googlepay_failed&transactionId=${payload.transactionId || 'N/A'}&amount=${payload.amount}`);
            }
        } catch (error: unknown) {
            console.error('Lỗi trong quá trình xử lý thanh toán Google Pay:', error);
            navigation(`/google-pay-success?status=googlepay_failed`);
        } finally {
            setIsProcessingPayment(false);
        }
    };

    const handleGooglePayError = (error: unknown) => {
        console.error('Lỗi thanh toán Google Pay:', error);
        setIsProcessingPayment(false);
        navigation(`/google-pay-success?status=googlepay_failed`);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm dark:text-black">
            <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-xl shadow-lg relative sm:m-0 m-4">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-4 text-gray-600 hover:text-red-500 text-xl font-bold"
                >
                    <XIcon className="h-6 w-6" />
                </button>

                <h2 className="text-xl font-bold mb-4 text-center">Chi tiết thanh toán</h2>

                <div className="space-y-3 sm:text-[16px] text-[14px]">
                    <div>
                        <span className="font-medium">Khách hàng:</span> {order.user?.name || order.guestName || "Khách hàng ẩn danh"}
                    </div>
                    <div>
                        <span className="font-medium">Email:</span> {order.user?.email || "Không có"}
                    </div>
                    <div>
                        <span className="font-medium">Số điện thoại:</span> {order.user?.phone || "Không có"}
                    </div>
                    <div>
                        <span className="font-medium">Ngày đặt:</span> {new Date(order.orderDate).toLocaleString("vi-VN")}
                    </div>
                    <div>
                        <span className="font-medium">Tổng tiền:</span> {order.totalAmount.toLocaleString("vi-VN")}đ
                    </div>
                </div>

                <div className="mt-4 sm:text-[16px] text-[14px]">
                    <span className="font-medium">Sản phẩm:</span>
                    <ul className="list-disc list-inside ml-4 mt-1 flex flex-col gap-y-2">
                        {order.orderItems.map((item) => (
                            <li key={item.id} className="flex items-center gap-5 p-2 bg-green-200/50 rounded-lg">
                                <motion.img
                                    whileInView={{
                                        x: 0,
                                        y: 0,
                                        transition: { duration: 0.3 },
                                        scale: 1.1,
                                    }}
                                    src={item.product.imageUrl}
                                    alt={item.product.nameProduct}
                                    className="w-16 h-16 object-cover rounded"
                                />
                                <div className="flex flex-col">
                                    <span className="font-medium text-[16px]">{item.product.nameProduct}</span>
                                    <span className="text-gray-600">Số lượng: {item.quantity}</span>
                                    <span className="text-gray-600">Giá: {item.price.toLocaleString("vi-VN")}đ</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mb-4 mt-4 sm:text-[16px] text-[14px]">
                    <label htmlFor="discountCode" className="block text-gray-700 text-sm font-bold mb-2">
                        Mã giảm giá (nếu có):
                    </label>
                    <input
                        type="text"
                        id="discountCode"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                    />
                    <button
                        onClick={handleApplyDiscount}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2 disabled:bg-gray-400"
                        disabled={isApplyingDiscount}
                    >
                        {isApplyingDiscount ? "Đang áp dụng..." : "Áp dụng"}
                    </button>
                    {discountError && <p className="text-red-500 text-xs italic mt-1">{discountError}</p>}
                    {discountedPrice !== null && (
                        <p className="text-green-500 font-semibold mt-2">
                            Tổng tiền sau giảm giá: {discountedPrice.toLocaleString("vi-VN")}đ
                        </p>
                    )}
                </div>

                <div className="sm:text-[16px] text-[14px]
                ">
                    <label >Cập nhật trạng thái thanh toán <i className='text-red-400'>(Chỉ áp dụng cho thanh toán tiền mặt tại cửa hàng)</i></label>
                    <button
                        onClick={() => handleUpdateOrderPaidStatus(order.id, order.id.toString())}
                        className='bg-gray-300 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2'>
                        Đã thanh toán
                    </button>
                </div>

                <div className="mt-2 sm:text-[16px] text-[14px]">
                    <label htmlFor="">Chọn phương thức thanh toán:</label>
                    <div className="mb-4 mt-4 flex flex-col gap-2">
                        <GooglePayButton
                            className="w-full h-full flex items-center justify-center p-2 hover:bg-gray-200 rounded-lg"
                            environment="TEST"
                            buttonSizeMode="fill"
                            buttonColor="white"
                            paymentRequest={{
                                apiVersion: 2,
                                apiVersionMinor: 0,
                                allowedPaymentMethods: [
                                    {
                                        type: 'CARD',
                                        parameters: {
                                            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                                            allowedCardNetworks: ['AMEX', 'DISCOVER', 'JCB', 'MASTERCARD', 'VISA'],
                                        },
                                        tokenizationSpecification: {
                                            type: 'PAYMENT_GATEWAY',
                                            parameters: {
                                                gateway: 'example',
                                                gatewayMerchantId: 'exampleGatewayMerchantId',
                                            },
                                        },
                                    },
                                ],
                                merchantInfo: {
                                    merchantId: 'YOUR_GOOGLE_MERCHANT_ID',
                                    merchantName: 'NGUYEN HIEP - SPA ROYAL',
                                },
                                transactionInfo: {
                                    totalPriceStatus: 'FINAL',
                                    totalPrice: totalPriceToPay.toString(),
                                    currencyCode: 'VND',
                                    countryCode: 'VN',
                                },
                            }}
                            onLoadPaymentData={handleGooglePaySuccess}
                            onError={handleGooglePayError}
                        />
                        <button
                            onClick={handleProceedPayment}
                            className="hover:bg-blue-500 mx-2 text-black font-bold sm:py-2 px-4 rounded focus:outline-none disabled:bg-gray-400 hover:text-white outline outline-neutral-200"
                            disabled={isProcessingPayment}
                        >
                            {isProcessingPayment ? "Đang tiến hành..." : (
                                <div className="flex items-center justify-center gap-2 rounded-lg p-2">
                                    <Payment />
                                    <p>Thanh toán VNPay</p>
                                </div>
                            )}
                        </button>
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentOrderModal;