import { useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { CheckIcon, ShoppingBag, Trash2 } from "lucide-react";
import { getCustomers } from "../../service/apiCustomer";
import { createOrder } from "../../service/apiOrder";
import { CustomerDataFull } from "../../interface/CustomerData_interface";
import { OrderItemResponse, Order } from "../../interface/Order_interface";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import { updatesaleProduct } from "../../service/apiProduct";

const OrderAdd = () => {
    const [customers, setCustomers] = useState<CustomerDataFull[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerDataFull | null>(null);
    const [searchCus, setSearchCus] = useState('');
    const [orderItems, setOrderItems] = useState<OrderItemResponse[]>([]); // Danh sách sản phẩm trong giỏ hàng
    const [address, setAddress] = useState<string>(""); // Địa chỉ giao hàng
    const [phone, setPhone] = useState<string>(""); // Số điện thoại
    const [notes, setNotes] = useState<string>(""); // Ghi chú

    useEffect(() => {
        const fetchData = async () => {
            const cus = await getCustomers();
            setCustomers(cus);
        };
        fetchData();

        // Lấy danh sách orderItems từ localStorage
        const storedOrderItems = JSON.parse(localStorage.getItem('orderItems') || '[]');
        setOrderItems(storedOrderItems);
    }, []);

    useEffect(() => {
        // Khi chọn khách hàng, tự động điền địa chỉ và số điện thoại
        if (selectedCustomer) {
            setAddress(selectedCustomer.address || ""); // Lấy địa chỉ từ khách hàng
            setPhone(selectedCustomer.phone || ""); // Lấy số điện thoại từ khách hàng
        } else {
            setAddress(""); // Reset nếu không có khách hàng
            setPhone(""); // Reset nếu không có khách hàng
        }
    }, [selectedCustomer]);

    const searchCustomer = customers.filter((cus) =>
        cus.name.toLowerCase().includes(searchCus.toLowerCase())
    );

    const handleIncreaseQuantity = (index: number) => {
        const updatedItems = [...orderItems];
        updatedItems[index].quantity += 1;
        setOrderItems(updatedItems);
        localStorage.setItem('orderItems', JSON.stringify(updatedItems));
    };

    const handleDecreaseQuantity = (index: number) => {
        const updatedItems = [...orderItems];
        if (updatedItems[index].quantity > 1) {
            updatedItems[index].quantity -= 1;
            setOrderItems(updatedItems);
            localStorage.setItem('orderItems', JSON.stringify(updatedItems));
        }
    };

    const handleRemoveItem = (index: number, name: string) => {
        if (!window.confirm(`Bạn muốn xóa ${name} khöng?`)) return;
        const updatedItems = orderItems.filter((_, i) => i !== index);
        setOrderItems(updatedItems);
        localStorage.setItem('orderItems', JSON.stringify(updatedItems));
        toast.success(`Xóa ${name} thành công.`);
    };

    const handleSubmitOrder = async () => {
        // Chuẩn bị dữ liệu đơn hàng
        const orderData: Order = {
            userId: selectedCustomer ? selectedCustomer.id : undefined, // Chỉ thêm userId nếu có khách hàng được chọn
            guestName: selectedCustomer ? "" : "Khách hàng vãng lai", // Nếu không có khách hàng, đặt tên là ẩn danh
            shippingAddress: address || "Mua tại cửa hàng",
            shippingPhone: phone || "",
            notes: notes || "Không có",
            orderItems: orderItems.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
            })),
        };
    
        try {
            // Gọi API tạo đơn hàng
            await createOrder(orderData);
    
            // Gọi API cập nhật số lượng sản phẩm cho từng sản phẩm trong giỏ hàng
            for (const item of orderItems) {
                await updatesaleProduct(item.id, item.quantity); // Gọi API cập nhật số lượng
            }
    
            toast.success("Đặt hàng thành công và số lượng sản phẩm đã được cập nhật.");
            
            // Reset form
            setSelectedCustomer(null);
            setAddress("");
            setPhone("");
            setNotes("");
            setOrderItems([]);
            localStorage.removeItem("orderItems");
        } catch (error) {
            console.error("Lỗi khi đặt hàng:", error);
            toast.error("Lỗi khi đặt hàng hoặc cập nhật số lượng sản phẩm.");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-5 sm:p-6 p-3 bg-white rounded-md sm:mb-6 mb-20 sm:mt-0 mt-10 dark:bg-gray-800">
            <ToastContainer />
            <h2 className="text-2xl font-semibold">Giỏ hàng ✨</h2>

            {/* Dropdown chọn khách hàng */}
            <div>
                <label className="block mb-1 font-medium">Khách hàng: <i className="text-gray-400">(Khách vãng lai thì để trống)</i></label>
                <Listbox value={selectedCustomer} onChange={setSelectedCustomer}>
                    <div className="relative">
                        <Listbox.Button className="border rounded-lg p-4 text-left  w-full">
                            {selectedCustomer ? (
                                <div className="flex items-center gap-3">
                                    <img
                                        src={selectedCustomer?.imageUrl || ""}
                                        alt="Avatar"
                                        className="h-12 w-12 rounded-full object-cover outline outline-2 outline-gray-400"
                                    />
                                    <div>
                                        <p className="text-gray-700 dark:text-white font-medium">{selectedCustomer.name}</p>
                                        <p className="text-gray-500 dark:text-white text-sm">{selectedCustomer.email}</p>
                                    </div>
                                </div>
                            ) : (
                                "Chọn khách hàng"
                            )}
                        </Listbox.Button>
                        <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options className="absolute mt-1 max-h-60 overflow-auto w-full dark:text-black bg-white border rounded shadow-lg z-10">
                                <div className="p-2">
                                    <input
                                        type="text"
                                        placeholder="Tìm khách hàng..."
                                        value={searchCus}
                                        onChange={(e) => setSearchCus(e.target.value)}
                                        className="w-full px-2 py-2 border rounded-md text-sm focus:outline-none focus:ring focus:ring-blue-300"
                                    />
                                </div>
                                {searchCustomer.map((cus) => (
                                    <Listbox.Option
                                        key={cus.id}
                                        value={cus}
                                        className={({ active }) =>
                                            `cursor-pointer select-none relative p-2 ${active ? "bg-blue-100" : ""
                                            }`
                                        }
                                    >
                                        {({ selected }) => (
                                            <>
                                                <div
                                                    className={`${selected ? "font-semibold" : ""
                                                        } flex items-center gap-3`}
                                                >
                                                    <img
                                                        src={cus.imageUrl}
                                                        alt="Avatar"
                                                        className="w-12 h-12 rounded-full object-cover"
                                                    />
                                                    <div>
                                                        <p>{cus.name}</p>
                                                        <p className="text-sm text-gray-500">{cus.email}</p>
                                                    </div>
                                                </div>
                                                {selected && (
                                                    <CheckIcon className="w-4 h-4 text-blue-500 absolute right-2 top-2" />
                                                )}
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </Listbox>
            </div>

            {/* Danh sách sản phẩm trong giỏ hàng */}
            <div>
                <h3 className="text-lg font-semibold mb-2">Danh sách sản phẩm trong giỏ hàng:</h3>
                {orderItems.length > 0 ? (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 overflow-auto h-[350px]">
                        {orderItems.map((item, index) => (
                            <li
                                key={index}
                                className="flex items-center justify-between border p-4 rounded-lg shadow-md"
                            >
                                <div className="flex items-center gap-4 sm:text-sm text-[12px]">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.nameProduct}
                                        className="w-16 h-16 object-cover rounded-md"
                                    />
                                    <div>
                                        <p className="font-medium">{item.nameProduct}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <p>Số lượng:</p>
                                            <button
                                                onClick={() => handleDecreaseQuantity(index)}
                                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded"
                                            >
                                                -
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button
                                                onClick={() => handleIncreaseQuantity(index)}
                                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end sm:text-sm text-[12px]">
                                    <p className="text-blue-500 font-semibold">
                                        {(item.price * item.quantity).toLocaleString()} VNĐ
                                    </p>
                                    <button
                                        onClick={() => handleRemoveItem(index, item.nameProduct)}
                                        className="text-red-500 text-sm mt-2 hover:underline flex items-center gap-1"
                                    >
                                        <Trash2 size={16} /> Xóa
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-red-500 bg-gray-300/80 rounded-xl flex items-center gap-2 p-4 justify-center">
                        <ShoppingBag /> Không có sản phẩm trong giỏ hàng
                    </p>
                )}
            </div>

            <div className="flex sm:flex-row flex-col items-center gap-2 ">
                {/* Address */}
                <div className="mb-4 sm:w-[50%] w-full">
                    <label className="block text-sm font-bold mb-2">Địa chỉ giao hàng:</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full border rounded-lg p-4 dark:bg-gray-800 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        placeholder="Nhập địa chỉ giao hàng..."
                    />
                </div>

                {/* Phone */}
                <div className="mb-4 sm:w-[50%] w-full">
                    <label className="block text-sm font-bold mb-2">Số điện thoại:</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border rounded-lg p-4 dark:bg-gray-800 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        placeholder="Nhập số điện thoại..."
                    />
                </div>
            </div>


            {/* Ghi chú */}
            <div className="mb-6">
                <label className="block mb-1 font-medium">Ghi chú:</label>
                <textarea
                    className="w-full border rounded p-2 focus:ring-blue-400 dark:bg-gray-800 focus:outline-none"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                />
            </div>

            {/* Tổng tiền thanh toán */}
            <div className="flex justify-between items-center border-t pt-4">
                <span className="sm:text-lg text-sm font-semibold">Tổng tiền thanh toán:</span>
                <span className="sm:text-xl text-sm font-bold text-blue-500">
                    {orderItems
                        .reduce((total, item) => total + item.price * item.quantity, 0)
                        .toLocaleString()}{" "}
                    VNĐ
                </span>
            </div>

            {/* Nút đặt hàng */}
            <div className="w-full flex items-center justify-center">
                <button
                    onClick={handleSubmitOrder}
                    className="sm:w-[50%] w-full flex items-center justify-center gap-3 bg-blue-400 text-white p-2 rounded hover:bg-blue-700"
                >
                    <ShoppingBag /> Mua hàng
                </button>
            </div>
        </motion.div>
    );
};

export default OrderAdd;