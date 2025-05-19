import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { getCategories, addServiceSPA, addCategory } from "../../service/apiService"; 
import { CloudUpload, Delete, LoaderCircleIcon } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios, { AxiosResponse } from "axios";
import { motion } from 'framer-motion'
import { Category, CategoryForm, CloudinaryResponse, ServiceSPAForm } from "../../interface/ServiceSPA_interface";
import { DeleteForever } from "@mui/icons-material";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const SERVICESPA = import.meta.env.VITE_CLOUDINARY_UPLOAD_SERVICESPA;
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`


const AddService: React.FC = () => {
  const { register, handleSubmit, control, reset } = useForm<ServiceSPAForm>({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      duration: 0,
      categoryId: 0,
      imageUrls: [],
      serviceType: "",
      steps: [{ stepOrder: 1, description: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "steps",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]); // Chứa URL của ảnh đã chọn
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response);
    } catch (error) {
      console.error("Lỗi tải danh mục:", error);
    }
  };

  const uploadImagesToCloudinary = async (files: File[]): Promise<string[]> => {
    const cloudinaryUrl = CLOUDINARY_URL;
    const uploadedUrls: string[] = [];
    const maxFileSize = 2048576; // 2MB

    for (const file of files) {
      if (file.size > maxFileSize) {
        toast.error(`Tệp "${file.name}" quá lớn. Vui lòng chọn tệp dưới 2MB.`);
        continue; // Skip this file
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append(UPLOAD_PRESET, SERVICESPA);

      try {
        const response: AxiosResponse<CloudinaryResponse> = await axios.post(cloudinaryUrl, formData);
        uploadedUrls.push(response.data.secure_url); // Only add to list if successful
      } catch (error: unknown) {
        console.error(`Lỗi upload tệp "${file.name}":`, error);
        toast.error(`Lỗi tải tệp "${file.name}" lên Cloudinary.`);
      }
    }

    return uploadedUrls;
  };

  const onSubmit = async (data: ServiceSPAForm) => {
    setIsLoading(true);

    try {
      // Upload ảnh lên Cloudinary trước
      const uploadedUrls = await uploadImagesToCloudinary(selectedFiles);

      // Cập nhật danh sách ảnh trước khi gửi
      const finalData = { ...data, imageUrls: uploadedUrls };

      // Gửi dữ liệu JSON lên backend
      await addServiceSPA(finalData); // axios response

      toast.success("Dịch vụ đã được thêm thành công!");
      reset();
      setImagePreviews([]);
      setSelectedFiles([]);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.code === 1006) {
        toast.error("Dịch vụ đã tồn tại!");
      }
      else {
        toast.error("Có lỗi xảy ra khi gửi yêu cầu.");
        console.error("Lỗi không xác định:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  //Xử lý upload ảnh riêng
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      if (file.size > 1048576) {
        toast.error("Ảnh quá lớn. Vui lòng chọn ảnh dưới 1MB.");
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setSelectedFiles(validFiles); // Lưu file để upload sau
    setImagePreviews(validFiles.map((file) => URL.createObjectURL(file))); // Hiển thị ảnh xem trước
  };

  const removeImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };


  //Create Category
  const handleCreateCategory = async () => {
    console.log("handleCreateCategory called");
    console.log("categoryName before addCategory:", categoryName);
    try {
      const newCategory: CategoryForm = { categoryName };
      await addCategory(newCategory);
      toast.success("Danh mục đã được thêm thành công!");
      setCategoryName("");
      fetchCategories();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.code === 1006) {
        toast.error("Danh mục đã tồn tại!");
      }
      else {
        toast.error("Có lỗi xảy ra khi gửi yêu cầu.");
        console.error("Lỗi không xác định:", error);
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      className="w-full p-10 bg-white rounded-lg shadow-md sm:mt-0 mt-10 sm:mb-4 mb-20 dark:bg-gray-800 dark:text-black">
      <ToastContainer />
      <div className="mt-2 mb-6">
        <label className="block text-gray-700 dark:text-white text-sm font-bold">Thêm danh mục mới
          <i className="ml-1 text-gray-400 font-normal" >(Không ảnh hưởng đến việc thêm dịch vụ mới.)</i></label>
        <input
          type="text"
          className="sm:w-[30%] w-full p-3 border rounded"
          name="categoryName"
          value={categoryName}
          onChange={(e) => {
            setCategoryName(e.target.value);
          }}
        />
        <button
          type="button"
          className="inline-flex items-center mt-2 px-4 py-2 sm:ml-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300"
          onClick={() => {
            handleCreateCategory();
          }}
        >
          Thêm
        </button>

      </div>
      <p className="sm:text-2xl text-lg font-bold mb-4 text-gray-800 dark:text-white">Thêm Dịch Vụ Massage Mới ✨</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-10">
        <div className="sm:grid sm:grid-cols-2 sm:gap-4 flex flex-col gap-y-2">
          <div>
            <label className="block text-gray-700 dark:text-white sm:text-sm text-[14px] font-bold">Tên dịch vụ</label>
            <input className="w-full p-3 border rounded sm:text-sm text-[14px]" placeholder="Tên dịch vụ" {...register("name")} required />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-white sm:text-sm text-[14px] font-bold">Loại dịch vụ</label>
            <input className="w-full p-3 border rounded sm:text-sm text-[14px]" placeholder="Loại dịch vụ" {...register("serviceType")} required />
          </div>
        </div>

        <div className="sm:grid sm:grid-sm:cols-2 sm:gap-4 flex flex-col gap-y-2">
          <div>
            <label className="block text-gray-700 dark:text-white sm:text-sm text-[14px] font-bold">Giá dịch vụ (VND)</label>
            <input className="w-full p-3 border rounded sm:text-sm text-[14px]" type="text" placeholder="Giá (VND)" {...register("price")} required />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-white dark:text-white sm:text-sm text-[14px] font-bold">
              Thời gian thực hiện (phút)
            </label>
            <select
              className="w-full p-3 border rounded dark:text-white overflow-auto sm:text-sm text-[14px]"
              {...register("duration")}
              required
            >
              <option value="">Chọn thời gian</option>
              {Array.from({ length: (120 - 30) / 5 + 1 }, (_, index) => {
                const value = 30 + index * 5;
                return (
                  <option key={value} value={value}>
                    {value} phút
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 dark:text-white sm:text-sm text-[14px] font-bold">Mô tả</label>
          <textarea className="w-full p-3 border rounded sm:text-sm text-[14px]" placeholder="Mô tả" {...register("description")} required />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-white sm:text-sm text-[14px] font-bold">Danh mục</label>
          <select className="w-full p-3 border rounded sm:text-sm text-[14px]" {...register("categoryId")}>
            {categories.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.categoryName}
              </option>
            ))}
          </select>
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
            <div className="grid grid-cols-4 gap-y-2 gap-x-2">
              {imagePreviews.map((src, index) => (
                <div key={index} className="relative w-full">
                  <img src={src} alt={`Preview ${index}`} className=" w-[200px] h-[120px] sm:w-[500px] sm:h-[200px] object-cover rounded-md" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute w-[30px] h-[30px] top-[5px] left-[20%] sm:top[5px] sm:left-[90%] bg-gray-200 text-gray-600 p-2 text-xs rounded-full hover:scale-150 text-center duration-75 hover:bg-red-300 flex items-center justify-center"
                  >
                    <DeleteForever />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <label className="block font-bold dark:text-white">Các bước thực hiện</label>
          {fields.map((step, index) => (
            <div key={step.id} className="flex items-center space-x-2 mb-2">
              <div className="w-full">
                <label className="block text-gray-700 dark:text-white sm:text-sm text-[14px] font-bold m-2">Bước {index + 1}</label>
                <textarea
                  className="w-full h-[80px] p-2 border rounded sm:text-sm text-[14px]"
                  placeholder={`Nhập bước thực hiện ${index + 1}`}
                  {...register(`steps.${index}.description`)}
                  required
                />
              </div>

              <button
                type="button"
                className="text-red-400 px-3 py-1 rounded rounded-l-full cursor-pointer"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
              >
                <Delete />
              </button>
            </div>
          ))}
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded sm:text-sm text-[14px]"
            onClick={() => append({ stepOrder: fields.length + 1, description: "" })}
          >
            + Thêm Bước
          </button>
        </div>
        <div className="w-full flex items-center justify-center">
          <button
            type="submit"
            className={`sm:w-[40%] w-full sm:text-sm text-[14px] ${isLoading ? "bg-gray-400 flex items-center justify-center" : "bg-blue-500 hover:bg-blue-600"
              } text-white p-3 rounded-md transition duration-200`}
            disabled={isLoading}
          >
            {isLoading ? <LoaderCircleIcon className="animate-spin" /> : "Thêm Dịch Vụ"}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddService;
