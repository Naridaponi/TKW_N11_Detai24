/**
 * js/data.js - Quản lý Dữ liệu và Đồng bộ LocalStorage
 * Dự án: Bản đồ Cứu trợ & Kết nối Cộng đồng (Community Rescue Map)
 * Địa bàn mẫu: Tỉnh Đồng Nai
 */

// 1. Mảng dữ liệu mẫu ban đầu gồm 6 yêu cầu cứu trợ tại các khu vực Đồng Nai
const DEFAULT_REQUESTS = [
    {
        id: "REQ-001",
        name: "Nguyễn Văn Hùng",
        phone: "0912 345 678",
        address: "Khu phố 4, Phường Trảng Dài, TP. Biên Hòa, Đồng Nai",
        type: "thuc-pham",
        status: "dang-cho",
        note: "Gia đình 4 người (có 2 trẻ nhỏ) bị cô lập do ngập sâu, thiếu nước sạch và mì tôm.",
        coords: { top: 38.5, left: 45.2 } // % tọa độ trên bản đồ mô phỏng
    },
    {
        id: "REQ-002",
        name: "Trần Thị Lan",
        phone: "0988 765 432",
        address: "Xã Thiện Tân, Huyện Vĩnh Cửu, Đồng Nai",
        type: "y-te",
        status: "dang-cho",
        note: "Cụ bà 75 tuổi bị sốt cao kèm huyết áp, cần thuốc hạ sốt và hỗ trợ y tế khẩn cấp.",
        coords: { top: 28.0, left: 48.0 }
    },
    {
        id: "REQ-003",
        name: "Lê Văn Tuấn",
        phone: "0903 112 233",
        address: "Ấp 3, Xã Phước An, Huyện Nhơn Trạch, Đồng Nai",
        type: "noi-o",
        status: "dang-cho",
        note: "Nhà tốc mái hoàn toàn do dông lốc, cần chỗ trú tạm cho gia đình 5 người.",
        coords: { top: 72.4, left: 58.6 }
    },
    {
        id: "REQ-004",
        name: "Phạm Minh Đức",
        phone: "0934 556 677",
        address: "Thị trấn Long Thành, Huyện Long Thành, Đồng Nai",
        type: "y-te",
        status: "da-giup",
        note: "Đã có đội tình nguyện viên chuyển túi thuốc sơ cứu và bông băng đến nơi an toàn.",
        coords: { top: 58.2, left: 52.3 }
    },
    {
        id: "REQ-005",
        name: "Hoàng Thị Mai",
        phone: "0971 889 900",
        address: "Phường Xuân Lập, TP. Long Khánh, Đồng Nai",
        type: "thuc-pham",
        status: "dang-cho",
        note: "Xóm trọ công nhân bị chia cắt tạm thời, cần gạo, lương khô và sữa trẻ em.",
        coords: { top: 42.1, left: 75.8 }
    },
    {
        id: "REQ-006",
        name: "Đỗ Đình Bách",
        phone: "0965 223 344",
        address: "Xã Gia Tân 2, Huyện Thống Nhất, Đồng Nai",
        type: "noi-o",
        status: "da-giup",
        note: "Đã được đội cứu trợ sơ tán về điểm trường mầm non của xã, cần thêm chăn màn.",
        coords: { top: 34.6, left: 63.5 }
    }
];

// Khóa lưu trữ LocalStorage dùng chung
const STORAGE_KEY = 'COMMUNITY_RESCUE_REQUESTS';

/**
 * 2. Lấy danh sách yêu cầu từ LocalStorage
 * Nếu chưa có dữ liệu, khởi tạo bằng DEFAULT_REQUESTS
 * @returns {Array} Mảng các yêu cầu cứu trợ
 */
function getRequests() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            saveRequests(DEFAULT_REQUESTS);
            return [...DEFAULT_REQUESTS];
        }
        return JSON.parse(stored);
    } catch (error) {
        console.error("Lỗi khi đọc LocalStorage:", error);
        return [...DEFAULT_REQUESTS];
    }
}

/**
 * 3. Lưu mảng danh sách yêu cầu vào LocalStorage
 * @param {Array} requests - Mảng các yêu cầu cần lưu
 */
function saveRequests(requests) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    } catch (error) {
        console.error("Lỗi khi ghi LocalStorage:", error);
    }
}

/**
 * 4. Chuyển đổi mã loại cứu trợ (type) sang tiếng Việt
 * @param {string} type - 'y-te' | 'thuc-pham' | 'noi-o'
 * @returns {string} Tên tiếng Việt thân thiện
 */
function getTypeLabel(type) {
    const typeMap = {
        'y-te': 'Y tế & Thuốc men',
        'thuc-pham': 'Lương thực & Nước',
        'noi-o': 'Chỗ ở & Trú ẩn'
    };
    return typeMap[type] || 'Nhu cầu khác';
}

/**
 * 5. Chuyển đổi mã trạng thái (status) sang tiếng Việt
 * @param {string} status - 'dang-cho' | 'da-giup'
 * @returns {string} Trạng thái tiếng Việt
 */
function getStatusLabel(status) {
    const statusMap = {
        'dang-cho': 'Đang chờ hỗ trợ',
        'da-giup': 'Đã được cứu trợ'
    };
    return statusMap[status] || 'Không xác định';
}

/**
 * Hàm phụ trợ: Lấy class CSS tương ứng với loại nhu cầu
 * @param {string} type 
 * @returns {string}
 */
function getTypeBadgeClass(type) {
    const classMap = {
        'y-te': 'badge-medical',
        'thuc-pham': 'badge-food',
        'noi-o': 'badge-shelter'
    };
    return classMap[type] || 'badge-default';
}

/**
 * Hàm phụ trợ: Lấy class CSS tương ứng với trạng thái
 * @param {string} status 
 * @returns {string}
 */
function getStatusBadgeClass(status) {
    return status === 'da-giup' ? 'badge-done' : 'badge-pending';
}