
import { useLocation, Link } from 'react-router-dom';
import "../../styles/success.css"; // Import CSS nếu cần

const GooglePaySuccess: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const transactionId = queryParams.get("transactionId");
  const amount = queryParams.get("amount");
  const status = queryParams.get("status"); // Thêm tham số status để kiểm tra thành công/thất bại

  const formattedAmount = amount
    ? new Intl.NumberFormat("vi-VN").format(parseFloat(amount)) + " đ"
    : "";

  return (
    <div className="text-center h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-teal-900 to-black">
      <div className="payment-success">
        {status === "googlepay_success" ? (
          <div className="success">
            <svg
              className="checkmark"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 52 52"
            >
              <circle
                className="checkmark__circle"
                cx="26"
                cy="26"
                r="25"
                fill="none"
              />
              <path
                className="checkmark__check"
                fill="none"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
              />
            </svg>
            <div className="mt-3">
              <h6>Thanh toán Google Pay thành công!</h6>
              {formattedAmount && <h2>{formattedAmount}</h2>}
              {transactionId && (
                <p className=" hover:text-blue-400">
                  Mã giao dịch:
                  <strong>
                    <span
                      style={{
                        color: "blue",
                        padding: 4,
                        background: "#CDC1FF",
                        borderRadius: 7,
                        display: "inline-block",
                        cursor: "pointer",
                      }}
                      title="sao chép"
                    >
                      {transactionId}
                    </span>
                  </strong>
                </p>
              )}
              {!transactionId && <p>Giao dịch Google Pay của bạn đã thành công.</p>}
            </div>
          </div>
        ) : (
          <div className="fail">
            <img
              src="/17702131.gif" // Đường dẫn ảnh thất bại (tùy chọn)
              alt="fail"
              height={100}
              width={100}
              style={{ borderRadius: "50%" }}
            />
            <p>❌ Thanh toán Google Pay thất bại. Vui lòng thử lại.</p>
            {transactionId && <p>Mã giao dịch (tham khảo): {transactionId}</p>}
            {formattedAmount && <p>Số tiền: {formattedAmount}</p>}
          </div>
        )}
        <Link to="/" className="back-link hover:text-blue-400">
          Quay lại trang chủ
        </Link>
      </div>
    </div>
  );
};

export default GooglePaySuccess;