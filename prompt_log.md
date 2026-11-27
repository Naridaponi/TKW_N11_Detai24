# NHẬT KÝ ĐỒNG HÀNH CÙNG AI (PROMPT LOG)

**Học phần:** Thiết kế Web – Trường Đại học Lạc Hồng (LHU)  
**Tên nhóm:** Nhóm 8 (Đề tài 24)  
**Lớp:** 25CT113
**Tên dự án:** Bản đồ Cứu trợ & Kết nối Cộng đồng (Community Rescue Map)  
**Link Live Demo (GitHub Pages):** [https://naridaponi.github.io/TKW_N8_Detai24/](https://naridaponi.github.io/TKW_N8_Detai24/)

---

### Danh sách thành viên nhóm:
1. **Nguyễn Ngọc Bảo Linh** - Thành viên (Phụ trách: `js/data.js`, `css/style.css`, `index.html`, `js/map.js`, Duyệt PR & Bật GitHub Pages)
2. **Nguyễn Như Ý** - Nhóm Trưởng (Phụ trách: `requests.html`, `js/requests.js`)
3. **Nguyễn Nhật Tân** - Thành viên (Phụ trách: `volunteer.html`, `js/volunteer.js`, Tổng hợp README.md & Prompt Log)

---

## 1. Thông tin công cụ AI sử dụng
* **Công cụ chính:** Google Gemini 3.8 / Antigravity Agentic Assistant.
* **Công cụ hỗ trợ code (Extension):** Visual Studio Code (Live Server, GitHub Pull Request).
* **Công cụ tạo hình ảnh/nội dung:** Canva AI (thiết kế logo, mockup bản đồ SVG).

---

## 2. Nhật ký quá trình thực hiện (Các Prompt quan trọng)

| Giai đoạn | Mục tiêu (Bạn muốn AI làm gì?) | Nội dung Prompt (Câu lệnh bạn đã dùng) | Kết quả & Tùy chỉnh (AI có làm đúng không? Bạn có sửa lại gì không?) |
| :--- | :--- | :--- | :--- |
| **1. Khởi tạo & Thiết lập nền tảng** | Tạo Data layer (`data.js`) với 6 ca cứu trợ mẫu Đồng Nai và Design System (`style.css`) dùng chung cho cả 3 trang. | *"Bạn là chuyên gia Front-end. Tôi đang bắt đầu dự án nhóm 'Bản đồ Cứu trợ & Kết nối Cộng đồng (Community Rescue Map)' bằng HTML5, CSS3 và JavaScript thuần. Hãy giúp tôi tạo 2 file nền tảng dùng chung cho cả 3 trang (index.html, requests.html, volunteer.html): File js/data.js: Tạo mảng dữ liệu mẫu JSON DEFAULT_REQUESTS gồm 6 yêu cầu cứu trợ tại khu vực Đồng Nai (id, name, phone, address, type: y-te, thuc-pham, noi-o, status: dang-cho, da-giup, note, coords %)... File css/style.css: Khai báo Design System bằng biến CSS (:root) gồm màu chủ đạo và 3 màu phân loại nhu cầu (--color-medical: #e74c3c, --color-food: #f39c12, --color-shelter: #3498db, --color-done: #10b981). Viết CSS Reset, khung main, footer và navbar bằng Flexbox responsive <600px."* | **Đạt 100% yêu cầu.** AI tổ chức mảng JSON chuẩn xác, viết sẵn hàm `getRequests()` và `saveRequests()` đồng bộ `localStorage`. Nhóm chỉ tinh chỉnh lại tên các địa danh tại Đồng Nai (Biên Hòa, Long Khánh, Vĩnh Cửu, Nhơn Trạch) cho sát thực tế. |
| **2. Giao diện & Bản đồ tương tác** | Xây dựng Bản đồ tương tác với 3 màu Marker, Marker Y tế có hiệu ứng nhấp nháy Pulse, lọc trạng thái và Popup chi tiết. | *"Dự án đã có sẵn style.css và data.js. Hãy viết code cho 2 file index.html (chuẩn Semantic HTML5) và js/map.js: Navbar có 3 link (Trang chủ, Danh sách yêu cầu, Đăng ký tình nguyện viên); Bộ lọc trạng thái gồm 3 nút ('Tất cả', 'Đang chờ', 'Đã được giúp'); Bảng chú thích 3 màu Marker (Đỏ: Y tế có hiệu ứng nhấp nháy pulse, Cam: Thực phẩm, Xanh dương: Nơi ở); Khung bản đồ (position: relative) dùng .map() vẽ Marker theo coords; Khi bấm lọc dùng .filter(); Khi bấm vào Marker hiện Popup chi tiết (Tên, SĐT có thẻ tel:, Địa chỉ, Loại nhu cầu, Trạng thái, Ghi chú, nút đóng); Responsive tốt trên màn hình điện thoại 375px."* | **Đạt 95%.** AI vẽ marker bằng `.map()` và lọc bằng `.filter()` rất mượt. Ban đầu Popup bị tràn viền khi xem trên điện thoại iPhone nhỏ, nhóm đã bổ sung thêm `@media (max-width: 600px)` cho `map-wrapper` cao 480px và định dạng lại kích thước font. |
| **3. Tính năng Danh sách & Form Cứu trợ** | Tạo Danh sách dạng CSS Grid (3 cột PC, 1 cột Mobile) và Form tiếp nhận có Validation Regex SĐT, sinh tọa độ ngẫu nhiên. | *"Hãy viết code cho requests.html và js/requests.js: 1) Danh sách yêu cầu cứu trợ dùng CSS Grid hiển thị 3 cột trên máy tính và 1 cột trên điện thoại (<768px), dùng .map() đổ dữ liệu từ getRequests() thành Cards có nhãn màu, SĐT bấm gọi được (<a href="tel:...">), lọc trạng thái dùng .filter(). 2) Form gửi yêu cầu mới: kiểm tra dữ liệu bằng event.preventDefault(), không được bỏ trống, SĐT đúng 10 số bắt đầu bằng 0 (dùng Regex), hiện lỗi đỏ dưới ô nhập (không dùng alert()). Nếu hợp lệ thì tạo tọa độ ngẫu nhiên trong khung bản đồ (20%–80%), lưu localStorage bằng saveRequests() và cập nhật danh sách ngay lập tức."* | **Đạt 100%.** Regex `/^0[0-9]{9}$/` hoạt động chuẩn xác, khi sai hiện viền đỏ và thông báo lỗi trực tiếp không bị gián đoạn trải nghiệm người dùng. Nhóm bổ sung thêm chức năng tự động cuộn màn hình (`scrollIntoView`) đến Card vừa tạo mới. |
| **4. Tính năng Tình nguyện viên** | Tạo Form đăng ký tình nguyện viên, kiểm tra Regex Email & SĐT, Checkbox nhóm kỹ năng, thông báo tự ẩn sau 3s. | *"Hãy viết code cho volunteer.html và js/volunteer.js: Thiết kế Form đăng ký tình nguyện viên hiện đại, Responsive tốt trên điện thoại (Họ tên, SĐT, Email, Khu vực, Checkbox chọn Khả năng: Vận chuyển, Y tế, Nhu yếu phẩm, Chỗ ở). Viết hàm Validation dùng event.preventDefault(), SĐT 10 số và Email bằng Regex, chọn ít nhất 1 khả năng hỗ trợ, hiện lỗi đỏ dưới ô nhập. Khi thành công lưu vào localStorage (key volunteers), hiện thông báo mượt mà tự ẩn sau 3 giây bằng setTimeout và hiển thị danh sách tình nguyện viên vừa đăng ký ở bên dưới."* | **Đạt 98%.** AI viết chuẩn `localStorage.setItem('volunteers', ...)` và `setTimeout` 3000ms. Nhóm đã tự tay thiết kế thêm viền xanh và hiệu ứng chọn active cho các ô Checkbox Card để giao diện trực quan và đẹp mắt hơn. |
| **5. Sửa lỗi & Hoàn thiện tài liệu** | Cập nhật file README.md, chỉnh sửa phân công công việc và sửa lỗi hiển thị trên thiết bị nhỏ. | *"Cập nhật file README.md: Tên dự án, danh sách thành viên & vai trò (Người 1: Bảo Linh, Người 2: Như Ý, Người 3: Nhật Tân), mô tả bài toán, link GitHub Pages, 3-5 prompt nổi bật. Sau đó cập nhật lại nhiệm vụ Duyệt PR & Bật GitHub Pages cho Bảo Linh."* | **Đạt 100%.** Bảng phân công chuẩn hóa, không bị xung đột nhiệm vụ, các câu prompt được đúc kết rõ ràng và đồng bộ với cấu trúc thư mục của đồ án. |

---

## 3. Những bài học kinh nghiệm khi dùng AI

* **Câu lệnh (Prompt) hiệu quả nhất mà nhóm đúc kết được:**  
  Kỹ thuật **"Đóng vai + Bối cảnh + Ràng buộc kỹ thuật chi tiết"**:
  > *"Bạn là chuyên gia Front-end. Dự án đã có sẵn file X (chứa hàm A, biến B). Hãy viết file Y bằng Semantic HTML5/JS thuần: yêu cầu dùng phương thức .map() và .filter(), dùng event.preventDefault(), kiểm tra SĐT bằng Regex /^0[0-9]{9}$/, không dùng alert() mà hiện lỗi đỏ dưới ô nhập, responsive tốt trên màn hình 375px."*  
  *(Càng nêu rõ tên hàm, phương thức JavaScript bắt buộc và điều kiện biên thì code AI trả về càng chính xác, không bị lan man hay dùng thư viện thừa).*

* **Khó khăn khi làm việc với AI:**  
  * Đôi khi AI có xu hướng dùng các thư viện bên ngoài (như Bootstrap, Leaflet.js, SweetAlert2) trong khi yêu cầu của học phần là **HTML5/CSS3/JS thuần**. Nhóm phải nhấn mạnh rõ ràng: *"chỉ dùng Vanilla JavaScript, CSS thuần và LocalStorage"*.
  * Một số đoạn code ban đầu của AI không đồng bộ khóa LocalStorage giữa các trang (lúc đặt `requests`, lúc đặt `COMMUNITY_RESCUE_REQUESTS`). Nhóm phải tự quy định một biến hằng số `STORAGE_KEY` dùng chung trong `data.js`.

* **Cách nhóm kiểm tra độ chính xác của code AI:**  
  1. Mở công cụ **Chrome DevTools (F12)** -> Tab **Console** để theo dõi lỗi JavaScript phát sinh.
  2. Bật chế độ giả lập thiết bị di động (**Toggle Device Toolbar**) để test giao diện thực tế trên kích thước màn hình iPhone SE (375px), iPhone 12/14 Pro (390px) và iPad (768px).
  3. Kiểm tra dữ liệu thực tế tại Tab **Application -> Local Storage** để xem các Object và Array JSON được lưu và xóa như thế nào.
  4. Đọc hiểu từng dòng lệnh, yêu cầu AI giải thích các hàm phức tạp (như cơ chế Regex và sự kiện `scrollIntoView`).

---

## 4. Cam kết của nhóm
* [ ] **Nhóm đã đọc và hiểu rõ ít nhất 80% mã nguồn do AI tạo ra.** *(Tất cả thành viên đều nắm rõ cấu trúc DOM, các hàm `.filter()`, `.map()`, và xử lý sự kiện trong JavaScript)*.
* [x] **Nhóm đã tự tay chỉnh sửa lại giao diện (màu sắc, hình ảnh, nội dung)** để phù hợp với thực tế tại tỉnh Đồng Nai và yêu cầu của giảng viên.

---

## 5. Lưu ý & Chuẩn bị bảo vệ đồ án
* **Ảnh chụp minh chứng:** Nhóm đã lưu trữ các ảnh chụp màn hình tương tác với AI trong thư mục `/docs`.
* **Sẵn sàng trả lời vấn đáp của Thầy:**  
  * *Tại sao dùng `.map()` thay vì vòng lặp `for`?* -> Vì `.map()` là cú pháp ES6 hiện đại, giúp biến đổi mảng dữ liệu thành danh sách phần tử DOM ngắn gọn, dễ bảo trì và không làm biến đổi mảng gốc.
  * *Tại sao phải dùng `event.preventDefault()`?* -> Để ngăn trình duyệt tải lại trang (reload) khi bấm nút Submit, giữ nguyên dữ liệu trong LocalStorage và cho phép hiển thị thông báo lỗi/thành công mượt mà dạng Single Page.
  * *Tại sao dùng Regex `/^0[0-9]{9}$/`?* -> Ký tự `^0` bắt buộc chuỗi bắt đầu bằng số 0, `[0-9]{9}` quy định 9 ký tự tiếp theo là chữ số từ 0 đến 9, và `$` đảm bảo chuỗi kết thúc đúng tại vị trí chữ số thứ 10.
