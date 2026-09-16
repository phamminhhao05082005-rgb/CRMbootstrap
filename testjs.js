// ==========================================================================
// CRM Components Library - JavaScript Engine (testjs.js)
// ==========================================================================

// 1. Hàm hiển thị Toast thông báo copy thành công
function showToast(message = "Đã copy mã nguồn thành công!") {
    let toast = document.getElementById('copyToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'copyToast';
        toast.className = 'copy-toast';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i> ${message}`;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2200);
}

// 2. Hàm hỗ trợ copy code kèm hiệu ứng trên nút bấm
function copyCode(elementId, btnElement) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const codeContent = el.innerText;

    const onCopySuccess = () => {
        showToast("Đã copy mã nguồn vào bộ nhớ tạm!");
        if (btnElement) {
            const originalHtml = btnElement.innerHTML;
            btnElement.classList.add('btn-copied');
            btnElement.innerHTML = '<i class="bi bi-check2 me-1"></i> Đã copy!';
            setTimeout(() => {
                btnElement.classList.remove('btn-copied');
                btnElement.innerHTML = originalHtml;
            }, 2000);
        }
    };

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(codeContent)
            .then(onCopySuccess)
            .catch(err => {
                console.warn('Clipboard API thất bại, thử dùng execCommand:', err);
                fallbackCopy(codeContent, onCopySuccess);
            });
    } else {
        fallbackCopy(codeContent, onCopySuccess);
    }
}

// Fallback copy cho trình duyệt cũ hoặc khi chạy file://
function fallbackCopy(text, callback) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "-9999px";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        const successful = document.execCommand('copy');
        if (successful && callback) callback();
    } catch (err) {
        console.error('Không thể copy nội dung:', err);
    }
    document.body.removeChild(textArea);
}

// 3. Quản lý kích hoạt và chạy lại các mẫu Toasts (Re-run Toast)
let toast4Timer = null;
let toast2Timer = null;

function reRunToast(num) {
    if (num === 1) {
        let el = document.getElementById('liveToast');
        let progressBar = document.getElementById('toastProgress');
        if (!el) {
            const container = document.getElementById('preview-toasts1');
            if (container && FALLBACK_COMPONENTS['toasts1.html']) {
                container.innerHTML = FALLBACK_COMPONENTS['toasts1.html'];
                el = document.getElementById('liveToast');
                progressBar = document.getElementById('toastProgress');
            }
        }
        if (el) {
            const toast = bootstrap.Toast.getOrCreateInstance(el, { autohide: true, delay: 5000 });
            toast.show();
            if (progressBar) {
                progressBar.style.transition = 'none';
                progressBar.style.width = '0%';
                setTimeout(() => {
                    progressBar.style.transition = 'width 5000ms linear';
                    progressBar.style.width = '100%';
                }, 50);
            }
        }
    } else if (num === 2) {
        let toast = document.getElementById('crmToast');
        const previewBox = document.getElementById('preview-toasts2');
        if (!toast && previewBox && FALLBACK_COMPONENTS['toasts2.html']) {
            previewBox.innerHTML = FALLBACK_COMPONENTS['toasts2.html'];
            toast = document.getElementById('crmToast');
        }
        if (toast) {
            toast.classList.remove('toast-hide');
            toast.style.display = '';
            const closeBtn = document.getElementById('closeToastBtn');
            const hideToast = () => {
                toast.classList.add('toast-hide');
                setTimeout(() => {
                    if (toast && toast.parentNode) toast.remove();
                }, 300);
            };
            if (toast2Timer) clearTimeout(toast2Timer);
            toast2Timer = setTimeout(hideToast, 5000);
            if (closeBtn) {
                closeBtn.onclick = function () {
                    clearTimeout(toast2Timer);
                    hideToast();
                };
            }
        }
    } else if (num === 3) {
        let el = document.getElementById('uploadToast');
        if (!el) {
            const container = document.getElementById('preview-toasts3');
            if (container && FALLBACK_COMPONENTS['toasts3.html']) {
                container.innerHTML = FALLBACK_COMPONENTS['toasts3.html'];
                el = document.getElementById('uploadToast');
            }
        }
        if (el) {
            const toast = bootstrap.Toast.getOrCreateInstance(el, { delay: 5000 });
            toast.show();
        }
    } else if (num === 4) {
        let el = document.getElementById('undoToast');
        let countdownEl = document.getElementById('undoCountdown');
        let undoBtn = document.getElementById('btnUndoAction');
        if (!el) {
            const container = document.getElementById('preview-toasts4');
            if (container && FALLBACK_COMPONENTS['toasts4.html']) {
                container.innerHTML = FALLBACK_COMPONENTS['toasts4.html'];
                el = document.getElementById('undoToast');
                countdownEl = document.getElementById('undoCountdown');
                undoBtn = document.getElementById('btnUndoAction');
            }
        }
        if (el) {
            const toastInstance = bootstrap.Toast.getOrCreateInstance(el, { autohide: false });
            toastInstance.show();
            let timeLeft = 5;
            if (countdownEl) countdownEl.textContent = timeLeft;
            if (toast4Timer) clearInterval(toast4Timer);
            toast4Timer = setInterval(() => {
                timeLeft--;
                if (countdownEl) countdownEl.textContent = timeLeft;
                if (timeLeft <= 0) {
                    clearInterval(toast4Timer);
                    toastInstance.hide();
                }
            }, 1000);
            if (undoBtn) {
                undoBtn.onclick = () => {
                    clearInterval(toast4Timer);
                    alert('Action has been undone!');
                    toastInstance.hide();
                };
            }
        }
    }
}

function reRunAllToasts() {
    [1, 2, 3, 4].forEach(n => reRunToast(n));
}

// Hàm khôi phục lại các mẫu Alert khi người dùng bấm tắt
function resetAlerts() {
    const container = document.getElementById('preview-alert');
    if (container && FALLBACK_COMPONENTS['alert.html']) {
        container.innerHTML = FALLBACK_COMPONENTS['alert.html'];
        showToast("Đã khôi phục lại danh sách Alert!");
    }
}

// 4. Fallback data khi mở trực tiếp file://
const FALLBACK_COMPONENTS = {
    // Accordion Mẫu 1
    'accordion1.html': `<div class="task-card">
    <div class="task-header" data-bs-toggle="collapse" data-bs-target="#taskBody" aria-expanded="false" aria-controls="taskBody">
        <div class="d-flex justify-content-between align-items-start w-100">
            <div class="w-100">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <div class="d-flex align-items-center gap-2">
                        <i class="bi bi-chevron-right toggle-icon text-dark"></i>
                        <h6 class="mb-0 fw-bold fs-6">Task</h6>
                    </div>
                    <div class="d-flex align-items-center gap-3">
                        <span class="actions-link text-dark fw-bold align-items-center gap-1" style="font-size: 0.85rem;">
                            Actions <i class="bi bi-caret-down-fill" style="font-size: 0.6rem;"></i>
                        </span>
                        <span class="text-secondary d-flex align-items-center gap-1" style="font-size: 0.85rem;">
                            <i class="bi bi-calendar"></i> Overdue: Sep 6, 2026 at 11:15 AM GMT+7
                        </span>
                    </div>
                </div>

                <div class="collapsed-summary d-flex align-items-center gap-2 ps-4">
                    <div class="status-circle"><i class="bi bi-check2"></i></div>
                    <span class="text-dark" style="font-size: 0.95rem;">(Sample task) Follow up with Brian</span>
                </div>
            </div>
        </div>
    </div>

    <div id="taskBody" class="collapse">
        <div class="card-body pt-1 pb-4">
            <div class="d-flex align-items-center gap-2 ps-4 mb-4">
                <div class="status-circle"><i class="bi bi-check2"></i></div>
                <div class="input-group task-input-group w-100">
                    <input type="text" class="form-control border-0 shadow-none text-dark" value="(Sample task) Follow up with Brian">
                    <span class="input-group-text"><i class="bi bi-pencil text-secondary"></i></span>
                </div>
            </div>

            <div class="row ps-4 mb-4">
                <div class="col-auto pe-4">
                    <div class="prop-label">Due date</div>
                    <div class="d-flex gap-2">
                        <div class="input-group input-group-sm date-input-group" style="width: 140px;">
                            <span class="input-group-text"><i class="bi bi-calendar"></i></span>
                            <input type="text" class="form-control shadow-none" value="09/06/2026">
                        </div>
                        <div class="input-group input-group-sm date-input-group" style="width: 120px;">
                            <span class="input-group-text"><i class="bi bi-clock"></i></span>
                            <input type="text" class="form-control shadow-none" value="11:15 AM">
                        </div>
                    </div>
                </div>
                <div class="col-auto">
                    <div class="prop-label">Reminder</div>
                    <div class="prop-value d-flex align-items-center gap-1 mt-1 cursor-pointer">
                        No reminder <i class="bi bi-caret-down-fill" style="font-size: 0.6rem;"></i>
                    </div>
                </div>
            </div>

            <div class="d-flex align-items-center gap-2 ps-4 mb-3">
                <input class="form-check-input mt-0 border-secondary shadow-none" type="checkbox" style="width: 18px; height: 18px; border-radius: 4px;">
                <span class="text-secondary" style="font-size: 0.95rem;">Set to repeat</span>
                <i class="bi bi-info-circle text-secondary" style="font-size: 0.9rem;"></i>
            </div>

            <hr class="border-secondary opacity-25 mx-4 my-4">

            <div class="row ps-4 pe-2 mb-4">
                <div class="col">
                    <div class="prop-label">Task stage</div>
                    <button class="btn-stage d-flex align-items-center gap-1">
                        Not Started <i class="bi bi-caret-down-fill" style="font-size: 0.6rem;"></i>
                    </button>
                </div>
                <div class="col">
                    <div class="prop-label">Task Type</div>
                    <div class="prop-value mt-1">To-do</div>
                </div>
                <div class="col">
                    <div class="prop-label">Priority</div>
                    <div class="prop-value mt-1 d-flex align-items-center gap-2 text-dark">
                        <span style="width: 10px; height: 10px; background-color: #e5e7eb; border-radius: 50%; display: inline-block;"></span> None
                    </div>
                </div>
                <div class="col">
                    <div class="prop-label">Queue</div>
                    <div class="prop-value mt-1 text-secondary d-flex align-items-center gap-1">
                        None <i class="bi bi-caret-down-fill" style="font-size: 0.6rem;"></i>
                    </div>
                </div>
                <div class="col">
                    <div class="prop-label">Assigned to</div>
                    <div class="prop-value mt-1">No owner</div>
                </div>
            </div>

            <div class="ps-4 mb-4">
                <div class="prop-label mb-2">Task Notes</div>
                <p class="text-dark mb-0" style="font-size: 0.95rem; line-height: 1.6;">
                    Call Brian next Tuesday at 4 about our very best cupcake models. Make sure to pull the specs together for the extra tasty variety.
                </p>
            </div>

            <div class="d-flex justify-content-between align-items-center ps-4 pe-3 mt-4">
                <a href="#" class="text-decoration-none fw-bold d-flex align-items-center gap-2" style="color: #0f766e; font-size: 0.9rem;">
                    <i class="bi bi-chat-left-text" style="font-size: 1.1rem;"></i> Add comment
                </a>
                <a href="#" class="text-decoration-none fw-bold text-dark d-flex align-items-center gap-1" style="font-size: 0.9rem;">
                    2 associations <i class="bi bi-caret-down-fill" style="font-size: 0.6rem;"></i>
                </a>
            </div>
        </div>
    </div>
</div>`,

    'accordion1.css': `.task-card {
    max-width: 750px;
    border: 1px solid #d1d5db;
    border-radius: 12px;
    background-color: #ffffff;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    margin: 0 auto;
}

.task-header {
    cursor: pointer;
    border-radius: 12px;
    padding: 16px 20px 16px 12px;
    transition: background-color 0.2s;
}
.task-header:hover { background-color: #f9fafb; }

.toggle-icon { transition: transform 0.2s ease; font-size: 0.8rem; }
.task-header[aria-expanded="true"] .toggle-icon { transform: rotate(90deg); }

.actions-link { display: none; }
.task-header[aria-expanded="true"] .collapsed-summary { display: none !important; }
.task-header[aria-expanded="true"] .actions-link { display: flex; }

.task-header[aria-expanded="true"] { border-bottom-left-radius: 0; border-bottom-right-radius: 0; }

.status-circle {
    width: 22px;
    height: 22px;
    border: 1.5px solid #8e244d; 
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #8e244d;
}
.status-circle i { font-size: 14px; margin-top: 1px; }

.task-input-group { border: 1px solid #9ca3af; border-radius: 6px; overflow: hidden; }
.task-input-group input { background-color: #f3f4f6; font-size: 0.95rem; }
.task-input-group .input-group-text { background-color: #f3f4f6; border: none; cursor: pointer; }

.date-input-group .input-group-text { background: #fff; border-right: none; color: #6b7280; }
.date-input-group input { border-left: none; padding-left: 0; font-size: 0.9rem; }
.date-input-group input:focus { box-shadow: none; border-color: #dee2e6; }

.prop-label { font-size: 0.75rem; color: #6b7280; margin-bottom: 4px; }
.prop-value { font-size: 0.85rem; font-weight: 600; color: #111827; }
.btn-stage { background-color: #3b82f6; color: white; font-size: 0.75rem; font-weight: 600; padding: 4px 10px; border-radius: 6px; border: none; }`,

    // Accordion Mẫu 2
    'accordion2.html': `<div class="property-card">
    <div class="property-header" data-bs-toggle="collapse" data-bs-target="#propertyBody" aria-expanded="false"
        aria-controls="propertyBody">
        <div class="d-flex align-items-center gap-2">
            <i class="bi bi-chevron-right toggle-icon"></i>
            <h2 class="header-title">About this ...</h2>
        </div>

        <div class="d-flex align-items-center gap-3">
            <div class="actions-text d-flex align-items-center gap-1">
                Actions <i class="bi bi-caret-down-fill" style="font-size: 0.6rem;"></i>
            </div>

            <button class="btn-settings" onclick="event.stopPropagation();">
                <i class="bi bi-gear"></i>
            </button>
        </div>
    </div>

    <div id="propertyBody" class="collapse">
        <div class="property-body">
            <div class="prop-group">
                <div class="prop-label">Deal owner</div>
                <div class="prop-value">PHẠM MINH HÀO</div>
            </div>

            <div class="prop-group">
                <div class="prop-label">Last Contacted</div>
                <div class="prop-value">09/09/2026 11:15 AM GMT+7</div>
            </div>

            <div class="prop-group">
                <div class="prop-label">Deal Type</div>
                <div class="prop-value">New Business</div>
            </div>

            <div class="prop-group">
                <div class="prop-label">Priority</div>
                <div class="prop-value d-flex align-items-center gap-2">
                    <span class="status-dot"></span> Low
                </div>
            </div>

            <div class="prop-group">
                <div class="prop-label">Closed Lost Reason</div>
                <div class="prop-value">--</div>
            </div>
        </div>
    </div>
</div>`,

    'accordion2.css': `.property-card {
    width: 100%;
    max-width: 320px;
    border: 1px solid #d1d5db;
    border-radius: 12px;
    background-color: #ffffff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.property-header {
    cursor: pointer;
    padding: 16px;
    border-radius: 12px;
    transition: background-color 0.2s;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.property-header:hover {
    background-color: #f8fafc;
}

.property-header[aria-expanded="true"] {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}

.toggle-icon {
    font-size: 0.8rem;
    color: #374151;
    transition: transform 0.2s ease;
}

.property-header[aria-expanded="true"] .toggle-icon {
    transform: rotate(90deg);
}

.header-title {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 110px;
}

.actions-text {
    font-size: 0.85rem;
    font-weight: 600;
    color: #1f2937;
}

.btn-settings {
    width: 32px;
    height: 32px;
    border: 1px solid #9ca3af;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    color: #4b5563;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-settings:hover {
    background-color: #f3f4f6;
    color: #111827;
}

.property-body {
    padding: 0 16px 20px 16px;
}

.prop-group {
    margin-top: 16px;
}

.prop-label {
    font-size: 0.75rem;
    color: #6b7280;
    margin-bottom: 4px;
}

.prop-value {
    font-size: 0.95rem;
    color: #374151;
    word-wrap: break-word;
}

.status-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #3f8854;
    display: inline-block;
}`,

    // Badge
    'badge.html': `<div class="p-3">
    <div class="mb-4">
        <h6 class="text-secondary fw-semibold small mb-3 text-uppercase">1. Badge trên nút bấm (Button Badges)</h6>
        <div class="d-flex flex-wrap align-items-center gap-2">
            <button type="button" class="btn btn-primary btn-crm-badge position-relative">
                <i class="bi bi-inbox fs-6"></i> Inbox
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger badge-floating-top">
                    99+
                    <span class="visually-hidden">unread messages</span>
                </span>
            </button>

            <button type="button" class="btn btn-primary btn-crm-badge">
                <i class="bi bi-bell fs-6"></i> Notifications
                <span class="badge rounded-pill badge-inline-sub bg-danger">4</span>
            </button>

            <button type="button" class="btn btn-outline-secondary btn-crm-badge position-relative">
                <i class="bi bi-check2-square fs-6"></i> Tasks
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark badge-floating-top">
                    12
                </span>
            </button>
        </div>
    </div>

    <div class="mb-4">
        <h6 class="text-secondary fw-semibold small mb-3 text-uppercase">2. Badge trạng thái CRM (Status Badges)</h6>
        <div class="d-flex flex-wrap align-items-center gap-2">
            <span class="badge text-bg-success badge-status-item">
                <i class="bi bi-check-circle-fill"></i> Thành công
            </span>
            <span class="badge text-bg-primary badge-status-item">
                <i class="bi bi-info-circle-fill"></i> Đang xử lý
            </span>
            <span class="badge text-bg-warning text-dark badge-status-item">
                <i class="bi bi-hourglass-split"></i> Chờ duyệt
            </span>
            <span class="badge text-bg-danger badge-status-item">
                <i class="bi bi-exclamation-octagon-fill"></i> Quá hạn
            </span>
        </div>
    </div>

    <div>
        <h6 class="text-secondary fw-semibold small mb-3 text-uppercase">3. Badge hình viên thuốc (Rounded Pill)</h6>
        <div class="d-flex flex-wrap align-items-center gap-2">
            <span class="badge rounded-pill text-bg-success badge-status-item">
                <i class="bi bi-check2"></i> Hoàn thành
            </span>
            <span class="badge rounded-pill text-bg-primary badge-status-item">
                <i class="bi bi-person-fill"></i> Khách hàng mới
            </span>
            <span class="badge rounded-pill text-bg-warning text-dark badge-status-item">
                <i class="bi bi-clock-history"></i> Đang chăm sóc
            </span>
            <span class="badge rounded-pill text-bg-secondary badge-status-item">
                <i class="bi bi-archive-fill"></i> Đóng hồ sơ
            </span>
        </div>
    </div>
</div>`,

    'badge.css': `/* Nút bấm chứa badge */
.btn-crm-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 18px;
    font-weight: 500;
    font-size: 0.95rem;
    border-radius: 8px;
    margin-right: 12px;
    margin-bottom: 12px;
    transition: all 0.2s ease;
}

.btn-crm-badge:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(13, 110, 253, 0.25);
}

/* Badge dạng bong bóng nổi ở góc trên bên phải */
.badge-floating-top {
    font-size: 0.72rem;
    padding: 0.35em 0.6em;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 6px rgba(220, 53, 69, 0.35);
}

/* Badge nằm chìm bên trong nút */
.badge-inline-sub {
    font-size: 0.75rem;
    margin-left: 6px;
    padding: 0.3em 0.65em;
    font-weight: 600;
}

/* Kiểu dáng cho Badge trạng thái CRM */
.badge-status-item {
    font-size: 0.85rem;
    padding: 7px 14px;
    font-weight: 500;
    margin-right: 8px;
    margin-bottom: 8px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
}`,

    // Toasts Mẫu 1
    'toasts1.html': `<div class="toast-container position-fixed bottom-0 end-0 p-4">
    <div id="liveToast" class="toast custom-toast" role="alert" aria-live="assertive" aria-atomic="true"
        data-bs-autohide="true" data-bs-delay="5000">
        <div class="toast-header">
            <div class="toast-icon-box">
                <i class="fa-solid fa-shield-halved"></i>
            </div>
            <strong class="me-auto">Hệ Thống Bảo Mật</strong>

            <span class="time-badge">
                <i class="fa-regular fa-clock me-1"></i> Vừa xong
            </span>

            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>

        <div class="toast-body">
            <div class="d-flex align-items-center">
                <i class="fa-solid fa-circle-check text-success fs-5 me-3"></i>
                <div>
                    <span class="text-white fw-semibold d-block">Thành công!</span>
                    Mọi thay đổi cấu hình hệ thống của bạn đã được lưu lại an toàn.
                </div>
            </div>
        </div>

        <div class="toast-progress" id="toastProgress"></div>
    </div>
</div>`,

    'toasts1.css': `:root {
    --toast-radius: 16px;
    --toast-bg: #1e293b;
    --toast-text: #f8fafc;
}

.custom-toast {
    background-color: var(--toast-bg) !important;
    color: var(--toast-text);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--toast-radius);
    box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);
    overflow: hidden;
    width: 390px;
}

.custom-toast .toast-header {
    background-color: rgba(255, 255, 255, 0.03);
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    color: var(--toast-text);
    padding: 14px 18px;
}

.toast-icon-box {
    width: 34px;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
    font-size: 15px;
    margin-right: 12px;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.time-badge {
    background-color: rgba(255, 255, 255, 0.08);
    color: #94a3b8;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 500;
    margin-right: 10px;
}

.custom-toast .btn-close {
    filter: invert(1) grayscale(100%) brightness(200%);
    opacity: 0.7;
}

.custom-toast .btn-close:hover {
    opacity: 1;
}

.custom-toast .toast-body {
    padding: 16px 18px;
    background-color: rgba(15, 23, 42, 0.4);
    margin: 10px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.04);
    font-size: 0.95rem;
    color: #cbd5e1;
    line-height: 1.5;
}

.toast-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #3b82f6, #60a5fa);
    width: 0%;
}`,

    'toasts1.js': `document.addEventListener('DOMContentLoaded', () => {
    const toastElement = document.getElementById('liveToast');
    const progressBar = document.getElementById('toastProgress');
    const TOAST_DURATION = 5000;

    if (toastElement) {
        const bsToast = new bootstrap.Toast(toastElement);

        bsToast.show();

        toastElement.addEventListener('show.bs.toast', () => {
            progressBar.style.transition = 'none';
            progressBar.style.width = '0%';

            setTimeout(() => {
                progressBar.style.transition = \`width \${TOAST_DURATION}ms linear\`;
                progressBar.style.width = '100%';
            }, 50);
        });

        toastElement.addEventListener('hidden.bs.toast', () => {
            progressBar.style.transition = 'none';
            progressBar.style.width = '0%';
        });
    }
});`,

    // Toasts Mẫu 2
    'toasts2.html': `<div id="crmToast" class="toast-notification position-fixed bottom-0 end-0 m-4 p-4 rounded-4 shadow-lg text-white"
    style="width: 360px; background-color: #111827; border: 1px solid #1f2937; z-index: 1080;">

    <div class="px-3 py-2 rounded-3 mb-3 fw-semibold text-white" style="background-color: #1f2937; font-size: 14px;">
        New notification
    </div>

    <div class="d-flex align-items-start gap-3 mb-4">
        <img src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="Bonnie Green"
            class="rounded-circle object-fit-cover" style="width: 48px; height: 48px;">
        <div>
            <div class="fw-bold text-white fs-6">Bonnie Green</div>
            <div class="text-secondary" style="font-size: 14px;">commented on your photo</div>
            <div class="text-primary" style="font-size: 13px;">a few seconds ago</div>
        </div>
    </div>

    <div class="d-flex gap-2">
        <button type="button" id="closeToastBtn" class="btn w-50 py-2 fw-medium text-white border-0"
            style="background-color: #1f2937;">Close</button>
        <button type="button" class="btn btn-primary w-50 py-2 fw-medium">Reply</button>
    </div>
</div>`,

    'toasts2.css': `.toast-notification {
    width: 360px;
    background-color: #111827;
    border: 1px solid #1f2937;
    border-radius: 1rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.toast-hide {
    opacity: 0;
    transform: translateY(20px);
}`,

    'toasts2.js': `document.addEventListener('DOMContentLoaded', function () {
    const toast = document.getElementById('crmToast');
    const closeBtn = document.getElementById('closeToastBtn');

    const hideToast = () => {
        toast.classList.add('toast-hide');
        setTimeout(() => toast.remove(), 300);
    };

    const autoHideTimer = setTimeout(hideToast, 5000);

    closeBtn.addEventListener('click', function () {
        clearTimeout(autoHideTimer);
        hideToast();
    });
});`,

    // Toasts Mẫu 3
    'toasts3.html': `<div class="toast-container position-fixed bottom-0 end-0 p-4">

    <div id="uploadToast" class="toast toast-upload shadow-lg" role="alert" aria-live="assertive" aria-atomic="true"
        data-bs-delay="5000">
        <div class="toast-body p-4">

            <div class="upload-icon-box mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M16 12l-4-4m0 0l-4 4m4-4v12" />
                </svg>
            </div>

            <h6 class="fw-bold mb-1 fs-5">Uploading in progress</h6>
            <p class="mb-4" style="color: #9ca3af; font-size: 0.9rem;">
                Please wait while your file is being uploaded. This may take a moment.
            </p>

            <div class="d-flex align-items-center gap-3 mb-4">
                <div class="upload-progress-track">
                    <div class="upload-progress-bar"></div>
                </div>
                <span class="fw-bold fs-6">75%</span>
            </div>

            <div class="d-flex gap-2">
                <button type="button" class="btn btn-upload-cancel flex-grow-1 rounded-3 py-2 fw-medium"
                    data-bs-dismiss="toast">
                    Cancel upload
                </button>
                <button type="button" class="btn btn-upload-primary flex-grow-1 rounded-3 py-2 fw-medium">
                    Go to uploads
                </button>
            </div>
        </div>
    </div>
</div>`,

    'toasts3.css': `.toast-upload {
    background-color: #1a1d24;
    border: 1px solid #2d3139;
    border-radius: 0.75rem;
    color: #f8fafc;
    width: 380px;
}

.upload-icon-box {
    background-color: #272a32;
    border-radius: 0.5rem;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #60a5fa;
}

.upload-progress-track {
    height: 6px;
    background-color: #374151;
    border-radius: 10px;
    flex-grow: 1;
}

.upload-progress-bar {
    height: 100%;
    background-color: #3b82f6;
    border-radius: 10px;
    width: 75%;
}

.btn-upload-cancel {
    background-color: transparent;
    color: #9ca3af;
    border: 1px solid #374151;
}

.btn-upload-cancel:hover {
    background-color: #374151;
    color: #fff;
}

.btn-upload-primary {
    background-color: #3b82f6;
    color: #fff;
    border: none;
}

.btn-upload-primary:hover {
    background-color: #2563eb;
}`,

    'toasts3.js': `document.addEventListener('DOMContentLoaded', function () {
    const toastEl = document.getElementById('uploadToast');
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
});`,

    // Toasts Mẫu 4
    'toasts4.html': `<div class="toast-container position-fixed bottom-0 end-0 p-4">

    <div id="undoToast" class="toast toast-undo" role="alert" aria-live="assertive" aria-atomic="true"
        data-bs-autohide="false">
        <div class="toast-body d-flex align-items-center justify-content-between p-3">

            <div class="d-flex align-items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-width="2" style="color: #10b981;">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span style="font-size: 0.95rem;">Action completed.</span>
            </div>

            <div class="d-flex align-items-center gap-2">

                <button type="button" class="btn-undo" id="btnUndoAction">
                    Undo (<span id="undoCountdown">5</span>s)
                </button>

                <button type="button" class="btn-close btn-close-white ms-2 shadow-none" data-bs-dismiss="toast"
                    aria-label="Close"></button>
            </div>

        </div>
    </div>
</div>`,

    'toasts4.css': `.toast-undo {
    background-color: #1f2937;
    border-left: 4px solid #10b981;
    border-radius: 0.5rem;
    color: #f3f4f6;
    width: 350px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
}

.btn-undo {
    color: #34d399;
    font-weight: 600;
    text-decoration: none;
    background: rgba(52, 211, 153, 0.1);
    border: none;
    padding: 0.4rem 0.8rem;
    border-radius: 0.4rem;
    transition: 0.2s;
}

.btn-undo:hover {
    background: rgba(52, 211, 153, 0.2);
    color: #10b981;
}`,

    'toasts4.js': `document.addEventListener('DOMContentLoaded', function () {
    const toastEl = document.getElementById('undoToast');
    const countdownEl = document.getElementById('undoCountdown');
    const undoBtn = document.getElementById('btnUndoAction');

    const toastInstance = new bootstrap.Toast(toastEl);
    toastInstance.show();

    let timeLeft = 5;

    const timer = setInterval(() => {
        timeLeft--;
        countdownEl.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            toastInstance.hide();
        }
    }, 1000);

    undoBtn.addEventListener('click', () => {
        clearInterval(timer);

        alert('Action has been undone!');

        toastInstance.hide();
    });

    toastEl.addEventListener('hidden.bs.toast', () => {
        clearInterval(timer);
    });
});`,

    // Alert Component
    'alert.html': `<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
    <!-- icon chữ i / thông tin -->
    <symbol id="info-fill" viewBox="0 0 16 16">
        <path
            d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287z" />
    </symbol>
    <!-- icon dấu tick / thành công -->
    <symbol id="check-circle-fill" viewBox="0 0 16 16">
        <path
            d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
    </symbol>
    <!-- icon cảnh báo / lỗi -->
    <symbol id="exclamation-triangle-fill" viewBox="0 0 16 16">
        <path
            d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
    </symbol>
    <!-- icon đóng / dấu X (dùng cho nút tắt alert) -->
    <symbol id="x-lg" viewBox="0 0 16 16">
        <path
            d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
    </symbol>
    <!-- icon ngôi sao (dùng cho đánh giá / nổi bật) -->
    <symbol id="star-fill" viewBox="0 0 16 16">
        <path
            d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
    </symbol>
    <!-- icon chuông thông báo (notification) -->
    <symbol id="bell-fill" viewBox="0 0 16 16">
        <path
            d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z" />
    </symbol>
    <!-- icon khóa (security / quyền hạn) -->
    <symbol id="lock-fill" viewBox="0 0 16 16">
        <path
            d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
    </symbol>
    <!-- icon bánh răng (cài đặt / hệ thống) -->
    <symbol id="gear-fill" viewBox="0 0 16 16">
        <path
            d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.988 1.988l.17.31c.45.82-.12 1.848-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.988 1.988l.31-.17a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.988-1.988l-.17-.31a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.988-1.988l-.31.17a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.93 2.93 0 1 1 0-5.86 2.93 2.93 0 0 1 0 5.86z" />
    </symbol>
</svg>

<!-- 1. Alert với symbol: info-fill -->
<div class="alert alert-primary alert-dismissible fade show d-flex align-items-center" role="alert">
    <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Info:">
        <use xlink:href="#info-fill" />
    </svg>
    <div class="flex-grow-1">
        Thông tin hệ thống mới
    </div>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>

<!-- 2. Alert với symbol: check-circle-fill -->
<div class="alert alert-success alert-dismissible fade show d-flex align-items-center" role="alert">
    <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:">
        <use xlink:href="#check-circle-fill" />
    </svg>
    <div class="flex-grow-1">
        Thực hiện thao tác thành công
    </div>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>

<!-- 3. Alert với symbol: exclamation-triangle-fill -->
<div class="alert alert-warning alert-dismissible fade show d-flex align-items-center" role="alert">
    <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Warning:">
        <use xlink:href="#exclamation-triangle-fill" />
    </svg>
    <div class="flex-grow-1">
        Cảnh báo rủi ro hệ thống
    </div>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>

<!-- 4. Alert với symbol: star-fill -->
<div class="alert alert-info alert-dismissible fade show d-flex align-items-center" role="alert">
    <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Star:">
        <use xlink:href="#star-fill" />
    </svg>
    <div class="flex-grow-1">
        Tính năng nổi bật mới
    </div>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>

<!-- 5. Alert với symbol: bell-fill -->
<div class="alert alert-secondary alert-dismissible fade show d-flex align-items-center" role="alert">
    <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Bell:">
        <use xlink:href="#bell-fill" />
    </svg>
    <div class="flex-grow-1">
        Bạn có thông báo chưa đọc
    </div>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>

<!-- Alert thông báo dài sử dụng symbol cuối cùng: gear-fill (Đã thêm nút đóng) -->
<div class="alert alert-dark alert-dismissible fade show" role="alert">
    <div class="d-flex align-items-center mb-2">
        <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Gear:">
            <use xlink:href="#gear-fill" />
        </svg>
        <h4 class="alert-heading mb-0">Hệ thống đang bảo trì định kỳ!</h4>
    </div>
    <p>Hệ thống đang bảo trì định kỳ.</p>
    <hr>
    <p class="mb-0">Vui lòng quay lại sau.</p>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>`,

    // Carousel Mẫu 1 (Drag & Scroll)
    'carousel1.html': `<div class="dark-section">
    <div class="container-fluid px-4 px-md-5">
        <div class="drag-carousel-wrapper" id="draggableWrapper">
            <div class="drag-carousel-track" id="draggableTrack">

                <div class="drag-item">
                    <div class="card-graphic bg-gradient-1">
                        <div class="app-logo">Lovable</div>
                    </div>
                    <div class="card-info">
                        <p>Lovable builds its AI-native coding platform and developer experience on top of Mintlify.</p>
                        <a href="#" class="card-link">Read Lovable's story &rsaquo;</a>
                    </div>
                </div>

                <div class="drag-item">
                    <div class="card-graphic bg-gradient-2">
                        <div class="app-logo">Kalshi</div>
                    </div>
                    <div class="card-info">
                        <p>Kalshi powers its developer documentation with Mintlify.</p>
                        <a href="#" class="card-link">Read Kalshi's story &rsaquo;</a>
                    </div>
                </div>

                <div class="drag-item">
                    <div class="card-graphic bg-gradient-3">
                        <div class="app-logo">Decagon</div>
                    </div>
                    <div class="card-info">
                        <p>Decagon ships sleek, AI-native documentation built on Mintlify.</p>
                        <a href="#" class="card-link">Read Decagon's story &rsaquo;</a>
                    </div>
                </div>

                <div class="drag-item">
                    <div class="card-graphic bg-gradient-4">
                        <div class="app-logo">Replit</div>
                    </div>
                    <div class="card-info">
                        <p>Learn how Replit uses Mintlify to turn documentation into a fast, collaborative experience.</p>
                        <a href="#" class="card-link">Read Replit's story &rsaquo;</a>
                    </div>
                </div>

                <div class="drag-item">
                    <div class="card-graphic bg-gradient-2">
                        <div class="app-logo">Kalshi 2</div>
                    </div>
                    <div class="card-info">
                        <p>Kalshi powers its developer documentation with Mintlify.</p>
                        <a href="#" class="card-link">Read Kalshi's story &rsaquo;</a>
                    </div>
                </div>

                <div class="drag-item">
                    <div class="card-graphic bg-gradient-3">
                        <div class="app-logo">Decagon 2</div>
                    </div>
                    <div class="card-info">
                        <p>Decagon ships sleek, AI-native documentation built on Mintlify.</p>
                        <a href="#" class="card-link">Read Decagon's story &rsaquo;</a>
                    </div>
                </div>

            </div>
        </div>

        <div class="carousel-progress-container">
            <div class="carousel-progress-bar" id="progressBar"></div>
        </div>

    </div>
</div>`,

    'carousel1.css': `.dark-section {
    background-color: #0b0f19;
    padding: 4rem 0;
    min-height: 100vh;
    display: flex;
    align-items: center;
}

.drag-carousel-wrapper {
    overflow: hidden;
    cursor: grab;
    position: relative;
}

.drag-carousel-wrapper:active {
    cursor: grabbing;
}

.drag-carousel-track {
    display: flex;
    gap: 1.5rem;
    overflow-x: auto;
    scroll-behavior: smooth;
    -ms-overflow-style: none;
    scrollbar-width: none;
    padding-bottom: 2rem;
}

.drag-carousel-track::-webkit-scrollbar {
    display: none;
}

.drag-item {
    flex: 0 0 320px;
    user-select: none;
}

.card-graphic {
    height: 320px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background-size: cover;
    background-position: center;
    transition: transform 0.3s ease;
}

.bg-gradient-1 {
    background: linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b);
}

.bg-gradient-2 {
    background: linear-gradient(135deg, #114357, #f29492);
}

.bg-gradient-3 {
    background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
}

.bg-gradient-4 {
    background: linear-gradient(135deg, #870000, #190a05);
}

.app-logo {
    width: 80px;
    height: 80px;
    background-color: white;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    font-weight: bold;
    font-size: 1.2rem;
    color: #000;
}

.card-info {
    margin-top: 1rem;
}

.card-info p {
    color: #e2e8f0;
    font-size: 0.95rem;
    line-height: 1.5;
    margin-bottom: 0.5rem;
}

.card-link {
    color: #4ade80;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    transition: color 0.2s;
}

.card-link:hover {
    color: #22c55e;
}

.carousel-progress-container {
    width: 300px;
    height: 4px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    margin: 2rem auto 0 auto;
    position: relative;
    overflow: hidden;
}

.carousel-progress-bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background-color: #4ade80;
    border-radius: 4px;
    width: 0%;
    transition: width 0.1s ease;
}`,

    'carousel1.js': `document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('draggableTrack');
    const progressBar = document.getElementById('progressBar');
    let isDown = false;
    let startX;
    let scrollLeft;

    function updateProgressBar() {
        const maxScrollLeft = slider.scrollWidth - slider.clientWidth;

        if (maxScrollLeft <= 0) {
            progressBar.style.width = '100%';
            return;
        }

        const scrollPercentage = (slider.scrollLeft / maxScrollLeft) * 100;
        progressBar.style.width = Math.max(5, scrollPercentage) + '%';
    }

    setTimeout(updateProgressBar, 100);

    slider.addEventListener('scroll', updateProgressBar);
    window.addEventListener('resize', updateProgressBar);

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.style.scrollBehavior = 'auto';
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.style.scrollBehavior = 'smooth';
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    });
});`,

    // Carousel Mẫu 2 (Focus 3D Cards)
    'carousel2.html': `<div class="carousel-section">
    <div class="focus-carousel-container" id="sliderContainer">

        <button class="nav-btn nav-prev" id="btnPrev">&lsaquo;</button>

        <div class="focus-item">
            <div class="card-img-wrapper">
                <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=500&q=80"
                    alt="Nature Mountains">
            </div>
            <div class="item-content">
                <h3 class="item-title">Data Agent</h3>
                <p class="item-text">Get instant answers to custom questions about your customers.</p>
                <a href="#" class="btn-learn-more">Learn more</a>
            </div>
        </div>

        <div class="focus-item">
            <div class="card-img-wrapper">
                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=500&q=80"
                    alt="Customer Support">
            </div>
            <div class="item-content">
                <h3 class="item-title">Customer Agent</h3>
                <p class="item-text">Resolve 65% of your customer inquiries automatically.</p>
                <a href="#" class="btn-learn-more">Learn more</a>
            </div>
        </div>

        <div class="focus-item">
            <div class="card-img-wrapper">
                <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=80"
                    alt="Prospecting">
            </div>
            <div class="item-content">
                <h3 class="item-title">Prospecting Agent</h3>
                <p class="item-text">Spot buying signals, source contacts, and launch personalized outreach.</p>
                <a href="#" class="btn-learn-more">Learn more</a>
            </div>
        </div>

        <div class="focus-item">
            <div class="card-img-wrapper">
                <img src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=500&q=80"
                    alt="Analytics">
            </div>
            <div class="item-content">
                <h3 class="item-title">Analytics Agent</h3>
                <p class="item-text">Track your performance and optimize workflows in real-time.</p>
                <a href="#" class="btn-learn-more">Learn more</a>
            </div>
        </div>

        <button class="nav-btn nav-next" id="btnNext">&rsaquo;</button>
    </div>

    <div class="play-pause-wrapper">
        <button class="btn-toggle-play" id="btnPlayPause">||</button>
    </div>
</div>`,

    'carousel2.css': `.carousel-section {
     width: 100%;
     padding: 3rem 0;
     overflow: hidden;
     position: relative;
 }

 .focus-carousel-container {
     position: relative;
     width: 100%;
     max-width: 1100px;
     height: 550px;
     margin: 0 auto;
     display: flex;
     justify-content: center;
     align-items: center;
     touch-action: pan-y;
     user-select: none;
     cursor: grab;
 }

 .focus-carousel-container:active {
     cursor: grabbing;
 }

 .focus-item {
     position: absolute;
     width: 280px;
     height: 400px;
     background-color: #ffffff;
     border-radius: 12px;
     box-shadow: 0 10px 20px rgba(0, 0, 0, 0.04);
     transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1),
         opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1),
         box-shadow 0.6s ease;
     display: flex;
     flex-direction: column;
     opacity: 0;
     transform: scale(0.7);
     z-index: 1;
     pointer-events: none;
 }

 .focus-item.active {
     transform: translateX(0) scale(1);
     width: 360px;
     height: 520px;
     opacity: 1;
     z-index: 3;
     box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
     pointer-events: auto;
 }

 .focus-item.prev {
     transform: translateX(-120%) scale(0.85);
     opacity: 0.5;
     z-index: 2;
     pointer-events: auto;
 }

 .focus-item.next {
     transform: translateX(120%) scale(0.85);
     opacity: 0.5;
     z-index: 2;
     pointer-events: auto;
 }

 .card-img-wrapper {
     padding: 1rem 1rem 0 1rem;
     height: 55%;
     width: 100%;
 }

 .card-img-wrapper img {
     width: 100%;
     height: 100%;
     object-fit: cover;
     border-radius: 10px;
     background-color: #f7f3ed;
 }

 .item-content {
     padding: 1.5rem 2rem 2rem 2rem;
     flex-grow: 1;
     display: flex;
     flex-direction: column;
     justify-content: space-between;
     text-align: center;
 }

 .item-title {
     font-size: 1.15rem;
     font-weight: 700;
     color: #222;
     margin-bottom: 0.5rem;
 }

 .focus-item.active .item-title {
     font-size: 1.4rem;
 }

 .item-text {
     font-size: 0.85rem;
     color: #666;
     line-height: 1.5;
     margin-bottom: 1rem;
 }

 .focus-item.active .item-text {
     font-size: 0.95rem;
 }

 .btn-learn-more {
     margin-top: auto;
     align-self: center;
     font-size: 0.9rem;
     font-weight: 600;
     color: #111;
     text-decoration: none;
     border-bottom: 2px solid #e75c3b;
     padding-bottom: 2px;
     transition: all 0.2s;
 }

 .btn-learn-more:hover {
     color: #e75c3b;
 }

 .nav-btn {
     position: absolute;
     top: 50%;
     transform: translateY(-50%);
     width: 45px;
     height: 45px;
     border-radius: 50%;
     background: white;
     border: none;
     box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
     font-size: 1.2rem;
     font-weight: bold;
     color: #333;
     cursor: pointer;
     z-index: 10;
     display: flex;
     align-items: center;
     justify-content: center;
     transition: all 0.2s;
 }

 .nav-btn:hover {
     background: #f8f9fa;
     transform: translateY(-50%) scale(1.05);
 }

 .nav-prev {
     left: 15px;
 }

 .nav-next {
     right: 15px;
 }

 .play-pause-wrapper {
     text-align: center;
     margin-top: 1rem;
 }

 .btn-toggle-play {
     width: 35px;
     height: 35px;
     border-radius: 50%;
     border: none;
     background: white;
     box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
     font-weight: bold;
     font-size: 0.8rem;
     color: #333;
     cursor: pointer;
 }`,

    'carousel2.js': `document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.focus-item');
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    const btnPlayPause = document.getElementById('btnPlayPause');
    const container = document.getElementById('sliderContainer');

    let currentIndex = 1;
    const totalItems = items.length;

    let autoPlayTimer;
    let isAutoPlaying = true;

    function updateSlider() {
        const activeIndex = currentIndex;
        const prevIndex = (currentIndex - 1 + totalItems) % totalItems;
        const nextIndex = (currentIndex + 1) % totalItems;

        items.forEach((item) => {
            item.className = 'focus-item';
        });

        items[activeIndex].classList.add('active');
        items[prevIndex].classList.add('prev');
        items[nextIndex].classList.add('next');
    }

    function goNext() {
        currentIndex = (currentIndex + 1) % totalItems;
        updateSlider();
    }

    function goPrev() {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateSlider();
    }

    btnNext.addEventListener('click', () => {
        goNext();
        resetAutoPlay();
    });

    btnPrev.addEventListener('click', () => {
        goPrev();
        resetAutoPlay();
    });

    items.forEach(item => {
        item.addEventListener('click', (e) => {
            if (item.classList.contains('prev')) {
                goPrev();
                resetAutoPlay();
            } else if (item.classList.contains('next')) {
                goNext();
                resetAutoPlay();
            }
        });
    });

    function startAutoPlay() {
        if (isAutoPlaying) {
            autoPlayTimer = setInterval(goNext, 3000);
        }
    }

    function resetAutoPlay() {
        clearInterval(autoPlayTimer);
        startAutoPlay();
    }

    btnPlayPause.addEventListener('click', () => {
        isAutoPlaying = !isAutoPlaying;
        if (isAutoPlaying) {
            btnPlayPause.innerHTML = '||';
            startAutoPlay();
        } else {
            btnPlayPause.innerHTML = '&#9654;';
            clearInterval(autoPlayTimer);
        }
    });

    let startX = 0;
    let isDragging = false;

    container.addEventListener('mousedown', (e) => {
        if (e.target.closest('button')) return;
        isDragging = true;
        startX = e.pageX;
        clearInterval(autoPlayTimer);
    });

    container.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        let endX = e.pageX;
        let diff = startX - endX;

        if (diff > 50) goNext();
        else if (diff < -50) goPrev();

        isDragging = false;
        startAutoPlay();
    });

    container.addEventListener('mouseleave', () => {
        isDragging = false;
    });

    container.addEventListener('touchstart', (e) => {
        if (e.target.closest('button')) return;
        startX = e.touches[0].clientX;
        clearInterval(autoPlayTimer);
    });

    container.addEventListener('touchend', (e) => {
        let endX = e.changedTouches[0].clientX;
        let diff = startX - endX;

        if (diff > 50) goNext();
        else if (diff < -50) goPrev();

        startAutoPlay();
    });

    updateSlider();
    startAutoPlay();
});`,

    // Carousel Mẫu 3 (Logo Marquee)
    'carousel3.html': `<div class="container">
    <div class="partners-section">

        <div class="partners-text">
            TRUSTED BY 299,000+ <br>
            CUSTOMERS WORLDWIDE
        </div>

        <div class="partners-divider"></div>

        <div class="marquee-wrapper">
            <div class="marquee-track" id="logoTrack">

                <div class="logo-item"><span class="demo-logo-text eventbrite">eventbrite</span></div>
                <div class="logo-item"><span class="demo-logo-text ebay">ebay</span></div>
                <div class="logo-item"><span class="demo-logo-text doordash">DOORDASH</span></div>
                <div class="logo-item"><span class="demo-logo-text reddit">reddit</span></div>
                <div class="logo-item"><span class="demo-logo-text tripadvisor">Tripadvisor</span></div>
                <div class="logo-item"><span class="demo-logo-text">Spotify</span></div>

                <div class="logo-item"><span class="demo-logo-text eventbrite">eventbrite</span></div>
                <div class="logo-item"><span class="demo-logo-text ebay">ebay</span></div>
                <div class="logo-item"><span class="demo-logo-text doordash">DOORDASH</span></div>
                <div class="logo-item"><span class="demo-logo-text reddit">reddit</span></div>
                <div class="logo-item"><span class="demo-logo-text tripadvisor">Tripadvisor</span></div>
                <div class="logo-item"><span class="demo-logo-text">Spotify</span></div>
            </div>
        </div>

        <button class="control-btn" id="playPauseBtn" aria-label="Pause animation">
            <svg id="icon-pause" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
            </svg>

            <svg id="icon-play" viewBox="0 0 24 24" style="display: none;">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
        </button>

    </div>
</div>`,

    'carousel3.css': `.partners-section {
    background: #ffffff;
    border-top: 1px solid #eaeaea;
    border-bottom: 1px solid #eaeaea;
    padding: 1.5rem 0;
    display: flex;
    align-items: center;
}

.partners-text {
    flex: 0 0 auto;
    font-size: 0.95rem;
    font-weight: 700;
    color: #1a202c;
    line-height: 1.4;
    padding-right: 1.5rem;
    letter-spacing: 0.5px;
}

.partners-divider {
    width: 1px;
    height: 45px;
    background-color: #e2e8f0;
    margin-right: 1.5rem;
    flex: 0 0 auto;
}

.marquee-wrapper {
    flex-grow: 1;
    overflow: hidden;
    display: flex;
    align-items: center;
    -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
    mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
}

.marquee-track {
    display: flex;
    align-items: center;
    gap: 4rem;
    animation: scrollLogos 25s linear infinite;
    width: max-content;
}

.logo-item {
    flex: 0 0 auto;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.logo-img {
    max-height: 100%;
    width: auto;
    object-fit: contain;
    transition: all 0.3s ease;
}

.logo-img:hover {
    opacity: 1;
    filter: grayscale(0%);
}

.demo-logo-text {
    font-size: 1.5rem;
    font-weight: bold;
    color: #a0aec0;
}

.demo-logo-text.eventbrite {
    color: #f05537;
}

.demo-logo-text.ebay {
    color: #e53238;
}

.demo-logo-text.doordash {
    color: #ff3008;
}

.demo-logo-text.reddit {
    color: #ff4500;
}

.demo-logo-text.tripadvisor {
    color: #000000;
}

.control-btn {
    flex: 0 0 auto;
    background: none;
    border: none;
    padding: 0;
    margin-left: 1.5rem;
    cursor: pointer;
    color: #4a5568;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    transition: color 0.2s;
}

.control-btn:hover {
    color: #000;
}

.control-btn svg {
    width: 16px;
    height: 16px;
    fill: currentColor;
}

@keyframes scrollLogos {
    0% {
        transform: translateX(0);
    }

    100% {
        transform: translateX(-50%);
    }
}`,

    'carousel3.js': `document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('logoTrack');
    const btn = document.getElementById('playPauseBtn');
    const iconPause = document.getElementById('icon-pause');
    const iconPlay = document.getElementById('icon-play');

    let isPlaying = true;

    btn.addEventListener('click', () => {
        if (isPlaying) {
            track.style.animationPlayState = 'paused';
            iconPause.style.display = 'none';
            iconPlay.style.display = 'block';
        } else {
            track.style.animationPlayState = 'running';
            iconPlay.style.display = 'none';
            iconPause.style.display = 'block';
        }
        isPlaying = !isPlaying;
    });
});`
};

// 5. Hàm tự động tải HTML, CSS và JS vào trang
async function loadComponent(htmlPath, cssPath, previewId, codeHtmlId, codeCssId, jsPath, codeJsId) {
    let htmlContent = '';
    let cssContent = '';
    let jsContent = '';

    // Tải HTML
    try {
        const htmlRes = await fetch(htmlPath);
        if (htmlRes.ok) {
            htmlContent = await htmlRes.text();
        } else {
            throw new Error(`HTTP ${htmlRes.status}`);
        }
    } catch (fetchErr) {
        if (FALLBACK_COMPONENTS[htmlPath]) {
            htmlContent = FALLBACK_COMPONENTS[htmlPath];
        } else {
            console.error(`Không thể tải ${htmlPath}:`, fetchErr);
        }
    }

    const previewEl = document.getElementById(previewId);
    const codeHtmlEl = document.getElementById(codeHtmlId);
    // Thay thế spinner bằng nội dung component thực tế (không đè lên components đã có sẵn DOM tĩnh để bảo vệ event listener)
    if (previewEl && htmlContent) {
        if (previewEl.querySelector('.spinner-border') || previewEl.children.length === 0) {
            previewEl.innerHTML = htmlContent;
        }
    }
    if (codeHtmlEl && htmlContent) {
        codeHtmlEl.textContent = htmlContent.trim();
    }

    // Tải CSS (nếu có)
    if (cssPath && codeCssId) {
        try {
            const cssRes = await fetch(cssPath);
            if (cssRes.ok) {
                cssContent = await cssRes.text();
            } else {
                throw new Error(`HTTP ${cssRes.status}`);
            }
        } catch (cssErr) {
            if (FALLBACK_COMPONENTS[cssPath]) {
                cssContent = FALLBACK_COMPONENTS[cssPath];
            } else {
                console.error(`Không thể tải ${cssPath}:`, cssErr);
            }
        }

        const codeCssEl = document.getElementById(codeCssId);
        if (codeCssEl && cssContent) {
            codeCssEl.textContent = cssContent.trim();
        }
    }

    // Tải JS (nếu có)
    if (jsPath && codeJsId) {
        try {
            const jsRes = await fetch(jsPath);
            if (jsRes.ok) {
                jsContent = await jsRes.text();
            } else {
                throw new Error(`HTTP ${jsRes.status}`);
            }
        } catch (jsErr) {
            if (FALLBACK_COMPONENTS[jsPath]) {
                jsContent = FALLBACK_COMPONENTS[jsPath];
            } else {
                console.error(`Không thể tải ${jsPath}:`, jsErr);
            }
        }

        const codeJsEl = document.getElementById(codeJsId);
        if (codeJsEl && jsContent) {
            codeJsEl.textContent = jsContent.trim();
        }
    }
}

// 6. Đồng bộ Tab URL Hash
function setupTabHashSync() {
    const triggerTabList = document.querySelectorAll('#componentTabs button[data-bs-toggle="pill"]');
    triggerTabList.forEach(triggerEl => {
        triggerEl.addEventListener('shown.bs.tab', event => {
            const targetId = event.target.getAttribute('data-bs-target');
            if (targetId) {
                history.replaceState(null, null, targetId);
            }
            if (targetId === '#tab-toasts') {
                reRunAllToasts();
            }
        });
    });

    const currentHash = window.location.hash;
    if (currentHash) {
        const tabBtn = document.querySelector(`button[data-bs-target="${currentHash}"]`) ||
            document.querySelector(`button[data-bs-target="#tab-${currentHash.replace('#', '')}"]`);
        if (tabBtn && window.bootstrap) {
            const tabInstance = bootstrap.Tab.getOrCreateInstance(tabBtn);
            tabInstance.show();
        }
    }
}

// 7. Khởi chạy khi trang sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
    // Tải Accordion Mẫu 1 (Task Accordion)
    loadComponent(
        'accordion1.html',
        'accordion1.css',
        'preview-accordion1',
        'code-html-accordion1',
        'code-css-accordion1'
    );

    // Tải Accordion Mẫu 2 (Deal Accordion)
    loadComponent(
        'accordion2.html',
        'accordion2.css',
        'preview-accordion2',
        'code-html-accordion2',
        'code-css-accordion2'
    );

    // Tải Component Badge
    loadComponent(
        'badge.html',
        'badge.css',
        'preview-badge',
        'code-html-badge',
        'code-css-badge'
    );

    // Tải 4 Mẫu Toasts
    loadComponent(
        './toasts1.html',
        './toasts1.css',
        'preview-toasts1',
        'code-html-toasts1',
        'code-css-toasts1',
        './toasts1.js',
        'code-js-toasts1'
    );

    loadComponent(
        './toasts2.html',
        './toasts2.css',
        'preview-toasts2',
        'code-html-toasts2',
        'code-css-toasts2',
        './toasts2.js',
        'code-js-toasts2'
    );

    loadComponent(
        './toasts3.html',
        './toasts3.css',
        'preview-toasts3',
        'code-html-toasts3',
        'code-css-toasts3',
        './toasts3.js',
        'code-js-toasts3'
    );

    loadComponent(
        './toasts4.html',
        './toasts4.css',
        'preview-toasts4',
        'code-html-toasts4',
        'code-css-toasts4',
        './toasts4.js',
        'code-js-toasts4'
    );

    // Tải Component Alert
    loadComponent(
        './alert.html',
        null,
        'preview-alert',
        'code-html-alert',
        null
    );

    // Tải 3 Mẫu Carousel
    loadComponent(
        'carousel1.html',
        'carousel1.css',
        'preview-carousel1',
        'code-html-carousel1',
        'code-css-carousel1',
        'carousel1.js',
        'code-js-carousel1'
    );

    loadComponent(
        'carousel2.html',
        'carousel2.css',
        'preview-carousel2',
        'code-html-carousel2',
        'code-css-carousel2',
        'carousel2.js',
        'code-js-carousel2'
    );

    loadComponent(
        'carousel3.html',
        'carousel3.css',
        'preview-carousel3',
        'code-html-carousel3',
        'code-css-carousel3',
        'carousel3.js',
        'code-js-carousel3'
    );

    // Kích hoạt đồng bộ Tab
    setupTabHashSync();
});