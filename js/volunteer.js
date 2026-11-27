/**
 * js/volunteer.js - Xử lý Form Đăng Ký Tình Nguyện Viên & Lưu LocalStorage
 * Dự án: Bản đồ Cứu trợ & Kết nối Cộng đồng (Community Rescue Map)
 */

document.addEventListener('DOMContentLoaded', () => {
    // [YÊU CẦU]: Khóa lưu trữ LocalStorage cho Tình nguyện viên là 'volunteers'
    const VOLUNTEERS_STORAGE_KEY = 'volunteers';

    // 1. DOM Elements của Form
    const form = document.getElementById('volunteerForm');
    const nameInput = document.getElementById('volName');
    const phoneInput = document.getElementById('volPhone');
    const emailInput = document.getElementById('volEmail');
    const areaSelect = document.getElementById('volArea');
    const skillCheckboxes = document.querySelectorAll('input[name="skills"]');

    // Các thẻ hiển thị lỗi trực tiếp bên dưới ô nhập
    const nameError = document.getElementById('nameError');
    const phoneError = document.getElementById('phoneError');
    const emailError = document.getElementById('emailError');
    const areaError = document.getElementById('areaError');
    const skillsError = document.getElementById('skillsError');

    // Toast thông báo thành công
    const toastBanner = document.getElementById('toastSuccessBanner');
    const toastMsgText = document.getElementById('toastMsgText');

    // DOM Elements của danh sách tình nguyện viên
    const volunteersContainer = document.getElementById('volunteersContainer');
    const volunteersCountBadge = document.getElementById('volunteersCountBadge');

    // Hiệu ứng tương tác chọn Checkbox Card
    skillCheckboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            const cardLabel = cb.closest('.checkbox-card');
            if (cb.checked) {
                cardLabel.classList.add('selected');
            } else {
                cardLabel.classList.remove('selected');
            }
            // Xóa lỗi kỹ năng nếu người dùng đã chọn ít nhất 1 mục
            if (isAnySkillSelected()) {
                skillsError.textContent = '';
            }
        });
    });

    /**
     * 2. Lấy danh sách tình nguyện viên từ LocalStorage (key: volunteers)
     * Khởi tạo sẵn một vài tình nguyện viên mẫu tại Đồng Nai nếu chưa có
     */
    function getVolunteers() {
        try {
            const data = localStorage.getItem(VOLUNTEERS_STORAGE_KEY);
            if (!data) {
                const defaultVolunteers = [
                    {
                        id: "VOL-101",
                        name: "CLB Xe Bán Tải Cứu Hộ Biên Hòa",
                        phone: "0908 123 456",
                        email: "bantai.bienhoa@gmail.com",
                        area: "TP. Biên Hòa",
                        skills: ["Vận chuyển", "Cung cấp nhu yếu phẩm"],
                        registeredAt: "10:30 27/11/2026"
                    },
                    {
                        id: "VOL-102",
                        name: "Bác sĩ Nguyễn Hoàng Quân",
                        phone: "0918 999 888",
                        email: "bs.hoangquan@gmail.com",
                        area: "Huyện Vĩnh Cửu",
                        skills: ["Hỗ trợ y tế"],
                        registeredAt: "11:15 27/11/2026"
                    },
                    {
                        id: "VOL-103",
                        name: "Đoàn Tình Nguyện Phản Ứng Nhanh Long Khánh",
                        phone: "0933 555 777",
                        email: "phanungnhanh.lk@gmail.com",
                        area: "TP. Long Khánh",
                        skills: ["Vận chuyển", "Hỗ trợ y tế", "Cung cấp nhu yếu phẩm", "Chỗ ở tạm thời"],
                        registeredAt: "12:00 27/11/2026"
                    }
                ];
                localStorage.setItem(VOLUNTEERS_STORAGE_KEY, JSON.stringify(defaultVolunteers));
                return defaultVolunteers;
            }
            return JSON.parse(data);
        } catch (error) {
            console.error("Lỗi khi đọc LocalStorage volunteers:", error);
            return [];
        }
    }

    /**
     * 3. Lưu mảng tình nguyện viên vào LocalStorage
     */
    function saveVolunteers(volunteers) {
        try {
            localStorage.setItem(VOLUNTEERS_STORAGE_KEY, JSON.stringify(volunteers));
        } catch (error) {
            console.error("Lỗi khi lưu LocalStorage volunteers:", error);
        }
    }

    /**
     * 4. Kiểm tra xem người dùng đã chọn ít nhất 1 khả năng hỗ trợ chưa
     */
    function isAnySkillSelected() {
        return Array.from(skillCheckboxes).some(cb => cb.checked);
    }

    /**
     * 5. Hiển thị thông báo lỗi màu đỏ trực tiếp dưới từng ô nhập sai (Không dùng alert())
     */
    function setFieldError(inputEl, errorEl, message) {
        if (inputEl) inputEl.classList.add('has-error');
        errorEl.textContent = `⚠️ ${message}`;
    }

    /**
     * 6. Xóa lỗi trực tiếp của ô nhập
     */
    function clearFieldError(inputEl, errorEl) {
        if (inputEl) inputEl.classList.remove('has-error');
        errorEl.textContent = '';
    }

    // Lắng nghe xóa lỗi ngay khi người dùng bắt đầu chỉnh sửa
    nameInput.addEventListener('input', () => clearFieldError(nameInput, nameError));
    phoneInput.addEventListener('input', () => clearFieldError(phoneInput, phoneError));
    emailInput.addEventListener('input', () => clearFieldError(emailInput, emailError));
    areaSelect.addEventListener('change', () => clearFieldError(areaSelect, areaError));

    /**
     * 7. Xử lý Submit Form và Validation chuẩn xác
     */
    form.addEventListener('submit', (e) => {
        // [YÊU CẦU]: Dùng event.preventDefault() để ngăn submit mặc định
        e.preventDefault();

        // Thu thập dữ liệu từ các trường
        const nameVal = nameInput.value.trim();
        const phoneVal = phoneInput.value.trim();
        const emailVal = emailInput.value.trim();
        const areaVal = areaSelect.value;

        // Thu thập các khả năng đã chọn từ Checkbox
        const selectedSkills = Array.from(skillCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        let isValid = true;
        let firstInvalidField = null;

        // [VALIDATION 1]: Kiểm tra Họ tên / Tên tổ chức không được bỏ trống
        if (!nameVal) {
            setFieldError(nameInput, nameError, 'Họ tên hoặc Tên tổ chức không được để trống.');
            isValid = false;
            if (!firstInvalidField) firstInvalidField = nameInput;
        } else {
            clearFieldError(nameInput, nameError);
        }

        // [VALIDATION 2]: SĐT phải đúng 10 số bắt đầu bằng 0 (Dùng Regex: /^0[0-9]{9}$/)
        const phoneRegex = /^0[0-9]{9}$/;
        if (!phoneVal) {
            setFieldError(phoneInput, phoneError, 'Số điện thoại không được để trống.');
            isValid = false;
            if (!firstInvalidField) firstInvalidField = phoneInput;
        } else if (!phoneRegex.test(phoneVal)) {
            setFieldError(phoneInput, phoneError, 'Số điện thoại phải gồm đúng 10 chữ số và bắt đầu bằng số 0 (Ví dụ: 0912345678).');
            isValid = false;
            if (!firstInvalidField) firstInvalidField = phoneInput;
        } else {
            clearFieldError(phoneInput, phoneError);
        }

        // [VALIDATION 3]: Kiểm tra định dạng Email bằng Regex
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailVal) {
            setFieldError(emailInput, emailError, 'Địa chỉ email không được để trống.');
            isValid = false;
            if (!firstInvalidField) firstInvalidField = emailInput;
        } else if (!emailRegex.test(emailVal)) {
            setFieldError(emailInput, emailError, 'Email không đúng định dạng chuẩn (Ví dụ: hotro.dongnai@gmail.com).');
            isValid = false;
            if (!firstInvalidField) firstInvalidField = emailInput;
        } else {
            clearFieldError(emailInput, emailError);
        }

        // [VALIDATION 4]: Kiểm tra Khu vực phụ trách không được bỏ trống
        if (!areaVal) {
            setFieldError(areaSelect, areaError, 'Vui lòng chọn khu vực bạn có thể hỗ trợ tại Đồng Nai.');
            isValid = false;
            if (!firstInvalidField) firstInvalidField = areaSelect;
        } else {
            clearFieldError(areaSelect, areaError);
        }

        // [VALIDATION 5]: Bắt buộc chọn ít nhất 1 khả năng hỗ trợ
        if (selectedSkills.length === 0) {
            setFieldError(null, skillsError, 'Vui lòng chọn ít nhất 1 khả năng bạn hoặc tổ chức có thể hỗ trợ.');
            isValid = false;
            if (!firstInvalidField) firstInvalidField = skillCheckboxes[0];
        } else {
            skillsError.textContent = '';
        }

        // Nếu có lỗi, đưa trỏ chuột vào ô lỗi đầu tiên và dừng (Không dùng alert())
        if (!isValid) {
            if (firstInvalidField) firstInvalidField.focus();
            return;
        }

        // [YÊU CẦU]: ĐĂNG KÝ THÀNH CÔNG -> LƯU VÀO LOCALSTORAGE (KEY volunteers)
        const now = new Date();
        const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;

        const newVolunteer = {
            id: `VOL-${String(Date.now()).slice(-4)}`,
            name: nameVal,
            phone: phoneVal,
            email: emailVal,
            area: areaVal,
            skills: selectedSkills,
            registeredAt: timeString
        };

        const volunteersList = getVolunteers();
        volunteersList.unshift(newVolunteer); // Đưa người đăng ký mới lên đầu danh sách
        saveVolunteers(volunteersList);

        // Reset form và giao diện các checkbox card
        form.reset();
        document.querySelectorAll('.checkbox-card').forEach(c => c.classList.remove('selected'));

        // [YÊU CẦU]: THÔNG BÁO THÀNH CÔNG MƯỢT MÀ, TỰ ĐỘNG ẨN SAU 3 GIÂY BẰNG setTimeout
        toastMsgText.textContent = `Cảm ơn ${newVolunteer.name}! Bạn đã đăng ký tham gia mạng lưới tình nguyện viên thành công.`;
        toastBanner.classList.add('show');

        setTimeout(() => {
            toastBanner.classList.remove('show');
        }, 3000); // Tự ẩn sau 3 giây

        // [YÊU CẦU]: HIỂN THỊ DANH SÁCH TÌNH NGUYỆN VIÊN VỪA ĐĂNG KÝ Ở BÊN DƯỚI
        renderVolunteersList();

        // Cuộn mượt đến thẻ tình nguyện viên vừa xuất hiện
        setTimeout(() => {
            const newlyCreatedCard = document.getElementById(`vol-card-${newVolunteer.id}`);
            if (newlyCreatedCard) {
                newlyCreatedCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                newlyCreatedCard.style.outline = '2px solid var(--color-primary)';
                newlyCreatedCard.style.boxShadow = '0 0 15px rgba(30, 58, 138, 0.3)';
            }
        }, 300);
    });

    /**
     * 8. Hàm render danh sách tình nguyện viên ra màn hình
     */
    function renderVolunteersList() {
        const list = getVolunteers();
        volunteersCountBadge.textContent = `${list.length} tình nguyện viên`;

        if (list.length === 0) {
            volunteersContainer.innerHTML = `
                <div class="empty-volunteers-box">
                    <span style="font-size: 2.5rem; display: block; margin-bottom: 0.5rem;">🤝</span>
                    <h4>Chưa có tình nguyện viên nào đăng ký</h4>
                    <p style="font-size: 0.88rem; margin-top: 0.25rem;">Hãy là người đầu tiên tham gia vào mạng lưới cứu trợ Đồng Nai!</p>
                </div>
            `;
            return;
        }

        volunteersContainer.innerHTML = list.map(vol => {
            const cleanPhone = vol.phone.replace(/\s+/g, '');
            const skillsBadges = vol.skills.map(s => `<span class="skill-tag">${escapeHTML(s)}</span>`).join('');

            return `
                <article class="volunteer-card" id="vol-card-${vol.id}">
                    <div>
                        <div class="vol-card-top">
                            <span style="font-size: 0.75rem; font-weight: 800; color: var(--text-muted);">${vol.id}</span>
                            <span class="badge badge-done" style="font-size: 0.72rem;">Sẵn sàng hỗ trợ</span>
                        </div>

                        <h4 class="vol-card-name">${escapeHTML(vol.name)}</h4>
                        
                        <p class="vol-card-area">
                            <span>📍 Khu vực:</span>
                            <strong>${escapeHTML(vol.area)}</strong>
                        </p>

                        <div style="margin-top: 0.5rem;">
                            <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-secondary); display: block; margin-bottom: 0.35rem;">
                                Khả năng hỗ trợ:
                            </span>
                            <div class="vol-skills-tags">
                                ${skillsBadges}
                            </div>
                        </div>
                    </div>

                    <div class="vol-card-contacts">
                        <a href="tel:${cleanPhone}" class="vol-contact-link">
                            📞 <strong>${escapeHTML(vol.phone)}</strong>
                        </a>
                        <a href="mailto:${escapeHTML(vol.email)}" class="vol-contact-link" style="color: var(--text-secondary); font-size: 0.8rem;">
                            ✉️ ${escapeHTML(vol.email)}
                        </a>
                        <div class="vol-time-tag">
                            Đăng ký lúc: ${escapeHTML(vol.registeredAt || 'Vừa xong')}
                        </div>
                    </div>
                </article>
            `;
        }).join('');
    }

    /**
     * Hàm phòng ngừa tấn công XSS
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
    renderVolunteersList();
});