/**
 * Volunteer registration form validation, localStorage persistence,
 * smooth notification handling, and registered volunteers rendering.
 */

const STORAGE_KEY = "volunteers";
const PHONE_REGEX = /^0\d{9}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const SUCCESS_HIDE_DELAY_MS = 3000;

const CAPABILITY_BADGE_CLASSES = {
  "Vận chuyển": "capability-badge--transport",
  "Hỗ trợ y tế": "capability-badge--medical",
  "Cung cấp nhu yếu phẩm": "capability-badge--supplies",
  "Chỗ ở tạm thời": "capability-badge--shelter",
};

let successTimerId = null;
let activeFilter = "all";

document.addEventListener("DOMContentLoaded", () => {
  initNavbarToggle();
  initVolunteerPage();
});

/**
 * Toggle mobile navigation menu when hamburger button is clicked.
 */
function initNavbarToggle() {
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  if (!navToggle || !navLinks) return;

  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

/**
 * Initialize form listeners, filter pills, and initial volunteer list render.
 */
function initVolunteerPage() {
  const form = document.getElementById("volunteerForm");
  if (!form) return;

  const fullNameInput = document.getElementById("fullName");
  const phoneInput = document.getElementById("phone");
  const emailInput = document.getElementById("email");
  const areaInput = document.getElementById("area");
  const capabilityCheckboxes = document.querySelectorAll('input[name="capabilities"]');

  form.addEventListener("submit", handleVolunteerSubmit);

  // Clear field-specific error as soon as the user corrects input
  const fieldBindings = [
    { input: fullNameInput, groupId: "fullNameGroup", errorId: "fullNameError" },
    { input: phoneInput, groupId: "phoneGroup", errorId: "phoneError" },
    { input: emailInput, groupId: "emailGroup", errorId: "emailError" },
    { input: areaInput, groupId: "areaGroup", errorId: "areaError" },
  ];

  fieldBindings.forEach(({ input, groupId, errorId }) => {
    if (!input) return;
    input.addEventListener("input", () => {
      clearFieldError(
        document.getElementById(groupId),
        document.getElementById(errorId),
        input
      );
    });
  });

  const capabilitiesGroup = document.getElementById("capabilitiesGroup");
  const capabilitiesError = document.getElementById("capabilitiesError");
  capabilityCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const hasChecked = Array.from(capabilityCheckboxes).some((cb) => cb.checked);
      if (hasChecked) {
        clearFieldError(capabilitiesGroup, capabilitiesError);
      }
    });
  });

  initFilterButtons();
  renderVolunteersList();
}

/**
 * Bind capability filter pills above the registered volunteer cards.
 */
function initFilterButtons() {
  const filterContainer = document.getElementById("capabilityFilters");
  if (!filterContainer) return;

  filterContainer.addEventListener("click", (event) => {
    const button = event.target.closest(".filter-pill");
    if (!button) return;

    setActiveFilter(button.dataset.filter || "all");
    renderVolunteersList();
  });
}

function setActiveFilter(filterValue) {
  activeFilter = filterValue;
  const pills = document.querySelectorAll("#capabilityFilters .filter-pill");
  pills.forEach((pill) => {
    pill.classList.toggle("active", pill.dataset.filter === filterValue);
  });
}

/**
 * Handle volunteer registration submission with validation and persistence.
 * @param {SubmitEvent} event
 */
function handleVolunteerSubmit(event) {
  event.preventDefault();

  const validation = validateVolunteerForm();
  if (!validation.isValid) {
    return;
  }

  const newVolunteer = {
    id: `vol_${Date.now()}`,
    ...validation.data,
    createdAt: new Date().toISOString(),
  };

  saveVolunteerToStorage(newVolunteer);

  const form = event.currentTarget;
  form.reset();
  clearAllFormErrors();

  // Reset filter to 'all' so the newly added volunteer is always immediately visible
  setActiveFilter("all");
  renderVolunteersList();
  showSuccessNotification(
    `Cảm ơn ${newVolunteer.fullName} đã đăng ký tham gia hỗ trợ tại khu vực ${newVolunteer.area}.`
  );
}

/**
 * Validate all required form fields, phone/email Regex formats, and checkbox group.
 * Displays red error messages directly beneath invalid inputs.
 * @returns {{ isValid: boolean, data: object | null }}
 */
function validateVolunteerForm() {
  const fullNameInput = document.getElementById("fullName");
  const phoneInput = document.getElementById("phone");
  const emailInput = document.getElementById("email");
  const areaInput = document.getElementById("area");

  const fullNameGroup = document.getElementById("fullNameGroup");
  const phoneGroup = document.getElementById("phoneGroup");
  const emailGroup = document.getElementById("emailGroup");
  const areaGroup = document.getElementById("areaGroup");
  const capabilitiesGroup = document.getElementById("capabilitiesGroup");

  const fullNameError = document.getElementById("fullNameError");
  const phoneError = document.getElementById("phoneError");
  const emailError = document.getElementById("emailError");
  const areaError = document.getElementById("areaError");
  const capabilitiesError = document.getElementById("capabilitiesError");

  const fullName = fullNameInput.value.trim();
  const phone = phoneInput.value.trim();
  const email = emailInput.value.trim();
  const area = areaInput.value.trim();
  const capabilities = Array.from(
    document.querySelectorAll('input[name="capabilities"]:checked')
  ).map((checkbox) => checkbox.value);

  let isValid = true;
  let firstInvalidElement = null;

  const failField = (containerEl, errorEl, message, focusEl) => {
    showFieldError(containerEl, errorEl, message, focusEl);
    isValid = false;
    if (!firstInvalidElement && focusEl) {
      firstInvalidElement = focusEl;
    }
  };

  if (!fullName) {
    failField(
      fullNameGroup,
      fullNameError,
      "Vui lòng nhập họ tên hoặc tên tổ chức.",
      fullNameInput
    );
  } else {
    clearFieldError(fullNameGroup, fullNameError, fullNameInput);
  }

  if (!phone) {
    failField(phoneGroup, phoneError, "Vui lòng nhập số điện thoại.", phoneInput);
  } else if (!PHONE_REGEX.test(phone)) {
    failField(
      phoneGroup,
      phoneError,
      "Số điện thoại phải gồm đúng 10 chữ số và bắt đầu bằng số 0 (VD: 0912345678).",
      phoneInput
    );
  } else {
    clearFieldError(phoneGroup, phoneError, phoneInput);
  }

  if (!email) {
    failField(emailGroup, emailError, "Vui lòng nhập địa chỉ email.", emailInput);
  } else if (!EMAIL_REGEX.test(email)) {
    failField(
      emailGroup,
      emailError,
      "Email không đúng định dạng (VD: ten@example.com).",
      emailInput
    );
  } else {
    clearFieldError(emailGroup, emailError, emailInput);
  }

  if (!area) {
    failField(
      areaGroup,
      areaError,
      "Vui lòng nhập khu vực có thể hỗ trợ.",
      areaInput
    );
  } else {
    clearFieldError(areaGroup, areaError, areaInput);
  }

  if (capabilities.length === 0) {
    const firstCheckbox = document.querySelector('input[name="capabilities"]');
    failField(
      capabilitiesGroup,
      capabilitiesError,
      "Vui lòng chọn ít nhất 1 khả năng hỗ trợ.",
      firstCheckbox
    );
  } else {
    clearFieldError(capabilitiesGroup, capabilitiesError);
  }

  if (!isValid && firstInvalidElement) {
    firstInvalidElement.focus();
  }

  return {
    isValid,
    data: isValid ? { fullName, phone, email, area, capabilities } : null,
  };
}

/**
 * Show an error state and red error message underneath an invalid field.
 */
function showFieldError(containerEl, errorEl, message, inputEl) {
  if (containerEl) containerEl.classList.add("has-error");
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add("visible");
  }
  if (inputEl && inputEl.type !== "checkbox") {
    inputEl.setAttribute("aria-invalid", "true");
  }
}

/**
 * Clear error state and message from a field.
 */
function clearFieldError(containerEl, errorEl, inputEl) {
  if (containerEl) containerEl.classList.remove("has-error");
  if (errorEl) {
    errorEl.textContent = "";
    errorEl.classList.remove("visible");
  }
  if (inputEl && inputEl.type !== "checkbox") {
    inputEl.setAttribute("aria-invalid", "false");
  }
}

/**
 * Clear all form validation errors across all fields.
 */
