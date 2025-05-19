import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    handlePageChange: (page: number) => void;
    pageSize: number;
    handlePageSizeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    handlePageChange,
    pageSize,
    handlePageSizeChange,
}) => {
    return (
        <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-md">
            <select
                value={pageSize}
                onChange={handlePageSizeChange}
                className="border rounded p-2 text-sm w-24"
                aria-label="Select page size"
            >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
            </select>
            <div className="flex space-x-2">
                <button
                    className="bg-gray-300 text-gray-700 rounded-full p-2 w-10 h-10 flex items-center justify-center"
                    onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                >
                    <ChevronLeft size={20} />
                </button>
                <span className="p-2 text-sm">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    className="bg-gray-300 text-gray-700 rounded-full p-2 w-10 h-10 flex items-center justify-center"
                    onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default Pagination;