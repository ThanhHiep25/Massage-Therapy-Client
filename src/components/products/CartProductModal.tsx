import React, { useState } from 'react';
import { ProductResponse } from '../../interface/Products_interface';
import { ShoppingBag } from 'lucide-react';

interface CartProductModalProps {
    product: ProductResponse | null;
    onClose: () => void;
}

const CartProductModal: React.FC<CartProductModalProps> = ({ product, onClose }) => {
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState<string | null>(null); // Thông báo lỗi

    if (!product) {
        return null;
    }

    const handleOrder = () => {
        if (quantity > product.quantity) {
            setError(`Số lượng đặt không được vượt quá ${product.quantity}.`);
            return;
        }

        const orderItem = {
            ...product, // Lưu toàn bộ thông tin sản phẩm
            quantity,   // Thêm số lượng
        };

        // Lấy danh sách orderItems từ localStorage
        const existingOrders = JSON.parse(localStorage.getItem('orderItems') || '[]');

        // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
        const existingIndex: number = existingOrders.findIndex((item: ProductResponse & { quantity: number }) => item.id === product.id);
        if (existingIndex !== -1) {
            // Nếu sản phẩm đã tồn tại, cập nhật số lượng
            existingOrders[existingIndex].quantity += quantity;
        } else {
            // Nếu sản phẩm chưa tồn tại, thêm sản phẩm mới
            existingOrders.push(orderItem);
        }

        // Lưu lại vào localStorage
        localStorage.setItem('orderItems', JSON.stringify(existingOrders));

        alert('Sản phẩm đã được thêm vào giỏ hàng!');
        onClose(); // Đóng modal
    };

    const handleIncrease = () => {
        if (quantity < product.quantity) {
            setQuantity((prev) => prev + 1);
            setError(null); // Xóa thông báo lỗi nếu số lượng hợp lệ
        } else {
            setError(`Số lượng đặt không được vượt quá số lượng trong kho ${product.quantity}.`);
        }
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
            setError(null); // Xóa thông báo lỗi nếu số lượng hợp lệ
        }
    };

    const totalPrice = product.price * quantity;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="relative bg-white rounded-lg shadow-lg p-6 w-full sm:max-w-lg max-w-sm">
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800">Đặt hàng</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-red-500 transition duration-200"
                    >
                        ✕
                    </button>
                </div>

                {/* Product Info */}
                <div className="flex flex-col items-center mb-6 ">
                    <img
                        src={product.imageUrl}
                        alt={product.nameProduct}
                        className="w-40 h-40 object-cover rounded-md shadow-md mb-4"
                    />
                    <h3 className="sm:text-[24px] text-lg font-semibold text-gray-700">{product.nameProduct}</h3>
                    <div className="w-full sm:text-lg text-sm">
                        <p className="text-blue-500 mt-2">
                            Giá: {product.price.toLocaleString()} VNĐ
                        </p>
                    </div>
                </div>

                {/* Quantity Selector */}
                <div className="mb-4 flex flex-col gap-2 ">
                    <div className="flex items-center gap-4 sm:text-lg text-sm">
                        <label className="block text-gray-700  mb-2">Số lượng:</label>
                        <div className="flex items-center justify-center gap-4">
                            <button
                                type="button"
                                onClick={handleDecrease}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 sm:px-4 sm:py-2 px-2 py-1  rounded-lg transition duration-200"
                            >
                                -
                            </button>
                            <span className="">{quantity}</span>
                            <button
                                type="button"
                                onClick={handleIncrease}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 sm:px-4 sm:py-2 px-2 py-1 rounded-lg transition duration-200"
                            >
                                +
                            </button>
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>

                <div className="mb-10">
                    <p className="text-green-500 sm:text-lg text-sm">
                        Tổng tiền: {totalPrice.toLocaleString()} VNĐ
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex justify-between items-center text-sm">
                    <button
                        type="button"
                        onClick={handleOrder}
                        className="flex items-center gap-2 bg-green-400 hover:bg-green-500 text-white px-6 py-3 rounded-lg shadow-md transition duration-200"
                    >
                        <ShoppingBag /> Thêm vào giỏ hàng
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-400/80 hover:bg-red-500 text-white px-6 py-3 rounded-lg shadow-md transition duration-200"
                    >
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartProductModal;