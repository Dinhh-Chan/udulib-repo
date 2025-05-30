import { Metadata } from "next"


export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Điều khoản sử dụng</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Giới thiệu</h2>
          <p className="text-gray-700">
            Chào mừng bạn đến với UDULib. Bằng việc truy cập và sử dụng trang web này, bạn đồng ý tuân thủ và chịu ràng buộc bởi các điều khoản và điều kiện sau đây.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Điều khoản sử dụng</h2>
          <p className="text-gray-700">
            Khi sử dụng UDULib, bạn đồng ý:
          </p>
          <ul className="list-disc ml-6 mt-2 text-gray-700">
            <li>Tuân thủ mọi luật pháp và quy định hiện hành</li>
            <li>Không vi phạm quyền sở hữu trí tuệ của người khác</li>
            <li>Không sử dụng dịch vụ cho mục đích bất hợp pháp</li>
            <li>Không gây rối hoặc làm gián đoạn hoạt động của hệ thống</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Bảo mật thông tin</h2>
          <p className="text-gray-700">
            Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn theo chính sách bảo mật của chúng tôi. Việc sử dụng UDULib đồng nghĩa với việc bạn chấp nhận các thực hành được mô tả trong chính sách bảo mật.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Quyền sở hữu trí tuệ</h2>
          <p className="text-gray-700">
            Tất cả nội dung trên UDULib, bao gồm nhưng không giới hạn ở văn bản, hình ảnh, logo, và phần mềm, đều thuộc quyền sở hữu của chúng tôi hoặc các bên cấp phép.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Giới hạn trách nhiệm</h2>
          <p className="text-gray-700">
            UDULib không chịu trách nhiệm về bất kỳ thiệt hại nào phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ của chúng tôi.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Thay đổi điều khoản</h2>
          <p className="text-gray-700">
            Chúng tôi có quyền thay đổi các điều khoản này vào bất kỳ lúc nào. Việc tiếp tục sử dụng UDULib sau khi có thay đổi đồng nghĩa với việc bạn chấp nhận các điều khoản mới.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Liên hệ</h2>
          <p className="text-gray-700">
            Nếu bạn có bất kỳ câu hỏi nào về các điều khoản này, vui lòng liên hệ với chúng tôi.
          </p>
        </section>
      </div>
    </div>
  )
} 