function clearAllFormErrors() {
  const fields = [
    ["fullNameGroup", "fullNameError", "fullName"],
    ["phoneGroup", "phoneError", "phone"],
    ["emailGroup", "emailError", "email"],
    ["areaGroup", "areaError", "area"],
    ["capabilitiesGroup", "capabilitiesError", null],
  ];

  fields.forEach(([groupId, errorId, inputId]) => {
    clearFieldError(
      document.getElementById(groupId),
      document.getElementById(errorId),
      inputId ? document.getElementById(inputId) : null
    );
  });
}

/**
 * Read registered volunteers array safely from localStorage under key 'volunteers'.
 * @returns {Array<object>}
 */
function getVolunteersFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Persist a newly registered volunteer to localStorage (newest first).
 * @param {object} volunteer
 */
function saveVolunteerToStorage(volunteer) {
  const existingVolunteers = getVolunteersFromStorage();
  const updatedVolunteers = [volunteer, ...existingVolunteers];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedVolunteers));
}

/**
 * Display the success banner with smooth CSS transition and auto-hide after 3 seconds.
 * @param {string} message
 */
function showSuccessNotification(message) {
  const alertEl = document.getElementById("successAlert");
  const alertTextEl = document.getElementById("successAlertText");
  if (!alertEl) return;

  if (successTimerId !== null) {
    clearTimeout(successTimerId);
    successTimerId = null;
  }

  if (alertTextEl) {
    alertTextEl.textContent = message;
  }

  alertEl.setAttribute("aria-hidden", "false");
  alertEl.classList.add("show");

  successTimerId = setTimeout(() => {
    alertEl.classList.remove("show");
    alertEl.setAttribute("aria-hidden", "true");
    successTimerId = null;
  }, SUCCESS_HIDE_DELAY_MS);
}

/**
 * Render the registered volunteers list below the registration form.
 */
function renderVolunteersList() {
  const listContainer = document.getElementById("volunteersList");
  const countBadge = document.getElementById("volunteerCount");
  if (!listContainer) return;

  const allVolunteers = getVolunteersFromStorage();
  if (countBadge) {
    countBadge.textContent = `${allVolunteers.length} tình nguyện viên`;
  }

  const visibleVolunteers =
    activeFilter === "all"
      ? allVolunteers
      : allVolunteers.filter(
          (volunteer) =>
            Array.isArray(volunteer.capabilities) &&
            volunteer.capabilities.includes(activeFilter)
        );

  listContainer.replaceChildren();

  if (visibleVolunteers.length === 0) {
    listContainer.appendChild(createEmptyState(allVolunteers.length > 0));
    return;
  }

  const fragment = document.createDocumentFragment();
  visibleVolunteers.forEach((volunteer) => {
    fragment.appendChild(createVolunteerCard(volunteer));
  });
  listContainer.appendChild(fragment);
}

/**
 * Build a volunteer card DOM node safely without HTML string interpolation.
 * @param {object} volunteer
 * @returns {HTMLElement}
 */
