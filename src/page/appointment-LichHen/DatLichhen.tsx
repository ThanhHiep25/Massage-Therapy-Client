import { useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { createAppointment } from "../../service/apiAppoinment";
import { Fragment } from "react";
import { getCustomers } from "../../service/apiCustomer";
import { getServiceSPA } from "../../service/apiService";
import { CheckIcon } from "lucide-react";
import { motion } from 'framer-motion'
import { CustomerDataFull } from "../../interface/CustomerData_interface";
import { ServiceFull } from "../../interface/ServiceSPA_interface";
import { AppointmentForm } from "../../interface/Appointment_interface";



const BookingPage = () => {
    const [customers, setCustomers] = useState<CustomerDataFull[]>([]);
    const [services, setServices] = useState<ServiceFull[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerDataFull | null>(null);
    const [selectedServices, setSelectedServices] = useState<number[]>([]);
    const [notes, setNotes] = useState("");
    const [searchCus, setSearchCus] = useState('');
    const [searchSrv, setSearchSrv] = useState('');
    const [appointmentDate, setAppointmentDate] = useState<string>(""); // yyyy-mm-dd
    const [timeSlot, setTimeSlot] = useState<string>(""); // e.g. "09:00", "14:30"

    const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([
        "08:00", "09:00", "10:00", "11:00",
        "13:00", "14:00", "15:00", "16:00", "17:00"
    ]);


    useEffect(() => {
        const fetchData = async () => {
            const cus = await getCustomers();
            const srv = await getServiceSPA();
            setCustomers(cus);
            setServices(srv);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const updateAvailableTimeSlots = () => {
            const allPossibleSlots = [
                "08:00", "09:00", "10:00", "11:00",
                "13:00", "14:00", "15:00", "16:00", "17:00"
            ];

            if (!appointmentDate) {
                setAvailableTimeSlots([]);
                if (timeSlot) setTimeSlot("");
                return;
            }

            const todayFullDate = new Date();
            todayFullDate.setHours(0, 0, 0, 0);

            const selectedFullDate = new Date(appointmentDate + "T00:00:00");

            if (isNaN(selectedFullDate.getTime())) {
                console.error("Lỗi: appointmentDate không hợp lệ:", appointmentDate);
                setAvailableTimeSlots([]);
                if (timeSlot) setTimeSlot("");
                return;
            }

            let newAvailableSlots: string[] = [];

            if (selectedFullDate.getTime() < todayFullDate.getTime()) {
                // Ngày đã chọn là ngày trong quá khứ
                newAvailableSlots = [];
            } else if (selectedFullDate.getTime() === todayFullDate.getTime()) {
                // Ngày đã chọn là ngày hôm nay
                const now = new Date();
                const currentHour = now.getHours();
                const currentMinute = now.getMinutes();

                newAvailableSlots = allPossibleSlots.filter(slot => {
                    const [slotHourStr, slotMinuteStr] = slot.split(":");
                    const slotHour = parseInt(slotHourStr, 10);
                    const slotMinute = parseInt(slotMinuteStr, 10);

                    // Thời gian đặt hẹn phải cách thời gian hiện tại ít nhất 1 tiếng
                    const minBookingHour = currentHour + 1;

                    if (slotHour < minBookingHour) {
                        return false;
                    }
                    // Nếu giờ slot bằng giờ tối thiểu, phút của slot phải lớn hơn phút hiện tại
                    if (slotHour === minBookingHour && slotMinute <= currentMinute) {
                        return false;
                    }
                    return true;
                });
            } else {
                // Ngày đã chọn là ngày trong tương lai
                newAvailableSlots = allPossibleSlots;
            }

            setAvailableTimeSlots(newAvailableSlots);

            // Reset lại timeSlot nếu nó không còn trong danh sách khả dụng mới
            // hoặc nếu danh sách khả dụng rỗng và timeSlot đang có giá trị.
            if (timeSlot && !newAvailableSlots.includes(timeSlot)) {
                setTimeSlot("");
            } else if (newAvailableSlots.length === 0 && timeSlot) {
                // Trường hợp newAvailableSlots rỗng (ví dụ chọn ngày quá khứ) và timeSlot vẫn còn giá trị cũ
                setTimeSlot("");
            }
        };

        updateAvailableTimeSlots();
    }, [appointmentDate, timeSlot]);


    const searchCustomer = customers.filter((cus) => {
        return (
            cus.name.toLowerCase().includes(searchCus.toLowerCase())
        );
    })

    const handleToggleService = (id: number) => {
        if (selectedServices.includes(id)) {
            setSelectedServices((prev) => prev.filter((s) => s !== id));
        } else {
            setSelectedServices((prev) => [...prev, id]);
        }
    };

    // search service
    const filteredServices = services.filter((ser) => {
        return (
            ser.name.toLowerCase().includes(searchSrv.toLowerCase())
        );
    })


    const handleSubmit = async () => {

        if (!appointmentDate || !timeSlot) {
            alert("Vui lòng chọn ngày và khung giờ.");
            return;
        }

        if (!selectedCustomer && selectedServices.length === 0) {
            alert("Vui lòng chọn ít nhất một dịch vụ.");
            return;
        }

        const appointmentDateTime = `${appointmentDate}T${timeSlot}:00`;

        const totalPrice = services
            .filter((s) => selectedServices.includes(s.id))
            .reduce((sum, s) => sum + s.price, 0);

        const payload: AppointmentForm = {
            appointmentDateTime,
            totalPrice,
            notes,
            serviceIds: selectedServices,
        };

        // Nếu có khách hàng -> thêm userId
        if (selectedCustomer) {
            payload.userId = selectedCustomer.id;
        }

        try {
            await createAppointment(payload);
            alert("Đặt lịch thành công!");
            // Reset form
            setSelectedCustomer(null);
            setSelectedServices([]);
            setAppointmentDate("");
            setTimeSlot("");
            setNotes("");
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert(error.message || "Đặt lịch thất bại.");
            } else {
                alert("Đặt lịch thất bại.");
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 sm:p-6 sm:mb-4 mb-20 sm:mt-0 mt-10">
            <h2 className="text-2xl font-semibold text-center">Đặt lịch hẹn</h2>

            {/* Dropdown chọn khách hàng */}
            <div>
                <label className="block mb-1 font-medium">Khách hàng: <i className="text-gray-500">(Nếu khách vãng lai thì để trống!)</i></label>
                <Listbox value={selectedCustomer} onChange={setSelectedCustomer}>
                    <div className="relative rounded-xl ">
                        <Listbox.Button className=" border rounded-xl p-4 text-left bg-white md:w-[50%] w-full dark:text-gray-800">
                            {selectedCustomer ? <div className="flex items-center gap-3">
                                <img src={selectedCustomer.imageUrl} alt="khong co" className="sm:h-20 sm:w-20 w-16 h-16 rounded-full object-cover outline outline-1 outline-gray-400" />
                                <div className="">
                                    <p className="text-gray-500 sm:text-[18px] text-[14px]">{selectedCustomer.name}</p>
                                    <p className="text-gray-500 sm:text-[18px] text-[14px]">{selectedCustomer.email}</p>
                                    {selectedCustomer.description === 'Đồng' && (
                                        <p className="text-gray-400 sm:text-[18px] text-[14px]">Thành viên:
                                            <span className='px-4 py-1 ml-2 sm:text-[18px] text-[14px] bg-orange-600 rounded-full text-white'>{selectedCustomer.description} 🥑</span>
                                        </p>
                                    )}
                                    {selectedCustomer.description === 'Bạc' && (
                                        <p className="text-gray-400">Hội viên:
                                            <span className='px-4 py-1 ml-2 sm:text-[18px] text-[14px] bg-slate-400 rounded-full text-white'>{selectedCustomer.description} 🥑</span>
                                        </p>
                                    )}
                                    {selectedCustomer.description === 'Vàng' && (
                                        <p className="text-gray-400">Hội viên:
                                            <span className='px-4 py-1 ml-2 sm:text-[18px] text-[14px] bg-yellow-400 rounded-full text-white'>{selectedCustomer.description} 🥑</span></p>
                                    )}
                                    {selectedCustomer.description === 'Kim Cương' && (
                                        <p className="text-gray-400">Hội viên:
                                            <span className='px-4 py-1 ml-2 sm:text-[18px] text-[14px] bg-emerald-400 rounded-full text-white'>{selectedCustomer.description} 🥑</span></p>
                                    )}
                                    {selectedCustomer.description === 'VIP' && (
                                        <p className="text-gray-400">Hội viên:
                                            <span className='px-4 py-1 ml-2 sm:text-[18px] text-[14px] bg-gradient-to-br from-purple-900 via-blue-900 to-black rounded-full text-white'>{selectedCustomer.description} 🥑</span></p>
                                    )}
                                    {selectedCustomer.description === 'VIP++' && (
                                        <p className="text-gray-400">Hội viên:
                                            <span className='px-4 py-1 ml-2 sm:text-[18px] text-[14px]
                                           bg-gradient-to-br from-yellow-500 via-blue-500 to-black rounded-full text-white'>{selectedCustomer.description} 🥑</span>
                                        </p>
                                    )}
                                </div>
                            </div> : "Chọn khách hàng"}

                        </Listbox.Button>
                        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                            <Listbox.Options className="absolute mt-1 max-h-60 overflow-auto md:w-[50%] bg-white border rounded shadow-lg z-10">
                                <div className="p-2">
                                    <input
                                        type="text"
                                        placeholder="Tìm nhân viên..."
                                        value={searchCus}
                                        onChange={(e) => setSearchCus(e.target.value)}
                                        className="w-full px-2 py-2 border rounded-md text-sm focus:outline-none focus:ring focus:ring-blue-300"
                                    />
                                </div>
                                {searchCustomer.map((cus) => (
                                    <Listbox.Option key={cus.id} value={cus} className={({ active }) =>
                                        `cursor-pointer select-none relative p-2 ${active ? "bg-blue-100" : ""}`
                                    }>
                                        {({ selected }) => (
                                            <>

                                                <div key={cus.id} className={`${selected ? "font-semibold" : ""} flex items-center gap-3 dark:text-black`}>
                                                    <img src={cus.imageUrl} alt={cus.imageUrl} className="w-20 h-20 rounded-full object-cover outline outline-1 outline-gray-400" />
                                                    <div className="">
                                                        {cus.name}
                                                        <p>{cus.email}</p>
                                                        {cus.description === 'Đồng' && (
                                                            <p className="text-gray-400">Thành viên:
                                                                <span className='px-4 py-1 ml-2 bg-orange-600 rounded-full text-white'>{cus.description} 🥑</span>
                                                            </p>
                                                        )}
                                                        {cus.description === 'Bạc' && (
                                                            <p className="text-gray-400">Hội viên:
                                                                <span className='px-4 py-1 ml-2 bg-slate-400 rounded-full text-white'>{cus.description} 🥑</span>
                                                            </p>
                                                        )}
                                                        {cus.description === 'Vàng' && (
                                                            <p className="text-gray-400">Hội viên:
                                                                <span className='px-4 py-1 ml-2 bg-yellow-400 rounded-full text-white'>{cus.description} 🥑</span></p>
                                                        )}
                                                        {cus.description === 'Kim Cương' && (
                                                            <p className="text-gray-400">Hội viên:
                                                                <span className='px-4 py-1 ml-2 bg-emerald-400 rounded-full text-white'>{cus.description} 🥑</span></p>
                                                        )}
                                                        {cus.description === 'VIP' && (
                                                            <p className="text-gray-400">Hội viên:
                                                                <span className='px-4 py-1 ml-2 bg-gradient-to-br from-purple-900 via-blue-900 to-black rounded-full text-white'>{cus.description} 🥑</span></p>
                                                        )}
                                                        {cus.description === 'VIP++' && (
                                                            <p className="text-gray-400">Hội viên:
                                                                <span className='px-4 py-1 ml-2 bg-gradient-to-br from-yellow-500 via-blue-500 to-black rounded-full text-white'>{cus.description} 🥑</span>
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                {selected && <CheckIcon className="w-4 h-4 text-blue-500 absolute right-2 top-2" />}
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </Listbox>
            </div>

            {/* Danh sách dịch vụ */}
            <div>
                <label className="block mb-1 font-medium">Dịch vụ</label>
                <div className="relative flex items-center  w-full md:justify-start justify-center p-2 dark:text-black">
                    <input
                        type="text"
                        className="md:w-[50%] w-full p-4 pr-12 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="Tìm kiếm theo tên dịch vụ"
                        value={searchSrv}
                        onChange={(e) => setSearchSrv(e.target.value)}
                    />

                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 overflow-y-auto p-2 h-[410px] scroll-smooth dark:text-black">
                    {filteredServices.map((service) => (
                        <div key={service.id} className={`p-3 sm:h-[230px] rounded-lg ${selectedServices.includes(service.id) ? 'outline outline-blue-400 bg-blue-200/10 shadow-md' : 'bg-white'}`}>
                            <div className="flex w-full items-center justify-end">
                                <input
                                    type="checkbox"
                                    checked={selectedServices.includes(service.id)}
                                    onChange={() => handleToggleService(service.id)}
                                    className="w-5 h-5"
                                />
                            </div>

                            <div className="flex lg:flex-row flex-col gap-3">
                                <img src={service.images[0]} alt="khong co anh" className={`sm:h-[150px] sm:w-[220px] h-[80px] w-[220px] object-cover rounded-xl mt-2`} />
                                <div className="sm:text-justify p-1 ">
                                    <p className="font-semibold sm:text-lg text-sm">{service.name} </p>
                                    <p className="sm:text-[14px] text-sm">Giá: {service.price.toLocaleString()}đ</p>
                                    <p className="sm:text-[14px] text-sm">Loại dịch vụ: {service.serviceType}</p>
                                    <p className="sm:text-[14px] text-sm">Thời gian thực hiện: {service.duration} phút</p>
                                    <p className="hidden sm:text-[14px] text-sm sm:line-clamp-2">Mô tả: {service.description}</p>
                                </div>
                            </div>

                        </div>

                    ))}


                </div>
            </div>

            <div>
                <label className="block mb-1 font-medium">Ngày hẹn</label>
                <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="border p-2 rounded-xl w-full md:w-1/2 dark:text-black"
                    min={new Date().toISOString().split("T")[0]} // Chặn chọn ngày quá khứ
                />
            </div>
            <div>
                <label className="block mb-1 font-medium">Khung giờ: <i className="text-gray-500">(Vui lòng chọn ngày hẹn trước)</i></label>
                <div className="grid grid-cols-3 gap-2 w-full md:w-2/3">
                    {availableTimeSlots.map((slot) => (
                        <button
                            key={slot}
                            onClick={() => setTimeSlot(slot)}
                            className={`py-2 px-4 border rounded-lg text-sm
                                ${timeSlot === slot ? "bg-blue-600 text-white" : "bg-white text-gray-800"}
                                ${!appointmentDate ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-100"}
                            `}
                            disabled={!appointmentDate}
                        >
                            {slot}
                        </button>
                    ))}

                    {
                        availableTimeSlots.length === 0 && (
                            <p className="text-red-400 ">（￣︶￣）↗ Khung giờ ngày hôm nay đã hết. Vui lòng chọn ngày hẹn khác.</p>
                        )
                    }
                </div>
            </div>




            {/* Ghi chú */}
            <div>
                <label className="block mb-1 font-medium">Ghi chú: <i className="text-gray-500">(Lưu ý bạn có thể thêm ghi chú với dịch vụ, dị ứng với các thành phần nào,...)</i></label>
                <textarea
                    className="w-full border rounded p-2 dark:text-black"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                />
            </div>
            <div className="font-semibold mt-2 text-right sm:text-[24px] text-[16px] text-blue-500">
                Tổng tiền: {services
                    .filter((s) => selectedServices.includes(s.id))
                    .reduce((sum, s) => sum + s.price, 0)
                    .toLocaleString()}đ
            </div>


            {/* Nút đặt lịch */}
            <button onClick={handleSubmit} className="w-full sm:text-lg text-sm bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                Đặt lịch
            </button>
        </motion.div>
    );
};

export default BookingPage;
