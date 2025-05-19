interface OrderStatusProps {
    orderStatus: string;
}

const OrderStatus: React.FC<OrderStatusProps> = ({ orderStatus }) => {
    return (
        <p className="absolute top-1 right-0">
            {orderStatus === 'PENDING' && (
                <span className="bg-yellow-500 text-white text-xs px-2.5 py-2 rounded-full">
                    Chờ xác nhận
                </span>
            )}
            {orderStatus === 'DELIVERED' && (
                <span className="bg-green-500 text-white text-xs px-2.5 py-2 rounded-full">
                    Đã giao
                </span>
            )}
            {orderStatus === 'CANCELLED' && (
                <span className="bg-red-500 text-white text-xs px-2.5 py-2 rounded-full">
                    Đã hủy  
                </span>
            )}
            {orderStatus === 'PAID' && (
                <span className="bg-blue-500 text-white text-xs px-2.5 py-2 rounded-full">
                    Đã thanh toán
                </span>
            )}
        </p>
    );
};

export default OrderStatus;