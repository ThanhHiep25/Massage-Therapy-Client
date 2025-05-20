import React, { useState, useCallback, useEffect, useRef } from "react";
import { FaUser, FaRobot, FaPaperPlane } from "react-icons/fa";
import { marked } from "marked";
import { motion } from 'framer-motion'
import { Spa } from "@mui/icons-material";
import { LoaderCircleIcon } from "lucide-react";
import { getServiceSPA } from "../../service/apiService";
import { ServiceFull } from "../../interface/ServiceSPA_interface";

const API_URL = import.meta.env.VITE_API_URL
const API_KEY = import.meta.env.VITE_API_KEY_CHAT
const MAX_LENGTH = 2000;

const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState<{ role: string; content: string; expanded?: boolean; jsxContent?: JSX.Element[] }[]>([
        { role: "system", content: "Bạn là một chuyên gia về spa massage trị liệu của công ty SPA Royal.Câu trả lời ngắn gọn nhưng đầy đủ thông tin cho người dùng." },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [spaServices, setSpaServices] = useState<ServiceFull[]>([]); // Chứa toàn bộ dịch vụ
    const [suggestions, setSuggestions] = useState<ServiceFull[]>([]); // State cho gợi ý
    const [showSuggestions, setShowSuggestions] = useState(false); // State để hiển thị/ẩn gợi ý


    // Auto scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
        }
    };

    const checkSpaRelated = (message: string) => {
        const keywords = ["spa", "massage", "trị liệu", "dược liệu", "giá",
            "thư giãn", "bấm huyệt", "dịch vụ", "dịch vụ massage", "hi", "chào",
            "các bước", "mô tả", "hello", "à há", "chà", "được", "dc", "có", "ok", "vâng", "không", "phân vân", "kiểu", "nước",
            "dạ", "đau", "mỏi", "nhức", "giúp", "làm sao", "lưng", "đầu", "gối", "quy trình", "thời gian", "tg", "yeah", "yeb", "xl", "trúng", "tuyển", "điểm"];
        return keywords.some((keyword) => message.toLowerCase().includes(keyword));
    };

    const fetchSpaServices = useCallback(async () => {
        try {
            const services: ServiceFull[] = await getServiceSPA();

            if (Array.isArray(services)) {
                setSpaServices(services); // Lưu toàn bộ dịch vụ
            } else {
                throw new Error("Dữ liệu trả về không đúng định dạng");
            }
        } catch (error) {
            console.error("Lỗi khi lấy dịch vụ:", error);
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "❌ Không thể lấy danh sách dịch vụ. Vui lòng thử lại sau!"
            }]);
        }
    }, []);

    useEffect(() => {

        fetchSpaServices();
    }, [fetchSpaServices]);

    const sendMessage = useCallback(async () => {
        if (!input.trim()) return;

        const userMessage = { role: "user", content: input };
        const updatedMessages = [...messages, userMessage];

        setMessages(updatedMessages);
        setInput("");
        setLoading(true);

        // Yêu cầu trả tất cả dịch vụ
        if (["danh sách dịch vụ", "tất cả dịch vụ"].some(keyword => input.toLowerCase().includes(keyword))) {
            const serviceDetailsElements = spaServices.map((service, index) => (
                <div
                    key={index}
                    className="bg-white/80 dark:bg-gray-900 p-4 rounded-lg mb-4 shadow-sm border border-gray-300 dark:border-gray-700 outline outline-1 outline-gray-400"
                >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <img
                            src={service.images[0]}
                            alt="spa-massage"
                            className="w-full sm:w-[140px] h-[90px] object-cover rounded-md flex-shrink-0"
                        />
                        <div className="text-justify w-full">
                            <h3 className="text-lg font-bold text-purple-700 dark:text-purple-300">
                                {service.name}
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                <strong>Thời gian:</strong> {service.duration} phút
                            </p>
                            <p className="text-gray-700 dark:text-gray-300">
                                <strong>Giá:</strong> {service.price.toLocaleString()}đ
                            </p>
                            <p className="text-gray-700 dark:text-gray-300">
                                <strong>Loại dịch vụ:</strong> {service.serviceType}
                            </p>
                            <p className="text-gray-700 dark:text-gray-300">
                                <strong>Mô tả:</strong> {service.description || "Không có mô tả"}
                            </p>
                        </div>
                    </div>
                </div>

            ));
            setTimeout(() => {
                setMessages(prev => [...prev, { role: "assistant", content: "", jsxContent: serviceDetailsElements }]);
            }, 2000);
            setLoading(false);
            return;
        }

        // Tìm kiếm dịch vụ theo từ khóa
        const searchTerm = input.toLowerCase();
        const matchingServices = spaServices.filter(service =>
            service.name.toLowerCase().includes(searchTerm) ||
            service.description.toLowerCase().includes(searchTerm)
        );

        if (matchingServices.length > 0) {
            const serviceDetailsElements = matchingServices.map((service, index) => (
                <div
                    key={index}
                    className="bg-white/80 dark:bg-gray-900 p-4 rounded-lg mb-4 shadow-sm border border-gray-300 dark:border-gray-700 outline outline-1 outline-gray-400"
                >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <img
                            src={service.images[0]}
                            alt="spa-massage"
                            className="w-full sm:w-[140px] h-[90px] object-cover rounded-md flex-shrink-0"
                        />
                        <div className="text-justify w-full">
                            <h3 className="text-lg font-bold text-purple-700 dark:text-purple-300">
                                {service.name}
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                <strong>Thời gian:</strong> {service.duration} phút
                            </p>
                            <p className="text-gray-700 dark:text-gray-300">
                                <strong>Giá:</strong> {service.price.toLocaleString()}đ
                            </p>
                            <p className="text-gray-700 dark:text-gray-300">
                                <strong>Loại dịch vụ:</strong> {service.serviceType}
                            </p>
                            <p className="text-gray-700 dark:text-gray-300">
                                <strong>Mô tả:</strong> {service.description || "Không có mô tả"}
                            </p>
                        </div>
                    </div>
                </div>

            ));
            setTimeout(() => {
                setMessages(prev => [...prev, { role: "assistant", content: "", jsxContent: serviceDetailsElements }]);
            }, 2000);
            setLoading(false);
            return;
        }

        if (!checkSpaRelated(input)) {
            setMessages((prev) => [...prev, {
                role: "assistant",
                content: "⚠ Xin lỗi, tôi chỉ hỗ trợ các câu hỏi liên quan đến **spa massage trị liệu**."
            }]);
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "google/gemma-3-4b-it:free",// openchat/openchat-7b:free
                    messages: updatedMessages,
                    stream: true,
                }),
            });

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            const botReply = { role: "assistant", content: "", expanded: false };

            setMessages((prev) => [...prev, botReply]);

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    const chunk = decoder.decode(value, { stream: true }).trim();
                    chunk.split("\n").forEach((line) => {
                        if (line.startsWith("data: ")) {
                            const jsonDataStr = line.substring(6).trim();
                            if (jsonDataStr === "[DONE]") return;

                            try {
                                const jsonData = JSON.parse(jsonDataStr);
                                const text = jsonData?.choices?.[0]?.delta?.content || "";
                                if (text) {
                                    botReply.content += text;
                                    setMessages((prev) => {
                                        const newMessages = [...prev];
                                        newMessages[newMessages.length - 1] = { ...botReply };
                                        return newMessages;
                                    });
                                }
                            } catch (error) {
                                console.error("Lỗi khi parse JSON:", error);
                            }
                        }
                    });
                }
            }
        } catch (error) {
            console.error("Lỗi khi gửi tin nhắn:", error);
        }
        setLoading(false);
    }, [input, messages, spaServices]);


    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setInput(value);
        adjustTextareaHeight();

        if (value.trim() !== "") {
            const filteredSuggestions = spaServices.filter(service =>
                service.name.toLowerCase().includes(value.toLowerCase())
            );
            // Thêm "Tất cả dịch vụ" vào đầu nếu có input
            setSuggestions([{ id: -1, name: "Tất cả dịch vụ", description: "", price: 0, duration: 0, serviceType: "", images: [], categoryId: 0, steps: [], status: "active", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...filteredSuggestions]);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion: ServiceFull) => {
        setInput(suggestion.name);
        setSuggestions([]);
        setShowSuggestions(false);
        textareaRef.current?.focus(); // Focus lại vào textarea sau khi chọn gợi ý
    };


    return (
        <div className="relative w-full min-h-screen px-4 sm:px-8 lg:px-16 flex flex-col sm:flex-row items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-black">

            <motion.div className="w-full sm:w-[90vw] mx-auto p-6 bg-white/20 rounded-xl shadow-lg border border-gray-200 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 dark:bg-gray-800 dark:border-gray-500">
                <h2 className="text-xl font-semibold text-center mb-4 flex justify-center items-center gap-2">
                    <Spa fontSize="large" className="animate-bounce" />
                    Chatbot Spa Massage Trị liệu
                </h2>

                <div className="overflow-y-auto p-4 rounded-lg space-y-3 dark:bg-gray-800" style={{ maxHeight: "70vh", minHeight: "200px" }}>
                    {messages.slice(1).map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            {msg.role === "assistant" && <FaRobot className="text-blue-500 mt-2 mr-2" />}
                            <div className={`px-4 py-2 rounded-xl text-black dark:text-white ${msg.role === "user" ? "bg-blue-500" : "bg-white/20 dark:bg-black"}`}
                                style={{ maxWidth: "85%", whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                            >
                                {msg.jsxContent ? (
                                    msg.jsxContent
                                ) : msg.role === "assistant" && msg.content.length > MAX_LENGTH && !msg.expanded ? (
                                    <>
                                        <div dangerouslySetInnerHTML={{ __html: marked.parse(msg.content.slice(0, MAX_LENGTH) + "...") }} />
                                        <button
                                            onClick={() => {
                                                const updated = [...messages];
                                                updated[idx + 1].expanded = true;
                                                setMessages(updated);
                                            }}
                                            className="text-blue-300 underline text-sm mt-1"
                                        >
                                            Xem thêm
                                        </button>
                                    </>
                                ) : (
                                    <div dangerouslySetInnerHTML={{ __html: marked.parse(msg.content) }} />
                                )}
                            </div>
                            {msg.role === "user" && <FaUser className="text-gray-600 mt-2 ml-2" />}
                        </div>

                    ))}
                    <div ref={messagesEndRef} />
                </div>


                {/* Nhập tin nhắn */}
                <div className=" relative flex items-center gap-2 mt-4">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage();
                            }
                        }}
                        placeholder="Nhập câu hỏi..."
                        className="flex-1 border p-3 rounded-lg resize-none overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                        disabled={loading}
                        rows={1}
                    />
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute bottom-full left-0 bg-white/80 border border-gray-300 rounded-md shadow-md mt-1 w-[50%] mb-3 dark:bg-gray-800 dark:border-gray-700">
                            {suggestions.map((suggestion) => (
                                <div
                                    key={suggestion.id}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                >
                                    {suggestion.name}
                                </div>
                            ))}
                        </div>
                    )}
                    <button
                        onClick={sendMessage}
                        disabled={loading}
                        className="bg-blue-600 text-white p-3 rounded-lg flex items-center disabled:bg-gray-400 transition-all"
                    >
                        {loading ? <LoaderCircleIcon className="animate-spin" /> : <FaPaperPlane />}
                    </button>

                </div>
            </motion.div>
        </div>
    );
};

export default Chatbot;