function createVolunteerCard(volunteer) {
  const card = document.createElement("article");
  card.className = "volunteer-item";

  const fullName = String(volunteer.fullName || "");
  const area = String(volunteer.area || "");
  const phone = String(volunteer.phone || "");
  const email = String(volunteer.email || "");

  // Header: avatar + name + area
  const header = document.createElement("div");
  header.className = "volunteer-item-header";

  const avatar = document.createElement("div");
  avatar.className = "volunteer-avatar";
  avatar.setAttribute("aria-hidden", "true");
  avatar.textContent = getInitials(fullName);

  const identity = document.createElement("div");
  identity.className = "volunteer-identity";

  const nameEl = document.createElement("h3");
  nameEl.className = "volunteer-name";
  nameEl.textContent = fullName;

  const areaEl = document.createElement("div");
  areaEl.className = "volunteer-area";
  areaEl.appendChild(createInlineIcon("pin"));
  const areaText = document.createElement("span");
  areaText.textContent = area;
  areaEl.appendChild(areaText);

  identity.append(nameEl, areaEl);
  header.append(avatar, identity);

  // Contact box: phone & email links
  const contactBox = document.createElement("div");
  contactBox.className = "volunteer-contact";

  const phoneLink = document.createElement("a");
  phoneLink.className = "contact-link";
  phoneLink.href = `tel:${phone}`;
  phoneLink.appendChild(createInlineIcon("phone"));
  const phoneSpan = document.createElement("span");
  phoneSpan.textContent = phone;
  phoneLink.appendChild(phoneSpan);

  const emailLink = document.createElement("a");
  emailLink.className = "contact-link";
  emailLink.href = `mailto:${email}`;
  emailLink.appendChild(createInlineIcon("mail"));
  const emailSpan = document.createElement("span");
  emailSpan.textContent = email;
  emailLink.appendChild(emailSpan);

  contactBox.append(phoneLink, emailLink);

  // Capability badges
  const capabilitiesWrap = document.createElement("div");
  capabilitiesWrap.className = "volunteer-capabilities";
  const capabilities = Array.isArray(volunteer.capabilities) ? volunteer.capabilities : [];
  capabilities.forEach((capability) => {
    const badge = document.createElement("span");
    const modifier = CAPABILITY_BADGE_CLASSES[capability] || "";
    badge.className = `capability-badge ${modifier}`.trim();
    badge.textContent = capability;
    capabilitiesWrap.appendChild(badge);
  });

  // Footer timestamp
  const footer = document.createElement("div");
  footer.className = "volunteer-item-footer";
  footer.textContent = `Đăng ký lúc: ${formatDateTime(volunteer.createdAt)}`;

  card.append(header, contactBox, capabilitiesWrap, footer);
  return card;
}

/**
 * Create empty state notice when there are no volunteers (or no filter matches).
 * @param {boolean} isFilteredEmpty
 * @returns {HTMLElement}
 */
function createEmptyState(isFilteredEmpty) {
  const wrapper = document.createElement("div");
  wrapper.className = "empty-state";

  const iconBox = document.createElement("div");
  iconBox.className = "empty-state-icon";
  iconBox.setAttribute("aria-hidden", "true");
  iconBox.appendChild(createInlineIcon("users"));

  const heading = document.createElement("h3");
  heading.textContent = isFilteredEmpty
    ? `Chưa có tình nguyện viên hỗ trợ "${activeFilter}"`
    : "Chưa có tình nguyện viên nào đăng ký";

  const desc = document.createElement("p");
  desc.textContent = isFilteredEmpty
    ? "Hãy chọn bộ lọc khác hoặc đăng ký thêm tình nguyện viên mới ở biểu mẫu phía trên."
    : "Hãy điền biểu mẫu phía trên để trở thành tình nguyện viên đầu tiên chung tay hỗ trợ cộng đồng.";

  wrapper.append(iconBox, heading, desc);
  return wrapper;
}

/**
 * Generate 1-2 character initials from a full name or organization name.
 * @param {string} name
 * @returns {string}
 */
function getInitials(name) {
  const words = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return "TV";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

/**
 * Format ISO timestamp into readable Vietnamese date & time.
 * @param {string} isoString
 * @returns {string}
 */
function formatDateTime(isoString) {
  if (!isoString) return "Vừa xong";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "Vừa xong";

  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const INLINE_ICON_SHAPES = {
  pin: [
    ["path", { d: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" }],
    ["circle", { cx: "12", cy: "10", r: "3" }],
  ],
  phone: [
    [
      "path",
      {
        d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z",
      },
    ],
  ],
  mail: [
    ["rect", { width: "20", height: "16", x: "2", y: "4", rx: "2" }],
    ["path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" }],
  ],
  users: [
    ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }],
    ["circle", { cx: "9", cy: "7", r: "4" }],
    ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87" }],
    ["path", { d: "M16 3.13a4 4 0 0 1 0 7.75" }],
  ],
};

/**
 * Create small decorative SVG icons cleanly via DOM namespaces.
 * @param {"pin" | "phone" | "mail" | "users"} type
 * @returns {SVGSVGElement}
 */
function createInlineIcon(type) {
  const SVG_NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(SVG_NS, "svg");
  const size = type === "users" ? "24" : "15";
  svg.setAttribute("width", size);
  svg.setAttribute("height", size);
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");

  const shapes = INLINE_ICON_SHAPES[type] || [];
  shapes.forEach(([tag, attrs]) => {
    const el = document.createElementNS(SVG_NS, tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    svg.appendChild(el);
  });

  return svg;
}
