# Bản đồ Cứu trợ & Kết nối Cộng đồng (Community Rescue Map)

Ứng dụng web hỗ trợ trực quan hóa các điểm cứu trợ khẩn cấp trên bản đồ tương tác và kết nối trực tiếp, kịp thời giữa người dân cần hỗ trợ với mạng lưới tình nguyện viên tại khu vực tỉnh **Đồng Nai**.

🌐 **Link Live Demo (GitHub Pages):** [https://naridaponi.github.io/TKW_N8_Detai24/](https://naridaponi.github.io/TKW_N8_Detai24/)

---

## Danh sách thành viên & Phân công vai trò

| STT | Họ và Tên | Vai trò | Nhánh phụ trách | File chính thực hiện | Nhiệm vụ cụ thể |
| :---: | :--- | :---: | :---: | :--- | :--- |
| 1 | **Nguyễn Ngọc Bảo Linh** | **Thành viên** | `feature-setup`<br>`feature-map` | `js/data.js`<br>`css/style.css`<br>`index.html`<br>`js/map.js` | • Thiết lập cấu trúc thư mục, Navbar chung và dữ liệu mẫu `data.js`.<br>• Xây dựng Trang chủ Bản đồ, 3 màu Marker và bộ lọc trạng thái (*Đang chờ / Đã giúp*).<br>• **Duyệt Pull Request (Merge) & bật GitHub Pages.** |
| 2 | **Nguyễn Như Ý** | **Nhóm Trưởng** | `feature-requests` | `requests.html`<br>`js/requests.js` | • Xây dựng Trang Danh sách yêu cầu (đổ dữ liệu từ `data.js`, tích hợp SĐT liên hệ bấm gọi ngay).<br>• Xây dựng Form gửi yêu cầu cứu trợ (kiểm tra dữ liệu bắt buộc + lưu `localStorage`). |
| 3 | **Nguyễn Nhật Tân** | **Thành viên** | `feature-volunteer` | `volunteer.html`<br>`js/volunteer.js`<br>`README.md`<br>`prompt_log.md` | • Xây dựng Trang Đăng ký tình nguyện viên (Form thông tin + nhóm chọn khả năng hỗ trợ + kiểm tra dữ liệu bằng Regex).<br>• Tổng hợp file `README.md` và Nhật ký AI (`prompt_log.md`) cho toàn bộ nhóm. |

---

## Bài toán giải quyết & Tính năng chính

### 1. Bài toán thực tế
Trong các đợt mưa lũ, thiên tai hoặc biến cố khẩn cấp, việc cứu trợ thường đối mặt với các khó khăn:
- **Thông tin phân tán:** Các lời kêu cứu trên mạng xã hội dễ bị trôi tin, thiếu định vị chính xác và thiếu số điện thoại liên lạc trực tiếp.
- **Trùng lặp hoặc bỏ sót nguồn lực:** Người cứu trợ không phân biệt được điểm nào đã nhận được hỗ trợ và điểm nào vẫn đang trong tình trạng nguy cấp.
- **Thiếu kênh kết nối chuyên môn:** Không có nơi tập hợp các nguồn lực hỗ trợ cụ thể (xuồng ghe vận chuyển, bác sĩ y tế, nhu yếu phẩm, chỗ ở tạm thời).

👉 **Community Rescue Map** cung cấp nền tảng web nhẹ (HTML5, CSS3, Vanilla JavaScript), giao diện thân thiện, tối ưu tốt trên màn hình điện thoại (Mobile First) giúp kết nối hai chiều minh bạch và nhanh chóng.

### 2. Các tính năng cốt lõi
1. **Bản đồ tương tác trực quan (`index.html`):**
   - Định vị các điểm cứu trợ theo tọa độ phần trăm (`coords.top`, `coords.left`) trên nền bản đồ mô phỏng địa bàn tỉnh Đồng Nai.
   - **3 Màu Marker chuẩn:**
     - 🔴 **Đỏ (Y tế):** Nhu cầu cấp cứu, thuốc men (kèm **hiệu ứng nhấp nháy Pulse** khẩn cấp).
     - 🟠 **Cam (Thực phẩm):** Cung cấp lương thực, nước uống đóng chai.
     - 🔵 **Xanh dương (Nơi ở):** Cần hỗ trợ sơ tán, chỗ ở tạm an toàn.
   - Bộ lọc trạng thái 3 nút (*Tất cả / Đang chờ / Đã được giúp*) sử dụng phương thức `.filter()`.
   - Hộp thoại Popup xem thông tin chi tiết (Tên, Địa chỉ, Ghi chú, SĐT gắn thẻ `<a href="tel:...">` bấm gọi trực tiếp).
2. **Danh sách & Gửi yêu cầu cứu trợ (`requests.html`):**
   - **Danh sách yêu cầu:** Bố cục **CSS Grid** hiển thị 3 cột trên máy tính và tự động chuyển về 1 cột trên điện thoại (<768px), render tự động bằng `.map()`.
   - **Form gửi yêu cầu mới:** Kiểm tra hợp lệ dữ liệu (Validation) với `event.preventDefault()`, không dùng `alert()` mà báo lỗi đỏ ngay dưới ô nhập:
     - Bắt buộc điền đủ: Họ tên, Địa chỉ, Loại nhu cầu, Ghi chú.
     - Số điện thoại chuẩn 10 chữ số bắt đầu bằng số `0` kiểm tra bằng Regex (`/^0[0-9]{9}$/`).
   - Tự động sinh tọa độ ngẫu nhiên an toàn trong khung bản đồ (20% – 80%), lưu vào `localStorage` qua `saveRequests()` và đồng bộ ngay lập tức.
3. **Cổng Đăng ký Tình nguyện viên (`volunteer.html`):**
   - Form đăng ký hiện đại tiếp nhận cá nhân/tổ chức với: Họ tên, Số điện thoại (Regex 10 số), Email (Regex chuẩn email), Khu vực hỗ trợ tại Đồng Nai.
   - Nhóm Checkbox chọn Khả năng hỗ trợ: *Vận chuyển, Hỗ trợ y tế, Cung cấp nhu yếu phẩm, Chỗ ở tạm thời* (Bắt buộc chọn ít nhất 1).
   - Lưu trữ vào `localStorage` với key `volunteers`, thông báo thành công mượt mà tự ẩn sau 3 giây (`setTimeout`).
   - Hiển thị danh sách các tình nguyện viên đã đăng ký ngay bên dưới.
4. **Đồng bộ dữ liệu LocalStorage xuyên suốt:**
   - Dữ liệu giữa Bản đồ, Danh sách cứu trợ và Tình nguyện viên được đồng bộ hóa tức thời qua `localStorage`, sẵn sàng hoạt động độc lập không phụ thuộc backend server.

---

## 3–5 Câu Prompt nổi bật nhất của nhóm

Dưới đây là các câu Prompt tiêu biểu thể hiện rõ nét quá trình làm việc cùng trợ lý AI (Prompt Engineering) để hiện thực hóa dự án từ nền tảng đến chi tiết từng trang:

### Prompt 1: Khởi tạo Kiến trúc Dữ liệu & Design System
> *"Bạn là chuyên gia Front-end. Tôi đang bắt đầu dự án nhóm 'Bản đồ Cứu trợ & Kết nối Cộng đồng (Community Rescue Map)' bằng HTML5, CSS3 và JavaScript thuần. Hãy giúp tôi tạo 2 file nền tảng dùng chung cho cả 3 trang (index.html, requests.html, volunteer.html): File `js/data.js` tạo mảng dữ liệu mẫu JSON `DEFAULT_REQUESTS` gồm 6 yêu cầu cứu trợ tại khu vực Đồng Nai với các thuộc tính: `id`, `name`, `phone`, `address`, `type` (y-te, thuc-pham, noi-o), `status` (dang-cho, da-giup), `note`, và tọa độ `coords` (top, left tính theo %). Viết thêm các hàm `getRequests()` và `saveRequests()` dùng `localStorage` để đồng bộ dữ liệu giữa các trang, cùng hàm đổi mã type/status sang tiếng Việt. File `css/style.css` khai báo Design System bằng biến CSS (`:root`) gồm màu chủ đạo và 3 màu phân loại nhu cầu (`--color-medical: #e74c3c`, `--color-food: #f39c12`, `--color-shelter: #3498db`, `--color-done: #10b981`). Viết CSS Reset, khung main, footer và thanh điều hướng (navbar) bằng Flexbox sao cho Responsive tốt trên điện thoại (<600px)."*

### Prompt 2: Xây dựng Bản đồ Tương tác, Marker Pulse & Popup Chi Tiết
> *"Dự án của tôi là 'Bản đồ Cứu trợ & Kết nối Cộng đồng' đã có sẵn file `css/style.css` và file `js/data.js`. Hãy viết code cho 2 file `index.html` (chuẩn Semantic HTML5) và `js/map.js` (kèm đoạn CSS bổ sung cho bản đồ) với các yêu cầu: Thanh Navbar có 3 link (Trang chủ `index.html`, Danh sách yêu cầu `requests.html`, Đăng ký tình nguyện viên `volunteer.html`); Bộ lọc trạng thái gồm 3 nút ('Tất cả', 'Đang chờ', 'Đã được giúp') và bảng chú thích 3 màu Marker (Đỏ: Y tế có hiệu ứng nhấp nháy pulse, Cam: Thực phẩm, Xanh dương: Nơi ở); Khung bản đồ (`position: relative`) dùng ảnh nền hoặc khung mô phỏng khu vực, dùng hàm `.map()` trong `js/map.js` để tự động vẽ các Marker theo tọa độ `coords.top` và `coords.left` từ `getRequests()`; Khi bấm nút lọc thì dùng `.filter()` để cập nhật lại các Marker; Khi bấm vào một Marker thì hiện hộp thoại (Popup) chi tiết gồm: Tên, SĐT (có thẻ `tel:`), Địa chỉ, Loại nhu cầu, Trạng thái, Ghi chú và nút đóng; Đảm bảo giao diện Responsive tốt trên màn hình điện thoại 375px."*

### Prompt 3: Danh Sách Yêu Cầu CSS Grid & Form Tiếp Nhận Kèm Validation
> *"Hãy viết code cho `requests.html` (giữ nguyên Navbar/Footer đồng bộ với `index.html`) và `js/requests.js` (kèm CSS bổ sung) gồm 2 phần: 1) Danh sách yêu cầu cứu trợ: Dùng CSS Grid hiển thị 3 cột trên máy tính và 1 cột trên điện thoại (<768px). Dùng `.map()` đổ dữ liệu từ `getRequests()` thành các thẻ (Cards) có nhãn màu theo loại nhu cầu, trạng thái và số điện thoại bấm gọi được (`<a href="tel:...">`). Có bộ lọc trạng thái 'Tất cả / Đang chờ / Đã được giúp' dùng `.filter()`. 2) Form gửi yêu cầu cứu trợ mới: Gồm các ô Họ tên, Số điện thoại, Địa chỉ, Loại nhu cầu (y-te, thuc-pham, noi-o), Ghi chú. Viết hàm kiểm tra dữ liệu (Validation) dùng `event.preventDefault()`: không được bỏ trống, SĐT phải đúng 10 chữ số bắt đầu bằng số 0 (dùng Regex). Nếu sai hiện thông báo lỗi màu đỏ ngay dưới ô nhập (không dùng `alert()`). Nếu hợp lệ thì tạo tọa độ ngẫu nhiên trong khung bản đồ (20%–80%), lưu vào `localStorage` bằng `saveRequests()` và cập nhật danh sách ngay lập tức."*

### Prompt 4: Form Đăng Ký Tình Nguyện Viên & Quản Lý LocalStorage
> *"Hãy viết code cho trang `volunteer.html` và `js/volunteer.js` (kèm CSS bổ sung) với các yêu cầu: Thiết kế Form đăng ký tình nguyện viên hiện đại, Responsive tốt trên điện thoại, gồm: Họ tên / Tên tổ chức, Số điện thoại, Email, Khu vực có thể hỗ trợ, và nhóm Checkbox chọn Khả năng hỗ trợ (Vận chuyển, Hỗ trợ y tế, Cung cấp nhu yếu phẩm, Chỗ ở tạm thời). Viết hàm Validation trong `js/volunteer.js` dùng `event.preventDefault()`: kiểm tra bắt buộc nhập đủ thông tin, kiểm tra định dạng SĐT (10 số bắt đầu bằng 0) và Email bằng Regex, bắt buộc chọn ít nhất 1 khả năng hỗ trợ. Hiển thị lỗi màu đỏ ngay dưới từng ô nhập sai. Khi đăng ký thành công, lưu thông tin vào `localStorage` (key `volunteers`), hiển thị thông báo thành công mượt mà (tự ẩn sau 3 giây bằng `setTimeout`) và hiển thị danh sách các tình nguyện viên vừa đăng ký ở bên dưới."*

---

## Công nghệ sử dụng
- **HTML5:** Cấu trúc ngữ nghĩa chuẩn Semantic (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`).
- **CSS3:** Modern Flexbox, CSS Grid 3 cột / 1 cột, CSS Variables (`:root`), Keyframe Animations (`medical-pulse`, `fadeIn`, `popupSlideUp`), Media Queries Mobile-First.
- **JavaScript (ES6+):** Pure Vanilla JS, Modern Array Methods (`.map()`, `.filter()`), DOM Event Handling, Regular Expressions (Regex), Web Storage API (`localStorage`), Asynchronous Timers (`setTimeout`).
