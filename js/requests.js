/**
 * js/requests.js - Xử lý Validation Form và Render Danh Sách Yêu Cầu Cứu Trợ
 * Dự án: Bản đồ Cứu trợ & Kết nối Cộng đồng (Community Rescue Map)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. DOM Elements của Form gửi yêu cầu
    const form = document.getElementById('newRescueForm');
    const nameInput = document.getElementById('reqName');
    const phoneInput = document.getElementById('reqPhone');
    const typeSelect = document.getElementById('reqType');
    const addressInput = document.getElementById('reqAddress');
    const noteTextarea = document.getElementById('reqNote');

    // Các thẻ hiển thị lỗi trực tiếp dưới ô nhập
    const nameError = document.getElementById('nameError');
    const phoneError = document.getElementById('phoneError');
    const typeError = document.getElementById('typeError');
    const addressError = document.getElementById('addressError');
    const noteError = document.getElementById('noteError');

    // Banner thông báo thành công
    const formSuccessBanner = document.getElementById('formSuccessBanner');
    const closeSuccessBanner = document.getElementById('closeSuccessBanner');
    const successMsgDetail = document.getElementById('successMsgDetail');

    // DOM Elements của Danh sách yêu cầu & Bộ lọc
    const cardsContainer = document.getElementById('requestsCardsContainer');
    const displayCountBadge = document.getElementById('displayCountBadge');
    const filterButtons = document.querySelectorAll('.filter-pill-btn');

    let currentFilter = 'all'; // 'all' | 'dang-cho' | 'da-giup'

    // =========================================================================
    // PHẦN 1: RENDER DANH SÁCH YÊU CẦU CỨU TRỢ (DÙNG .filter() VÀ .map())
    // =========================================================================

    /**
     * Lấy class viền màu trên đầu card theo loại nhu cầu
     */
    function getCardBorderClass(type) {
        switch (type) {
            case 'y-te': return 'border-medical';
            case 'thuc-pham': return 'border-food';
            case 'noi-o': return 'border-shelter';
            default: return '';
        }
    }

    /**
     * Lấy biểu tượng theo loại nhu cầu
     */
    function getTypeIcon(type) {
        switch (type) {
            case 'y-te': return '🩺';
            case 'thuc-pham': return '🍞';
            case 'noi-o': return '🏠';
            default: return '📍';
        }
    }

    /**
     * Hàm render danh sách yêu cầu cứu trợ:
     * - Dùng .filter() để lọc theo trạng thái ('Tất cả' / 'Đang chờ' / 'Đã được giúp')
     * - Dùng .map() để đổ dữ liệu thành các thẻ Cards
     */
    function renderRequestsList() {
        const requests = getRequests();

        // [YÊU CẦU]: Bộ lọc trạng thái dùng hàm .filter()
        const filteredRequests = requests.filter(req => {
            if (currentFilter === 'all') return true;
            return req.status === currentFilter;
        });

        // Cập nhật số lượng hiển thị
        displayCountBadge.textContent = `${filteredRequests.length} yêu cầu`;

        // Nếu danh sách trống
        if (filteredRequests.length === 0) {
            cardsContainer.innerHTML = `
                <div class="empty-requests-notice">
                    <span>🔍</span>
                    <h3 style="color: var(--text-primary); font-size: 1.15rem; margin-bottom: 0.25rem;">Không có yêu cầu cứu trợ nào phù hợp</h3>
                    <p style="font-size: 0.9rem;">Hãy chọn trạng thái khác hoặc gửi yêu cầu cứu trợ mới ở khung phía trên.</p>
                </div>
            `;
            return;
        }

        // [YÊU CẦU]: Dùng hàm .map() để đổ dữ liệu thành các Card hiển thị nhãn màu và SĐT bấm gọi được
        const cardsHTML = filteredRequests.map(req => {
            const cleanPhone = req.phone.replace(/\s+/g, '');
            const borderClass = getCardBorderClass(req.type);
            const typeBadge = getTypeBadgeClass(req.type);
            const statusBadge = getStatusBadgeClass(req.status);

            return `
                <article class="rescue-request-card ${borderClass}" id="card-${req.id}">
                    <div>
                        <div class="card-top-header">
                            <span class="card-req-id">${req.id}</span>
                            <div class="card-badges-wrapper">
                                <!-- Nhãn màu theo loại nhu cầu -->
                                <span class="badge ${typeBadge}">
                                    ${getTypeIcon(req.type)} ${getTypeLabel(req.type)}
                                </span>
                                <!-- Nhãn màu theo trạng thái -->
                                <span class="badge ${statusBadge}">
                                    ${getStatusLabel(req.status)}
                                </span>
                            </div>
                        </div>

                        <h3 class="card-person-name">${escapeHTML(req.name)}</h3>

                        <p class="card-address-line">
                            <span>📍</span>
                            <span>${escapeHTML(req.address)}</span>
                        </p>

                        <div class="card-note-box">
                            "${escapeHTML(req.note)}"
                        </div>
                    </div>

                    <div class="card-footer-box">
                        <!-- Số điện thoại bấm gọi được (<a href="tel:...">) -->
                        <a href="tel:${cleanPhone}" class="card-phone-btn" title="Gọi điện trực tiếp cho người cần giúp">
                            📞 ${escapeHTML(req.phone)}
                        </a>

                        <span class="card-coords-tag" title="Tọa độ hiển thị trên bản đồ mô phỏng">
                            🗺️ (${req.coords.top}%, ${req.coords.left}%)
                        </span>
                    </div>
                </article>
            `;
        }).join('');

        cardsContainer.innerHTML = cardsHTML;
    }

    /**
     * Xử lý click các nút lọc trạng thái ('Tất cả / Đang chờ / Đã được giúp')
     */
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            currentFilter = btn.dataset.filter;
            renderRequestsList();
        });
    });

    // =========================================================================
    // PHẦN 2: VALIDATION FORM GỬI YÊU CẦU CỨU TRỢ MỚI
    // =========================================================================

    /**
     * Xóa thông báo lỗi và viền đỏ của một ô nhập liệu
     */
    function clearFieldError(inputEl, errorEl) {
        inputEl.classList.remove('has-error');
        errorEl.textContent = '';
    }

    /**
     * Đặt thông báo lỗi màu đỏ trực tiếp dưới ô nhập liệu (Không dùng alert())
     */
    function setFieldError(inputEl, errorEl, message) {
        inputEl.classList.add('has-error');
        errorEl.textContent = `⚠️ ${message}`;
    }

    /**
     * Lắng nghe sự kiện input/change để xóa lỗi ngay khi người dùng bắt đầu nhập lại
     */
    nameInput.addEventListener('input', () => clearFieldError(nameInput, nameError));
    phoneInput.addEventListener('input', () => clearFieldError(phoneInput, phoneError));
    typeSelect.addEventListener('change', () => clearFieldError(typeSelect, typeError));
    addressInput.addEventListener('input', () => clearFieldError(addressInput, addressError));
    noteTextarea.addEventListener('input', () => clearFieldError(noteTextarea, noteError));

    /**
     * Xử lý Submit Form bằng event.preventDefault() và kiểm tra Validation
     */
    form.addEventListener('submit', (e) => {
        // [YÊU CẦU]: Dùng event.preventDefault() để ngăn hành vi submit mặc định của trình duyệt
        e.preventDefault();

        // 1. Thu thập dữ liệu từ các ô nhập
        const nameVal = nameInput.value.trim();
        const phoneVal = phoneInput.value.trim();
        const typeVal = typeSelect.value;
        const addressVal = addressInput.value.trim();
        const noteVal = noteTextarea.value.trim();

        let isValid = true;
        let firstInvalidElement = null;

        // 2. Kiểm tra Họ tên: Không được bỏ trống
        if (!nameVal) {
            setFieldError(nameInput, nameError, 'Họ và tên không được bỏ trống.');
            isValid = false;
            if (!firstInvalidElement) firstInvalidElement = nameInput;
        } else {
            clearFieldError(nameInput, nameError);
        }

        // 3. [YÊU CẦU]: SĐT phải đúng 10 chữ số bắt đầu bằng số 0 (Dùng Regex: /^0[0-9]{9}$/)
        const phoneRegex = /^0[0-9]{9}$/;
        if (!phoneVal) {
            setFieldError(phoneInput, phoneError, 'Số điện thoại không được bỏ trống.');
            isValid = false;
            if (!firstInvalidElement) firstInvalidElement = phoneInput;
        } else if (!phoneRegex.test(phoneVal)) {
            setFieldError(phoneInput, phoneError, 'Số điện thoại phải gồm đúng 10 chữ số và bắt đầu bằng số 0 (Ví dụ: 0912345678).');
            isValid = false;
            if (!firstInvalidElement) firstInvalidElement = phoneInput;
        } else {
            clearFieldError(phoneInput, phoneError);
        }

        // 4. Kiểm tra Loại nhu cầu: Không được bỏ trống
        if (!typeVal) {
            setFieldError(typeSelect, typeError, 'Vui lòng chọn loại nhu cầu cứu trợ.');
            isValid = false;
            if (!firstInvalidElement) firstInvalidElement = typeSelect;
        } else {
            clearFieldError(typeSelect, typeError);
        }

        // 5. Kiểm tra Địa chỉ: Không được bỏ trống
        if (!addressVal) {
            setFieldError(addressInput, addressError, 'Địa chỉ cụ thể tại Đồng Nai không được bỏ trống.');
            isValid = false;
            if (!firstInvalidElement) firstInvalidElement = addressInput;
        } else {
            clearFieldError(addressInput, addressError);
        }

        // 6. Kiểm tra Ghi chú: Không được bỏ trống
        if (!noteVal) {
            setFieldError(noteTextarea, noteError, 'Ghi chú tình trạng không được bỏ trống để đội cứu trợ nắm bắt.');
            isValid = false;
            if (!firstInvalidElement) firstInvalidElement = noteTextarea;
        } else {
            clearFieldError(noteTextarea, noteError);
        }

        // Nếu có trường sai dữ liệu: Đưa con trỏ chuột vào ô sai đầu tiên và dừng (Không dùng alert())
        if (!isValid) {
            if (firstInvalidElement) firstInvalidElement.focus();
            return;
        }

        // 7. [YÊU CẦU]: TẠO TỌA ĐỘ NGẪU NHIÊN TRONG KHUNG BẢN ĐỒ (20% – 80%)
        // Công thức ngẫu nhiên: Math.random() * (max - min) + min
        const randomTop = +(Math.random() * (80 - 20) + 20).toFixed(1);
        const randomLeft = +(Math.random() * (80 - 20) + 20).toFixed(1);

        // Tạo mã ID duy nhất
        const newId = `REQ-${String(Date.now()).slice(-4)}`;

        // Tạo đối tượng yêu cầu mới
        const newRequest = {
            id: newId,
            name: nameVal,
            phone: phoneVal,
            address: addressVal,
            type: typeVal,
            status: 'dang-cho', // Mặc định trạng thái là Đang chờ
            note: noteVal,
            coords: {
                top: randomTop,
                left: randomLeft
            }
        };

        // 8. [YÊU CẦU]: LƯU VÀO LOCALSTORAGE BẰNG saveRequests()
        const requests = getRequests();
        requests.unshift(newRequest); // Thêm lên đầu danh sách để thấy ngay lập tức
        saveRequests(requests);

        // 9. [YÊU CẦU]: CẬP NHẬT DANH SÁCH NGAY LẬP TỨC
        renderRequestsList();

        // 10. Reset Form và hiển thị thông báo thành công
        form.reset();
        successMsgDetail.textContent = `Yêu cầu #${newId} của bạn đã được ghi nhận tại tọa độ ngẫu nhiên (${randomTop}%, ${randomLeft}%). Đội cứu trợ sẽ liên hệ theo SĐT ${phoneVal}.`;
        formSuccessBanner.style.display = 'flex';

        // Cuộn mượt đến vị trí thẻ vừa tạo
        setTimeout(() => {
            const newCard = document.getElementById(`card-${newId}`);
            if (newCard) {
                newCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                newCard.style.outline = '2px solid var(--color-primary)';
                newCard.style.boxShadow = '0 0 15px rgba(30, 58, 138, 0.25)';
            }
        }, 300);
    });

    // Đóng banner thông báo thành công
    if (closeSuccessBanner) {
        closeSuccessBanner.addEventListener('click', () => {
            formSuccessBanner.style.display = 'none';
        });
    }

    /**
     * Hàm phòng ngừa tấn công XSS khi render dữ liệu
     */
    function escapeHTML(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // Khởi tạo hiển thị danh sách ban đầu khi tải trang
    renderRequestsList();
});