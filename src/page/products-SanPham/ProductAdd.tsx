import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createProduct } from '../../service/apiProduct';
import { ProductForm } from '../../interface/Products_interface';
import { getCategories } from '../../service/apiService';
import { Category, CloudinaryResponse } from '../../interface/ServiceSPA_interface';
import { CloudUpload } from 'lucide-react';
import { DeleteForever } from '@mui/icons-material';
import axios, { AxiosResponse } from 'axios';
import { motion } from 'framer-motion'

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const PRODUCTS = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRODUCTS;
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`


const ProductAdd: React.FC = () => {
    const [formData, setFormData] = useState<ProductForm>({
        nameProduct: '',
        description: '',
        price: 0,
        categoryId: 1,
        imageUrl: '',
        quantity: 0,
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [category, setCategory] = useState<Category[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]); // Chứa URL của ảnh đã chọn
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    useEffect(() => {
        fetchCategory();
    }, []);


    const fetchCategory = async () => {
        try {
            const response = await getCategories();
            setCategory(response);
        } catch (error) {
            console.error('Error fetching category:', error);
        }
    };

    const validateInput = (name: string, value: string): string => {
        switch (name) {
            case 'price':
                if (!/^\d+(\.\d{1,2})?$/.test(value)) {
                    return 'Giá phải là số hợp lệ không được để trống.';
                }
                if (parseFloat(value) < 1000) {
                    return 'Giá phải tối thiểu là 1.000 VNĐ.';
                }
                break;
            case 'quantity':
                if (!/^\d+$/.test(value)) {
                    return 'Số lượng phải là số nguyên dương.';
                }
                if (parseInt(value) < 1) {
                    return 'Số lượng phải tối thiểu la 1.';
                }
                break;
            case 'nameProduct':
                if (value.trim().length === 0) {
                    return 'Tên sản phẩm không được để trống.';
                }
                break;
            case 'description':
                if (value.trim().length < 10) {
                    return 'Mô tả phải có ít nhất 10 ký tự.';
                }
                break;
            default:
                return '';
        }
        return '';
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Kiểm tra lỗi
        const error = validateInput(name, value);
        setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));

        // Cập nhật dữ liệu form
        setFormData({ ...formData, [name]: value });
    };

    const uploadImagesToCloudinary = async (files: File[]): Promise<string | undefined> => {
        const cloudinaryUrl = CLOUDINARY_URL;
        const maxFileSize = 2048576; // 2MB

        // Chỉ xử lý file đầu tiên trong mảng (nếu có)
        if (files.length > 0) {
            const file = files[0];

            if (file.size > maxFileSize) {
                toast.error(`Tệp "${file.name}" quá lớn. Vui lòng chọn tệp dưới 2MB.`);
                return undefined;
            }

            const formData = new FormData();
            formData.append("file", file);
            formData.append(UPLOAD_PRESET, PRODUCTS);

            try {
                const response: AxiosResponse<CloudinaryResponse> = await axios.post(cloudinaryUrl, formData);
                return response.data.secure_url;
            } catch (error: unknown) {
                console.error(`Lỗi upload tệp "${file.name}":`, error);
                toast.error(`Lỗi tải tệp "${file.name}" lên Cloudinary.`);
                return undefined;
            }
        }

        return undefined; // Trường hợp không có file nào được chọn
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: { [key: string]: string } = {};
        Object.keys(formData).forEach((key) => {
            const error = validateInput(key, formData[key as keyof ProductForm]?.toString() || '');
            if (error) {
                newErrors[key] = error;
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error('Vui lòng kiểm tra lại thông tin.');
            return;
        }

        setLoading(true);
        try {
            let imageUrl = ""; // Giá trị mặc định khi không có ảnh

            if (selectedFiles.length > 0) {
                const uploadedImageUrl = await uploadImagesToCloudinary(selectedFiles);
                if (uploadedImageUrl) {
                    imageUrl = uploadedImageUrl;
                } else {
                    toast.error("Lỗi: Không thể tải ảnh lên. Sản phẩm sẽ được thêm nhưng không có ảnh.");
                }
            }

            const finalData = { ...formData, imageUrl: imageUrl };
            const response = await createProduct(finalData);
            setFormData({
                nameProduct: '',
                description: '',
                price: 0,
                categoryId: 1,
                imageUrl: '',
                quantity: 0,
            });
            setImagePreviews([]);
            setSelectedFiles([]);
            toast.success(`Thêm sản phẩm "${response.data.nameProduct}" thành công!`);

        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.data?.code === 1006) {
                toast.warning("Sản phẩm này đã tồn tại");
            }
            else {
                toast.error("Đã xảy ra lỗi không xác định.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const file = e.target.files[0]; // Lấy file đầu tiên
        if (file.size > 1048576) {
            toast.error("Ảnh quá lớn. Vui lòng chọn ảnh dưới 1MB.");
            return;
        }

        setSelectedFiles([file]); // Lưu một file duy nhất
        setImagePreviews([URL.createObjectURL(file)]); // Hiển thị một ảnh xem trước
    };

    const removeImage = (index: number) => {
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="sm:p-0 sm:mb-4 mb-20 sm:mt-0 mt-10 ">
            <div className="w-full sm:p-10 p-5 bg-white dark:bg-gray-800 dark:text-black rounded-lg shadow-md">
                <ToastContainer />
                <h2 className="sm:text-2xl text-lg font-semibold text-gray-800 dark:text-white mb-6 ">
                    Thêm Sản Phẩm Mới ✨
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-2 items-center w-full">
                        <div className="sm:w-[50%] w-full">
                            <label htmlFor="nameProduct" className="flex items-center gap-3 text-gray-700 dark:text-white text-sm font-bold mb-2">
                                Tên Sản Phẩm:
                                {errors.nameProduct && <p className="text-red-500 text-sm font-thin">{errors.nameProduct}</p>}
                            </label>
                            <input
                                type="text"
                                id="nameProduct"
                                name="nameProduct"
                                value={formData.nameProduct}
                                onChange={handleChange}
                                required
                                className="w-full p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                            />

                        </div>
                        <div className="sm:w-[50%] w-full">
                            <label htmlFor="categoryId" className="block text-gray-700 dark:text-white text-sm font-bold mb-2">
                                Danh Mục:
                            </label>

                            <select id="categoryId" name="categoryId"
                                className="w-full p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                                value={formData.categoryId}
                                onChange={handleChange}>
                                {category.map((item) => (
                                    <option key={item.categoryId} value={item.categoryId}>
                                        {item.categoryName}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>

                    <div className="flex flex-col md:flex-row gap-2 w-full">
                        <div className="sm:w-[50%] w-full">
                            <label htmlFor="price" className="flex items-center dark:text-white gap-3 text-gray-700 text-sm font-bold mb-2">
                                Giá:
                                {errors.price && <p className="text-red-500 text-sm font-thin">{errors.price}</p>}
                            </label>
                            <input
                                type="text"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                className="w-full p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                            />

                        </div>

                        <div className="sm:w-[50%] w-full">
                            <label htmlFor="quantity" className="flex items-center  gap-3 text-gray-700 dark:text-white text-sm font-bold mb-2">
                                Số Lượng:
                                {errors.quantity && <p className="text-red-500 text-sm font-thin">{errors.quantity}</p>}
                            </label>
                            <input
                                type="text"
                                id="quantity"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                required
                                className="w-full p-3 border  rounded focus:outline-none focus:ring focus:ring-blue-300"
                            />

                        </div>
                    </div>



                    <div>
                        <label htmlFor="description" className="flex items-center gap-3 text-gray-700 dark:text-white text-sm font-bold mb-2">
                            Mô Tả:
                            {errors.description && <p className="text-red-500 text-sm font-thin">{errors.description}</p>}
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full h-[200px] p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-center">
                            <label
                                htmlFor="file-upload"
                                className="relative flex flex-col items-center justify-center w-28 h-28 sm:w-6/12 sm:h-40 border-2 border-dashed rounded-2xl cursor-pointer bg-white/20 hover:bg-white/30 transition-all duration-300"
                            >
                                <CloudUpload className="text-gray-400" fontSize="large" />
                                <p className="text-xs text-gray-500 mt-1">Nhấn để tải ảnh</p>
                                <input
                                    id="file-upload"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                        </div>


                        {/* Preview hình ảnh */}
                        {imagePreviews.length > 0 && (
                            <div className="flex items-center justify-center">
                                {imagePreviews.map((src, index) => (
                                    <div key={index} className="relative">
                                        <img src={src} alt={`Preview ${index}`} className=" w-[200px] h-[120px] sm:w-[500px] sm:h-auto object-cover rounded-md" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute w-[30px] h-[30px] top-[5px] left-[80%] sm:top[5px] sm:left-[90%] bg-gray-200 text-gray-600 p-2 text-xs rounded-full hover:scale-150 text-center duration-75 hover:bg-red-300 flex items-center justify-center"
                                        >
                                            <DeleteForever />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="w-full flex justify-center">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`sm:w-[50%] w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {loading ? 'Đang thêm...' : 'Thêm Sản Phẩm'}
                        </button>
                    </div>

                </form>
            </div>
        </motion.div>

    );
};

export default ProductAdd;