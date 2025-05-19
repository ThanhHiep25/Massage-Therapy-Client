
import { useLocation } from "react-router-dom";
import "../../styles/success.css";

const PaymentSuccess: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // Lấy thông tin trạng thái thanh toán từ URL
  const transactionStatus = queryParams.get("vnp_TransactionStatus");
  const transactionNo = queryParams.get("vnp_TransactionNo");
  const amount = queryParams.get("vnp_Amount");
  const orderInfo = queryParams.get("vnp_OrderInfo");
  const bankCode = queryParams.get("vnp_BankCode");
  const paymentTime = queryParams.get("vnp_PayDate");

  const formattedAmount = amount
    ? new Intl.NumberFormat("vi-VN").format(parseFloat(amount) / 100)
    : "0";

  const formattedDateTime = paymentTime ? new Date(paymentTime) : new Date();

  return (
    <div className="text-center h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      <div className="payment-success ">
        {transactionStatus === "00" ? (
          <div className="success">
            <svg
              className="checkmark "
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
              <h6>Thanh toán thành công!</h6>
              <h2>{formattedAmount} đ</h2>
            </div>

            <hr />
            <p className=" hover:text-blue-400">
              Thời gian:
              <strong>{formattedDateTime.toLocaleString("vi-VN")}</strong>
            </p>
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
                  {transactionNo}
                </span>
              </strong>
            </p>
            <p className=" hover:text-blue-400">
              Thông tin đơn hàng:<strong>{orderInfo}</strong>
            </p>
            <p className=" hover:text-blue-400">
              Ngân hàng:<strong>{bankCode}</strong>
            </p>
            {/* <p>
            Mã khách hàng:<strong>{userId}</strong> 
          </p> */}
          </div>
        ) : (
          <div className="fail">
            <img
              src="/17702131.gif"
              alt="fail"
              height={100}
              width={100}
              style={{
                borderRadius: "50%",
              }}
            />
            <p>❌ Thanh toán thất bại. Vui lòng thử lại.</p>
          </div>
        )}

        <a href="/" className="back-link hover:text-blue-400" >
          Quay lại trang thanh toán
        </a>
      </div>
    </div>
  );
};

export default PaymentSuccess;
