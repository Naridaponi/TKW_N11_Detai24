// ============================================================
// js/requests.js
// Xử lý logic cho trang Yêu cầu Cứu trợ
// Phụ thuộc: js/data.js (getRequests, saveRequests, getTypeLabel, getStatusLabel)
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

    // ========== THAM CHIẾU DOM ==========
    const requestForm    = document.getElementById('requestForm');
    const requestsGrid   = document.getElementById('requestsGrid');
    const emptyState     = document.getElementById('emptyState');
    const filterButtons  = document.querySelectorAll('.filter-btn');
    const navbarToggle   = document.getElementById('navbarToggle');
    const navbarNav      = document.querySelector('.navbar-nav');

    // Trạng thái lọc hiện tại
    let currentFilter = 'all';

    // ========== NAVBAR TOGGLE (mobile) ==========
    if (navbarToggle && navbarNav) {
        navbarToggle.addEventListener('click', () => {
            navbarNav.classList.toggle('open');
        });
    }

    // ============================================================
    // 1. RENDER DANH SÁCH THẺ (CARDS)
    // ============================================================

    /**
     * Lấy class màu cho badge loại nhu cầu
     * @param {string} type - Mã loại (y-te, thuc-pham, noi-o)
     * @returns {string} CSS class
     */
    function getTypeBadgeClass(type) {
        const map = {
            'y-te':      'badge-yte',
            'thuc-pham': 'badge-thucpham',
            'noi-o':     'badge-noio'
        };
        return map[type] || 'badge-default';
    }

    /**
     * Lấy class màu cho badge trạng thái
     * @param {string} status - Mã trạng thái (pending, helped)
     * @returns {string} CSS class
     */
    function getStatusBadgeClass(status) {
        const map = {
            'pending': 'badge-pending',
            'helped':  'badge-helped'
        };
        return map[status] || 'badge-default';
    }

    /**
     * Lấy emoji cho loại nhu cầu
     */
    function getTypeEmoji(type) {
        const map = {
            'y-te':      '🏥',
            'thuc-pham': '🍚',
            'noi-o':     '🏠'
        };
        return map[type] || '📌';
    }

    /**
     * Render danh sách yêu cầu dựa trên bộ lọc hiện tại
     */
    function renderRequests() {
        const allRequests = getRequests();

        // Áp dụng .filter() theo trạng thái
        const filtered = currentFilter === 'all'
            ? allRequests
            : allRequests.filter(req => req.status === currentFilter);

        // Nếu không có dữ liệu → hiện empty state
        if (filtered.length === 0) {
            requestsGrid.innerHTML = '';
            emptyState.style.display = 'flex';
            return;
        }

        emptyState.style.display = 'none';

        // Dùng .map() để đổ dữ liệu thành HTML cards
        requestsGrid.innerHTML = filtered.map(req => {
            const typeLabel   = getTypeLabel(req.type);
            const statusLabel = getStatusLabel(req.status);
            const typeBadge   = getTypeBadgeClass(req.type);
            const statusBadge = getStatusBadgeClass(req.status);
            const typeEmoji   = getTypeEmoji(req.type);

            // Format ngày tạo
            const createdDate = req.createdAt
                ? new Date(req.createdAt).toLocaleDateString('vi-VN', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })
                : 'Không rõ';

            return `
                <div class="request-card">
                    <div class="card-header">
                        <span class="badge ${typeBadge}">${typeEmoji} ${typeLabel}</span>
                        <span class="badge ${statusBadge}">${statusLabel}</span>
                    </div>
                    <div class="card-body">
                        <h3 class="card-name">👤 ${escapeHtml(req.name)}</h3>
                        <p class="card-address">📍 ${escapeHtml(req.address)}</p>
                        <p class="card-phone">
                            📞 <a href="tel:${escapeHtml(req.phone)}" class="phone-link">${escapeHtml(req.phone)}</a>
                        </p>
                        ${req.note ? `<p class="card-note">📝 ${escapeHtml(req.note)}</p>` : ''}
                    </div>
                    <div class="card-footer">
                        <span class="card-date">🕐 ${createdDate}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Escape HTML để chống XSS
     */
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ============================================================
    // 2. BỘ LỌC TRẠNG THÁI (dùng .filter())
    // ============================================================

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Cập nhật trạng thái active
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Lưu bộ lọc và render lại
            currentFilter = btn.dataset.filter;
            renderRequests();
        });
    });

    // ============================================================
    // 3. FORM GỬI YÊU CẦU MỚI + VALIDATION
    // ============================================================

    /**
     * Xóa tất cả thông báo lỗi
     */
    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
            el.style.display = 'none';
        });
        document.querySelectorAll('.form-group').forEach(el => {
            el.classList.remove('has-error');
        });
    }

    /**
     * Hiển thị lỗi ngay dưới ô nhập
     * @param {string} fieldId - ID của ô input
     * @param {string} message - Nội dung lỗi
     */
    function showError(fieldId, message) {
        const errorEl = document.getElementById(fieldId + 'Error');
        const inputEl = document.getElementById(fieldId);
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
        }
        if (inputEl) {
            inputEl.closest('.form-group').classList.add('has-error');
        }
    }

    /**
     * Kiểm tra dữ liệu form (Validation)
     * @returns {boolean} true nếu hợp lệ
     */
    function validateForm() {
        clearErrors();
        let isValid = true;

        // Lấy giá trị
        const fullName = document.getElementById('fullName').value.trim();
        const phone    = document.getElementById('phone').value.trim();
        const address  = document.getElementById('address').value.trim();
        const type     = document.getElementById('type').value;

        // Kiểm tra Họ tên — không được bỏ trống
        if (!fullName) {
            showError('fullName', 'Vui lòng nhập họ và tên.');
            isValid = false;
        }

        // Kiểm tra SĐT: đúng 10 chữ số, bắt đầu bằng 0 (Regex)
        const phoneRegex = /^0\d{9}$/;
        if (!phone) {
            showError('phone', 'Vui lòng nhập số điện thoại.');
            isValid = false;
        } else if (!phoneRegex.test(phone)) {
            showError('phone', 'Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0.');
            isValid = false;
        }

        // Kiểm tra Địa chỉ — không được bỏ trống
        if (!address) {
            showError('address', 'Vui lòng nhập địa chỉ.');
            isValid = false;
        }

        // Kiểm tra Loại nhu cầu — phải chọn
        if (!type) {
            showError('type', 'Vui lòng chọn loại nhu cầu.');
            isValid = false;
        }

        return isValid;
    }

    /**
     * Tạo tọa độ ngẫu nhiên trong khung bản đồ (20% – 80%)
     * @returns {{ x: number, y: number }}
     */
    function generateRandomCoords() {
        // Tạo giá trị từ 20% đến 80% (phạm vi 60%, offset 20%)
        const x = Math.random() * 60 + 20; // 20 – 80
        const y = Math.random() * 60 + 20; // 20 – 80
        return {
            x: parseFloat(x.toFixed(2)),
            y: parseFloat(y.toFixed(2))
        };
    }

    // Xử lý submit form
    requestForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Validate
        if (!validateForm()) {
            return;
        }

        // Lấy dữ liệu
        const fullName = document.getElementById('fullName').value.trim();
        const phone    = document.getElementById('phone').value.trim();
        const address  = document.getElementById('address').value.trim();
        const type     = document.getElementById('type').value;
        const note     = document.getElementById('note').value.trim();

        // Tạo tọa độ ngẫu nhiên
        const coords = generateRandomCoords();

        // Tạo object yêu cầu mới
        const newRequest = {
            id: Date.now(),                // ID duy nhất
            name: fullName,
            phone: phone,
            address: address,
            type: type,                    // 'y-te' | 'thuc-pham' | 'noi-o'
            note: note,
            status: 'pending',             // Mặc định: Đang chờ
            coords: coords,               // { x, y } trong khung bản đồ
            createdAt: new Date().toISOString()
        };

        // Lưu vào localStorage
        const requests = getRequests();
        requests.push(newRequest);
        saveRequests(requests);

        // Reset form
        requestForm.reset();
        clearErrors();

        // Hiển thị thông báo thành công
        showSuccessMessage();

        // Cập nhật danh sách ngay lập tức
        renderRequests();
    });

    /**
     * Hiển thị thông báo thành công tạm thời
     */
    function showSuccessMessage() {
        // Xóa thông báo cũ nếu có
        const existing = document.querySelector('.success-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'success-toast';
        toast.innerHTML = '✅ Gửi yêu cầu cứu trợ thành công!';
        document.body.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Tự động ẩn sau 3 giây
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ============================================================
    // 4. KHỞI TẠO
    // ============================================================

    renderRequests();
});