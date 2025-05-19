// // Code: Nguyen Hiep


// //==================================================================================================
// // Description: This page is used to demonstrate the Google Pay integration with the Payment Gateway.
// // 1.The payment details are fetched from the backend server and displayed on the page.
// // 2.The Google Pay button is rendered with the payment request details.
// // 3.The payment request details include the payment amount, currency code, and merchant information.
// // 4.The Google Pay button is rendered with the payment request details.
// // 5.When the user clicks on the Google Pay button, the payment sheet is displayed.
// // 6.The user can select a payment method and complete the payment using the Google Pay button.
// // 7.The payment response is sent to the backend server for processing.
// // 8.The payment status is updated based on the payment response.
// // 9.The payment details are displayed on the page after the payment is completed.
// //==================================================================================================


// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import GooglePayButton from "@google-pay/button-react";
// import { createGooglePay } from "../../service/apiPayment";

// interface Payment {
//   id: number;
//   userId: number;
//   amount: number;
//   paymentMethod: string;
//   status: string;
//   transactionTime: string;
// }

// const GooglePay: React.FC = () => {
//   const [payment, setPayment] = useState<Payment | null>(null);

//   useEffect(() => {
//     const fetchPayment = async () => {
//       try {
//         const response = await createGooglePay({ data: {} });
//         setPayment(response.data);
//       } catch (error) {
//         console.error("Error fetching payment details:", error);
//       }
//     };

//     fetchPayment();
//   }, []);

//   return (
//     <div className="payment-container-gg">
//       <h2>
//         <span>G</span>
//         <span>o</span>
//         <span>o</span>
//         <span>g</span>
//         <span>l</span>
//         <span>e</span>
//         <span>P</span>
//         <span>a</span>
//         <span>y</span>
//       </h2>
//       {payment ? (
//         <div>
//           <table className="vertical-table-gg">
//             <tr>
//               <th>ID</th>
//               <td>{payment.id}</td>
//             </tr>
//             <tr>
//               <th>Số Tiền</th>
//               <td>{payment.amount}</td>
//             </tr>
//             <tr>
//               <th>Phương Thức</th>
//               <td>{payment.paymentMethod}</td>
//             </tr>
//             <tr>
//               <th>Trạng Thái</th>
//               <td>{payment.status}</td>
//             </tr>
//             <tr>
//               <th>Thời Gian</th>
//               <td>{payment.transactionTime}</td>
//             </tr>
//           </table>
//         </div>
//       ) : (
//         <div className="loading-container-gg">
//           <p className="loading-text-gg">Đang tải dữ liệu...</p>
//         </div>
//       )}
      
//       <GooglePayButton
//         className="google-pay-button-gg"
//         environment="TEST"
//         buttonSizeMode="fill"
//         buttonColor="white"
//         onClick={
//           () => {
//             console.log("Google Pay button clicked");
//           }
//         }
//         paymentRequest={{
//           apiVersion: 2,
//           apiVersionMinor: 0,
//           allowedPaymentMethods: [
//             {
//               type: "CARD",
//               parameters: {
//                 allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
//                 allowedCardNetworks: [
//                   "AMEX",
//                   "DISCOVER",
//                   "JCB",
//                   "MASTERCARD",
//                   "VISA",
//                 ],
//               },
//               tokenizationSpecification: {
//                 type: "PAYMENT_GATEWAY",
//                 parameters: {
//                   gateway: "example",
//                   gatewayMerchantId: "exampleGatewayMerchantId",
//                 },
//               },
//             },
//           ],
//           merchantInfo: {
//             merchantId: "4862829828244278",
//             merchantName: "NGUYEN HIEP - SPA ROYAL",
//           },
//           transactionInfo: {
//             totalPriceStatus: "FINAL",           
//             totalPrice: payment?.amount.toString() || "0.00",
//             currencyCode: "VND",
//             countryCode: "VN",
//             transactionNote: "Test Transaction",
//           },
        
//         }}
//       />
//     </div>
//   );
// };

// export default GooglePay;
