import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Chính sách bảo mật | UDULib",
  description: "Chính sách bảo mật và quyền riêng tư của UDULib",
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Chính sách bảo mật</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Thông tin chúng tôi thu thập</h2>
          <p className="text-gray-700">
            Chúng tôi thu thập các thông tin sau:
          </p>
          <ul className="list-disc ml-6 mt-2 text-gray-700">
            <li>Thông tin cá nhân (họ tên, email, số điện thoại)</li>
            <li>Thông tin đăng nhập và hoạt động trên hệ thống</li>
            <li>Thông tin thiết bị và trình duyệt</li>
            <li>Dữ liệu về cách bạn sử dụng dịch vụ</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Cách chúng tôi sử dụng thông tin</h2>
          <p className="text-gray-700">
            Chúng tôi sử dụng thông tin của bạn để:
          </p>
          <ul className="list-disc ml-6 mt-2 text-gray-700">
            <li>Cung cấp và duy trì dịch vụ</li>
            <li>Cải thiện trải nghiệm người dùng</li>
            <li>Gửi thông báo và cập nhật quan trọng</li>
            <li>Bảo vệ quyền lợi và an toàn của người dùng</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Bảo mật thông tin</h2>
          <p className="text-gray-700">
            Chúng tôi cam kết bảo vệ thông tin của bạn bằng cách:
          </p>
          <ul className="list-disc ml-6 mt-2 text-gray-700">
            <li>Sử dụng các biện pháp bảo mật tiên tiến</li>
            <li>Mã hóa dữ liệu nhạy cảm</li>
            <li>Giới hạn quyền truy cập vào thông tin cá nhân</li>
            <li>Thường xuyên kiểm tra và cập nhật các biện pháp bảo mật</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Chia sẻ thông tin</h2>
          <p className="text-gray-700">
            Chúng tôi không chia sẻ thông tin cá nhân của bạn với bên thứ ba, trừ khi:
          </p>
          <ul className="list-disc ml-6 mt-2 text-gray-700">
            <li>Được sự đồng ý của bạn</li>
            <li>Tuân thủ yêu cầu pháp lý</li>
            <li>Bảo vệ quyền lợi và an toàn của UDULib</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Quyền của người dùng</h2>
          <p className="text-gray-700">
            Bạn có quyền:
          </p>
          <ul className="list-disc ml-6 mt-2 text-gray-700">
            <li>Truy cập và chỉnh sửa thông tin cá nhân</li>
            <li>Yêu cầu xóa thông tin</li>
            <li>Phản đối việc xử lý dữ liệu</li>
            <li>Yêu cầu sao chép dữ liệu</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Cập nhật chính sách</h2>
          <p className="text-gray-700">
            Chúng tôi có thể cập nhật chính sách này theo thời gian. Mọi thay đổi sẽ được thông báo trên trang web.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Liên hệ</h2>
          <p className="text-gray-700">
            Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật, vui lòng liên hệ với chúng tôi.
          </p>
        </section>
      </div>
    </div>
  )
} 