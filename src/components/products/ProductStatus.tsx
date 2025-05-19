

interface ProductStatusProps {
    productStatus: string
}

const ProductStatus:React.FC<ProductStatusProps> = ({productStatus}) => {
    
    return (
        <p className="absolute top-1 right-0">
            {productStatus === 'INACTIVATE' && (
                <span className="bg-yellow-500 text-white text-xs px-2.5 py-1.5 rounded-full">
                    Ngừng bán
                </span>
            )}
            {productStatus === 'ACTIVATE' && (
                <span className="bg-green-500 text-white text-xs  px-2.5 py-1.5 rounded-full">
                    Đang bán
                </span>
            )}
            {productStatus === 'DELETED' && (
                <span className="bg-red-500 text-white text-xs px-2.5 py-1.5 rounded-full">
                    Đã xóa
                </span>
            )}
            {productStatus === 'SALES' && (
                <span className="bg-blue-500 text-white text-xs px-2.5 py-1.5 rounded-full">
                    Đang giảm giá
                </span>
            )}
        </p>
    );

}

export default ProductStatus