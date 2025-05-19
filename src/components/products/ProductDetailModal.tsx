import React, { useState, useEffect, ChangeEvent } from 'react';
import { ProductResponse } from '../../interface/Products_interface';
import { Category } from '../../interface/ServiceSPA_interface';
import { useAuth } from '../../hooks/AuthContext';

interface ProductDetailModalProps {
    product: ProductResponse | null;
    onClose: () => void;
    onUpdate: (id: number, formData: FormData) => Promise<void>;
    categories: Category[];
    handleDeleteProduct: (id: number) => void;
    handleDeactivateProduct: (id: number) => void;
    handleActivateProduct: (id: number) => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose, onUpdate, categories, handleDeleteProduct, handleDeactivateProduct, handleActivateProduct }) => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [nameProduct, setNameProduct] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState<number | ''>(0);
    const [quantity, setQuantity] = useState<number | ''>(0);
    const [categoryId, setCategoryId] = useState<number | ''>('');
    const [newImage, setNewImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        if (product) {
            setNameProduct(product.nameProduct);
            setDescription(product.description || '');
            setPrice(product.price);
            setQuantity(product.quantity);
            setCategoryId(product.category?.id || '');
            setPreviewImage(product.imageUrl || null);
            setNewImage(null);
            setIsEditing(false); // Reset về chế độ xem khi sản phẩm thay đổi
        } else {
            setNameProduct('');
            setDescription('');
            setPrice('');
            setQuantity('');
            setCategoryId('');
            setPreviewImage(null);
            setNewImage(null);
            setIsEditing(false);
        }
    }, [product]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        switch (name) {
            case 'nameProduct':
                setNameProduct(value);
                break;
            case 'description':
                setDescription(value);
                break;
            case 'price':
                setPrice(value === '' ? '' : Number(value));
                break;
            case 'quantity':
                setQuantity(value === '' ? '' : Number(value));
                break;
            default:
                break;
        }
    };

    const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setCategoryId(event.target.value === '' ? '' : Number(event.target.value));
    };

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setNewImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleStartEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (!product) return;

        const formData = new FormData();
        formData.append('nameProduct', nameProduct);
        formData.append('description', description);
        formData.append('price', String(price));
        formData.append('quantity', String(quantity));
        if (categoryId !== '') {
            formData.append('categoryId', String(categoryId));
        }
        if (newImage) {
            formData.append('image', newImage);
        }

        await onUpdate(product.id, formData);
        setIsEditing(false); // Quay lại chế độ xem sau khi lưu
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        // Có thể reset state về giá trị ban đầu nếu muốn
        if (product) {
            setNameProduct(product.nameProduct);
            setDescription(product.description || '');
            setPrice(product.price);
            setQuantity(product.quantity);
            setCategoryId(product.category?.id || '');
            setPreviewImage(product.imageUrl || null);
            setNewImage(null);
        }
    };

    if (!product) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center">
            <div className="relative bg-white rounded-lg shadow-lg p-6 w-full sm:max-w-md max-w-sm">
                <div className="">
                    <button onClick={onClose} className="absolute top-0 right-0 bg-gray-300/20 hover:bg-red-300 hover:text-white text-gray-800 font-bold py-3 px-7 rounded-bl-full">
                        X
                    </button>
                </div>
                <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Chỉnh sửa sản phẩm' : product.nameProduct}</h2>

                {isEditing ? (
                    <>
                        <div className="mb-4 text-sm">
                            <label htmlFor="nameProduct" className="block text-gray-700 text-sm font-bold mb-2">Tên sản phẩm:</label>
                            <input
                                type="text"
                                id="nameProduct"
                                name="nameProduct"
                                value={nameProduct}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4 text-sm">
                            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Mô tả:</label>
                            <textarea
                                id="description"
                                name="description"
                                value={description}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4 text-sm">
                            <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">Giá:</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={price}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4 text-sm">
                            <label htmlFor="quantity" className="block text-gray-700 text-sm font-bold mb-2">Số lượng:</label>
                            <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                value={quantity}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4 text-sm">
                            <label htmlFor="categoryId" className="block text-gray-700 text-sm font-bold mb-2">Danh mục:</label>
                            <select
                                id="categoryId"
                                value={categoryId}
                                onChange={handleCategoryChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="">Chọn danh mục</option>
                                {categories.map(cat => (
                                    <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4 text-sm">
                            <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">Ảnh mới (tùy chọn):</label>
                            <input
                                type="file"
                                id="image"
                                name="image"
                                onChange={handleImageChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            {previewImage && (
                                <img src={previewImage} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-md" />
                            )}
                        </div>

                        <div className="flex justify-center text-sm items-center gap-2">
                            <button onClick={handleSave} className='bg-green-500/80 p-3 hover:bg-green-600 hover:text-white rounded-lg'>
                                Lưu chỉnh sửa
                            </button>
                            <button onClick={handleCancelEdit} className='bg-gray-400/80 p-3 hover:bg-gray-500 hover:text-white rounded-lg'>
                                Hủy
                            </button>
                            <button onClick={() => handleDeleteProduct(product.id)} className='bg-red-200/80 p-3 hover:bg-red-300 hover:text-white rounded-lg'>
                                Xóa sản phẩm
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {product.imageUrl && (
                            <img
                                src={product.imageUrl}
                                alt={product.nameProduct}
                                className="w-full max-h-[320px] object-cover rounded-md mb-4"
                            />
                        )}
                        <p className="text-gray-700 mb-2">Mô tả: {product.description}</p>
                        <p className="text-blue-500 font-semibold mb-2">Giá: {product.price.toLocaleString()} VNĐ</p>
                        <p className="text-gray-600 mb-2">Danh mục: {product.category?.name}</p>
                        <p className="text-gray-600 mb-2">Số lượng: {product.quantity}</p>
                        <p className="text-gray-500 text-sm mb-2">
                            Tạo lúc: {new Date(product.createdAt).toLocaleString("vi-VN", { weekday: 'long', hour: 'numeric', minute: '2-digit', second: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </p>
                        <p className="text-gray-500 text-sm mb-2">
                            Cập nhật lúc: {new Date(product.updatedAt).toLocaleString("vi-VN", { weekday: 'long', hour: 'numeric', minute: '2-digit', second: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </p>
                        <div className="flex justify-center text-sm items-center gap-2">
                            {
                                user?.roles === "admin" && (
                                    <button onClick={handleStartEdit} className='bg-gray-300/80 p-3 hover:bg-blue-300 hover:text-white rounded-lg'>
                                        Chỉnh sửa
                                    </button>
                                )
                            }
                            {
                                product.productStatus === "ACTIVATE" ? (
                                    <button onClick={() => handleDeactivateProduct(product.id)} className='bg-orange-200/80 p-3 hover:bg-orange-300 hover:text-white rounded-lg'>
                                        Ngừng bán
                                    </button>
                                ) : (

                                    <button onClick={() => handleActivateProduct(product.id)} className='bg-green-200/80 p-3 hover:bg-green-300 hover:text-white rounded-lg'>
                                        Đang bán
                                    </button>
                                )
                            }
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProductDetailModal;