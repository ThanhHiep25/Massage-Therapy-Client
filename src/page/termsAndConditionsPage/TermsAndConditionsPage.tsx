import { CalendarIcon, Check, ChevronLeft, CreditCardIcon, HomeIcon, MailIcon, PhoneIcon, ShieldAlert, ShieldCheckIcon, UserIcon } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const TermsAndConditionsPage: React.FC = () => {

const navigate = useNavigate();

const handleGoBack = () => {
    navigate(-1);
};

  return (
    <div className="bg-gradient-to-br from-gray-100 to-blue-50 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 py-4">
     <div className="w-full p-5">
        <span onClick={handleGoBack} className="cursor-pointer w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 hover:bg-gray-300">
            <ChevronLeft/>
        </span>
     </div>
      <div className="container mx-auto px-6 sm:px-12 lg:px-24">
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 sm:p-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-10">
            <ShieldCheckIcon className="h-8 w-8 inline-block mr-2 align-middle" />
            Chính sách và Điều khoản
          </h1>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4 flex items-center">
              <CalendarIcon className="h-6 w-6 mr-2" />
              Chính sách đặt lịch
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              <li>Đặt lịch dễ dàng qua website, ứng dụng di động, điện thoại hoặc trực tiếp tại spa.</li>
              <li>Vui lòng cung cấp thông tin cá nhân chính xác và lựa chọn dịch vụ mong muốn.</li>
              <li>Thời gian đặt lịch linh hoạt, tối thiểu trước 30 phút và tối đa 30 ngày.</li>
              <li>Xác nhận đặt lịch sẽ được gửi nhanh chóng qua email hoặc tin nhắn SMS.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4 flex items-center">
              <ShieldAlert className="h-6 w-6 mr-2" />
              Chính sách hủy lịch
            </h2>
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
              <p className="mb-2">Chúng tôi hiểu rằng đôi khi bạn cần thay đổi kế hoạch. Vui lòng lưu ý:</p>
              <ul className="list-disc pl-6">
                <li>Hủy lịch miễn phí trước 12 tiếng so với giờ hẹn.</li>
                <li>Hủy lịch trong vòng 12 tiếng sẽ áp dụng phí hủy là 30% giá trị dịch vụ.</li>
                <li>Khách hàng không đến (no-show) sẽ bị tính phí 100% giá trị dịch vụ.</li>
              </ul>
              <p className="mt-2">Để hủy lịch, vui lòng liên hệ với chúng tôi qua điện thoại hoặc email càng sớm càng tốt.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4 flex items-center">
              <CreditCardIcon className="h-6 w-6 mr-2" />
              Chính sách thanh toán
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Chúng tôi chấp nhận đa dạng hình thức thanh toán để thuận tiện cho bạn: tiền mặt, các loại thẻ tín dụng (Visa, Mastercard, American Express), và chuyển khoản ngân hàng. Thanh toán sẽ được thực hiện sau khi bạn đã hoàn toàn hài lòng với dịch vụ của chúng tôi. Hóa đơn điện tử hoặc hóa đơn giấy sẽ được cung cấp theo yêu cầu.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4 flex items-center">
              <UserIcon className="h-6 w-6 mr-2" />
              Chính sách bảo mật thông tin
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Sự riêng tư của bạn là ưu tiên hàng đầu của chúng tôi. Mọi thông tin cá nhân bạn cung cấp sẽ được bảo mật tuyệt đối và chỉ được sử dụng cho mục đích nâng cao chất lượng dịch vụ và liên lạc với bạn. Chúng tôi cam kết không tiết lộ thông tin của bạn cho bất kỳ bên thứ ba nào ngoại trừ khi có yêu cầu pháp lý. Dữ liệu thanh toán của bạn được mã hóa an toàn.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4 flex items-center">
              <UserIcon className="h-6 w-6 mr-2" />
              Quyền và nghĩa vụ của khách hàng
            </h2>
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
              <h3 className="text-lg font-medium text-blue-500 dark:text-blue-300 mb-2">Quyền của bạn:</h3>
              <ul className="list-disc pl-6 mb-3">
                <li>Được trải nghiệm dịch vụ massage và chăm sóc sức khỏe chất lượng cao.</li>
                <li>Được tư vấn tận tình về các liệu trình và sản phẩm phù hợp.</li>
                <li>Được phản hồi và khiếu nại về dịch vụ nếu có bất kỳ điều gì không hài lòng.</li>
              </ul>
              <h3 className="text-lg font-medium text-blue-500 dark:text-blue-300 mb-2">Nghĩa vụ của bạn:</h3>
              <ul className="list-disc pl-6">
                <li>Cung cấp thông tin sức khỏe đầy đủ và chính xác (nếu được yêu cầu).</li>
                <li>Tuân thủ lịch hẹn và thông báo trước nếu có thay đổi.</li>
                <li>Thanh toán đầy đủ và đúng hạn các chi phí dịch vụ.</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4 flex items-center">
              <HomeIcon className="h-6 w-6 mr-2" />
              Quyền và nghĩa vụ của spa
            </h2>
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
              <h3 className="text-lg font-medium text-blue-500 dark:text-blue-300 mb-2">Quyền của chúng tôi:</h3>
              <ul className="list-disc pl-6 mb-3">
                <li>Từ chối phục vụ khách hàng có hành vi không phù hợp hoặc gây ảnh hưởng đến người khác.</li>
                <li>Yêu cầu khách hàng thanh toán theo đúng bảng giá và chính sách.</li>
                <li>Điều chỉnh lịch hẹn trong trường hợp cần thiết và thông báo trước cho khách hàng.</li>
              </ul>
              <h3 className="text-lg font-medium text-blue-500 dark:text-blue-300 mb-2">Nghĩa vụ của chúng tôi:</h3>
              <ul className="list-disc pl-6">
                <li>Cung cấp dịch vụ chuyên nghiệp, an toàn và hiệu quả.</li>
                <li>Đảm bảo vệ sinh và không gian thư giãn tại spa.</li>
                <li>Giải quyết mọi thắc mắc và khiếu nại của khách hàng một cách công bằng và nhanh chóng.</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4 flex items-center">
              <ShieldAlert className="h-6 w-6 mr-2" />
              Thay đổi và cập nhật
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Chúng tôi có quyền cập nhật và điều chỉnh các chính sách và điều khoản này theo thời gian để phù hợp với tình hình hoạt động và quy định pháp luật. Mọi thay đổi sẽ được thông báo trên trang web và/hoặc qua email (nếu bạn đã đăng ký nhận thông tin). Việc bạn tiếp tục sử dụng dịch vụ sau khi các thay đổi có hiệu lực đồng nghĩa với việc bạn chấp nhận các điều khoản đã được cập nhật.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4 flex items-center">
              <Check className="h-6 w-6 mr-2" />
              Liên hệ
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Nếu bạn có bất kỳ câu hỏi, thắc mắc hoặc cần hỗ trợ liên quan đến chính sách và điều khoản này, xin vui lòng liên hệ với chúng tôi theo thông tin sau:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p className="flex items-center">
                <PhoneIcon className="h-5 w-5 mr-2 text-blue-500" />
                Điện thoại: <span className="font-semibold">0987654321</span>
              </p>
              <p className="flex items-center">
                <MailIcon className="h-5 w-5 mr-2 text-blue-500" />
                Email: <span className="font-semibold"> contact.jaloo.1@gmail.com</span>
              </p>
              <p className="flex items-center sm:col-span-2">
                <HomeIcon className="h-5 w-5 mr-2 text-blue-500" />
                Địa chỉ: <span className="font-semibold">123 Đường Spa, Quận Relax, Thành phố Chill</span>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;