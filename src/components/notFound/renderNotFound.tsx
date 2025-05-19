

const RenderNotFound: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-[50vh] gap-y-5">
            <div className="flex gap-2">
                <span className="animate-bounce bg-red-400 p-2 rounded-full"></span>
                <span className="animate-bounce bg-red-400 p-2 rounded-full"></span>
                <span className="animate-bounce bg-red-400 p-2 rounded-full"></span>
            </div>
            <p className="text-[20px] text-gray-400">Không tìm thấy dữ liệu...</p>
                <button className="bg-gray-300 w-[160px] h-[50px] rounded-xl hover:bg-blue-400 hover:text-white hover:font-bold" onClick={() => window.location.reload()}>
                    Tải lại trang
                </button>
        </div>
    )
}

export default RenderNotFound;