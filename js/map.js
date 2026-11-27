/**
 * js/map.js - Xử lý Bản đồ, Vẽ Marker (.map()), Lọc (.filter()) và Popup Chi tiết
 * Dự án: Bản đồ Cứu trợ & Kết nối Cộng đồng (Community Rescue Map)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Lấy dữ liệu danh sách yêu cầu từ js/data.js thông qua LocalStorage
    const allRequests = getRequests();
    let currentFilterStatus = 'all'; // 'all' | 'dang-cho' | 'da-giup'

    // DOM Elements
    const markersLayer = document.getElementById('markersLayer');
    const filterButtons = document.querySelectorAll('.status-btn');
    const popupOverlay = document.getElementById('popupOverlay');
    const popupCard = document.getElementById('popupCard');
    const popupCloseBtn = document.getElementById('popupCloseBtn');
    const popupCloseFooterBtn = document.getElementById('popupCloseFooterBtn');

    // Các trường dữ liệu trong Popup
    const popupId = document.getElementById('popupId');
    const popupName = document.getElementById('popupName');
    const popupPhone = document.getElementById('popupPhone');
    const popupCallBtn = document.getElementById('popupCallBtn');
    const popupAddress = document.getElementById('popupAddress');
    const popupTypeBadge = document.getElementById('popupTypeBadge');
    const popupStatusBadge = document.getElementById('popupStatusBadge');
    const popupNote = document.getElementById('popupNote');

    /**
     * 2. Lấy icon tương ứng với loại nhu cầu
     * @param {string} type - 'y-te' | 'thuc-pham' | 'noi-o'
     */
    function getMarkerIcon(type) {
        switch (type) {
            case 'y-te': return '🩺';
            case 'thuc-pham': return '🍞';
            case 'noi-o': return '🏠';
            default: return '📍';
        }
    }

    /**
     * 3. Lấy class màu sắc Marker theo đúng yêu cầu:
     * - Đỏ: Y tế (marker-medical: có hiệu ứng nhấp nháy pulse)
     * - Cam: Thực phẩm (marker-food)
     * - Xanh dương: Nơi ở (marker-shelter)
     */
    function getMarkerColorClass(type) {
        switch (type) {
            case 'y-te': return 'marker-medical';
            case 'thuc-pham': return 'marker-food';
            case 'noi-o': return 'marker-shelter';
            default: return 'marker-food';
        }
    }

    /**
     * 4. HÀM VẼ MARKER LÊN BẢN ĐỒ
     * - Dùng .filter() khi bấm nút lọc để lọc dữ liệu
     * - Dùng .map() để tự động duyệt mảng và khởi tạo Marker theo tọa độ coords.top, coords.left
     */
    function renderMarkers() {
        // [YÊU CẦU]: Dùng hàm .filter() để lọc danh sách theo trạng thái
        const filteredRequests = allRequests.filter(req => {
            if (currentFilterStatus === 'all') return true;
            return req.status === currentFilterStatus;
        });

        // Xóa các marker cũ trước khi vẽ lại
        markersLayer.innerHTML = '';

        // [YÊU CẦU]: Dùng hàm .map() để tự động vẽ các Marker theo tọa độ coords.top & coords.left
        const markerElements = filteredRequests.map(req => {
            const marker = document.createElement('div');
            
            // Gán class màu sắc và trạng thái
            const colorClass = getMarkerColorClass(req.type);
            const isDoneClass = req.status === 'da-giup' ? 'is-done' : '';

            marker.className = `map-marker ${colorClass} ${isDoneClass}`;
            marker.style.top = `${req.coords.top}%`;
            marker.style.left = `${req.coords.left}%`;
            marker.setAttribute('role', 'button');
            marker.setAttribute('aria-label', `Điểm cứu trợ ${req.name}`);
            marker.title = `${req.name} - ${getTypeLabel(req.type)} (${getStatusLabel(req.status)})`;

            // Nội dung bên trong Marker
            marker.innerHTML = `
                <span>${getMarkerIcon(req.type)}</span>
                ${req.status === 'da-giup' ? '<span class="status-check" title="Đã được giúp">✓</span>' : ''}
            `;

            // Sự kiện nhấp Marker: Mở hộp thoại Popup chi tiết
            marker.addEventListener('click', (e) => {
                e.stopPropagation();
                openPopup(req);
            });

            return marker;
        });

        // Đưa mảng các Marker đã tạo vào khung bản đồ
        markerElements.forEach(markerEl => markersLayer.appendChild(markerEl));
    }

    /**
     * 5. HÀM HIỂN THỊ POPUP CHI TIẾT
     * Hiển thị: Tên, SĐT (link tel:), Địa chỉ, Loại nhu cầu, Trạng thái, Ghi chú
     */
    function openPopup(req) {
        popupId.textContent = req.id || 'REQ-INFO';
        popupName.textContent = req.name;
        
        // Cập nhật SĐT với thẻ tel: để bấm gọi trực tiếp trên điện thoại
        const cleanPhone = req.phone.replace(/\s+/g, '');
        popupPhone.href = `tel:${cleanPhone}`;
        popupPhone.textContent = `📞 ${req.phone}`;
        popupCallBtn.href = `tel:${cleanPhone}`;

        // Địa chỉ
        popupAddress.textContent = req.address;

        // Loại nhu cầu và Trạng thái (sử dụng hàm từ js/data.js)
        popupTypeBadge.textContent = `${getMarkerIcon(req.type)} ${getTypeLabel(req.type)}`;
        popupTypeBadge.className = `badge ${getTypeBadgeClass(req.type)}`;

        popupStatusBadge.textContent = getStatusLabel(req.status);
        popupStatusBadge.className = `badge ${getStatusBadgeClass(req.status)}`;

        // Ghi chú
        popupNote.textContent = req.note ? `"${req.note}"` : 'Không có ghi chú thêm.';

        // Mở Popup
        popupOverlay.style.display = 'flex';
    }

    /**
     * 6. HÀM ĐÓNG POPUP
     */
    function closePopup() {
        popupOverlay.style.display = 'none';
    }

    // Đóng khi bấm nút 'X' hoặc nút 'Đóng' ở footer
    popupCloseBtn.addEventListener('click', closePopup);
    popupCloseFooterBtn.addEventListener('click', closePopup);

    // Đóng khi bấm ra ngoài hộp thoại
    popupOverlay.addEventListener('click', (e) => {
        if (!popupCard.contains(e.target)) {
            closePopup();
        }
    });

    // Đóng khi bấm phím Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popupOverlay.style.display === 'flex') {
            closePopup();
        }
    });

    /**
     * 7. XỬ LÝ SỰ KIỆN 3 NÚT LỌC TRẠNG THÁI ('Tất cả', 'Đang chờ', 'Đã được giúp')
     */
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Cập nhật class active cho nút vừa bấm
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Cập nhật biến trạng thái và gọi renderMarkers() dùng .filter() & .map()
            currentFilterStatus = btn.dataset.status;
            renderMarkers();
        });
    });

    // 8. Khởi chạy vẽ ban đầu khi tải trang
    renderMarkers();
});