import { useState, useCallback, useEffect, useRef } from "react";
import { FaUser, FaRobot, FaPaperPlane } from "react-icons/fa";
import { marked } from "marked";
import { motion } from 'framer-motion'
import { Spa } from "@mui/icons-material";
import { LoaderCircleIcon } from "lucide-react";

const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const API_KEY = "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";


const MAX_LENGTH = 2000;

const Chatbot = () => {
    const [messages, setMessages] = useState<{ role: string; content: string; expanded?: boolean }[]>([
        { role: "system", content: "Bạn là một chuyên gia về spa massage trị liệu." },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Hàm tự động cuộn xuống khi tin nhắn mới được thêm
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Hàm tự động điều chỉnh chiều cao của textarea
    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"; // Reset height để tránh giãn quá mức
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`; // Giới hạn max-height = 150px
        }
    };

    // Hàm xử lý tin nhắn đầu vào từ người dùng tránh tình trạng chatbot trả lời không liên quan đến mục đích
    const checkSpaRelated = (message: string) => {
        const keywords = ["spa", "massage", "trị liệu", "dược liệu",
            "thư giãn", "bấm huyệt", "dịch vụ", "dịch vụ massage", "hi", "chào",
            "các bước", "mô tả", "hello", "à há", "chà", "được", "dc","có", "ok", "vâng","không", "phân vân","kiểu", "nước",
            "dạ", "đau", "mỏi", "nhức", "giúp", "làm sao", "lưng", "đầu", "gối", "quy trình", "thời gian", "tg", "yeah", "yeb", ":))", "xl"];
        return keywords.some((keyword) => message.toLowerCase().includes(keyword));
    };


    // Hàm gửi tin nhắn
    const sendMessage = useCallback(async () => {
        if (!input.trim()) return;

        if (!checkSpaRelated(input)) {
            setMessages((prev) => [...prev, { role: "assistant", content: "Xin lỗi, tôi chỉ hỗ trợ tiếng việt và các câu hỏi liên quan đến spa massage trị liệu. ✨" }]);
            setInput("");
            return;
        }

        const userMessage = { role: "user", content: input };
        const updatedMessages = [...messages, userMessage];

        setMessages(updatedMessages);
        setInput("");
        setLoading(true);

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "google/gemma-3-4b-it:free",
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

                            // Kiểm tra nếu là "[DONE]" thì bỏ qua
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
                                console.error("Lỗi khi parse JSON:", error, "Dữ liệu nhận được:", jsonDataStr);
                            }
                        }
                    });

                }
            }
        } catch (error) {
            console.error("Lỗi khi gửi tin nhắn:", error);
        }

        setLoading(false);
    }, [input, messages]);


    return (
        <div className="relative w-full min-h-screen px-4 sm:px-8 lg:px-16 flex flex-col sm:flex-row items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-black">
            <div className="flex flex-col items-center justify-center mr-10">
                {/* Hiệu ứng ánh sáng */}
                <div className="absolute w-[400px] h-[400px] bg-purple-400 opacity-30 blur-3xl rounded-full top-20 left-10"></div>
                <div className="absolute w-[500px] h-[500px] bg-blue-400 opacity-20 blur-3xl rounded-full bottom-20 right-20"></div>
            </div>


            <motion.div
                className="w-full sm:w-[90vw] mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-200 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 dark:bg-gray-800 dark:border-gray-500">
                <h2 className="text-xl font-semibold text-center mb-4"><Spa fontSize="large" className="animate-bounce"/> Chatbot Spa Massage Trị liệu</h2>
                {/* Hiển thị tin nhắn */}
                <div className="overflow-y-auto bg-gray-100 p-4 rounded-lg space-y-3  dark:bg-gray-800" style={{ maxHeight: "70vh", minHeight: "200px" }}>
                    {messages.slice(1).map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            {msg.role === "assistant" && <FaRobot className="text-blue-500 mt-2 mr-2" />}
                            <div
                                className={`px-4 py-2 rounded-xl max-w-[75%] text-justify text-black dark:text-white ${msg.role === "user" ? "bg-blue-500" : "bg-white dark:bg-black"
                                    }`} style={{
                                        maxWidth: "85%",
                                        whiteSpace: "pre-wrap",
                                        wordBreak: "break-word",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        transition: "max-width 0.3s ease-in-out",
                                        lineHeight: 1.5,
                                        fontFamily: "revert"
                                    }}
                            >
                                {msg.role === "assistant" && msg.content.length > MAX_LENGTH && !msg.expanded ? (
                                    <>
                                        <div dangerouslySetInnerHTML={{ __html: marked.parse(msg.content.slice(0, MAX_LENGTH) + "...") }} />
                                        <button
                                            onClick={() =>
                                                setMessages((prev) => {
                                                    const newMessages = [...prev];
                                                    newMessages[idx + 1].expanded = true;
                                                    return newMessages;
                                                })
                                            }
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
                    {/* Thẻ rỗng để cuộn xuống */}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input & Gửi tin nhắn */}
                <div className="flex items-center gap-2 mt-4">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            adjustTextareaHeight(); // Điều chỉnh chiều cao theo nội dung
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage();
                            }
                        }}
                        placeholder="Nhập câu hỏi..."
                        className="flex-1 border p-3 rounded-lg resize-none overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500  dark:bg-gray-800"
                        disabled={loading}
                        rows={1} // Bắt đầu với 1 dòng
                    />
                    <button
                        onClick={sendMessage}
                        disabled={loading}
                        className="bg-blue-600 text-white p-3 rounded-lg flex items-center disabled:bg-gray-400 transition-all"
                    >
                        {loading ? <LoaderCircleIcon className="animate-spin"/> : <FaPaperPlane />}
                    </button>
                </div>
            </motion.div>
        </div>

    );
};

export default Chatbot;
