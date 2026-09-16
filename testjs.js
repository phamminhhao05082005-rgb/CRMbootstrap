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
});`,

    // Popovers Mẫu 1 (User Profile)
    'popovers1.html': `<button type="button" class="btn btn-primary px-4 py-2 fw-medium rounded-3">
    User profile
</button>


<div class="profile-popover-card position-absolute bottom-100 start-50 translate-middle-x mb-2">


    <div class="d-flex align-items-center justify-content-between mb-3">
        <img class="rounded-circle object-fit-cover" style="width: 48px; height: 48px;"
            src="https://flowbite.com/docs/images/people/profile-picture-1.jpg" alt="Jese Leos">
        <button type="button" class="btn btn-primary btn-sm px-3 py-1 fw-semibold rounded-3"
            style="background-color: #3b82f6; border: none;">
            Contact
        </button>
    </div>


    <div class="mb-2">
        <a href="#" class="text-white fw-bold text-decoration-none fs-6 d-block text-hover-underline">Jese Leos</a>
        <div class="text-secondary" style="font-size: 14px;">@jeseleos</div>
    </div>


    <p class="mb-3" style="font-size: 14px; color: #9ca3af;">
        Open-source contributor & CEO. Building <a href="#" class="text-decoration-none text-hover-underline"
            style="color: #3b82f6;">flowbite.com</a>.
    </p>


    <ul class="list-unstyled d-flex gap-3 mb-0" style="font-size: 14px;">
        <li>
            <a href="#" class="text-decoration-none text-hover-underline" style="color: #9ca3af;">
                <span class="fw-bold text-white">799</span> Following
            </a>
        </li>
        <li>
            <a href="#" class="text-decoration-none text-hover-underline" style="color: #9ca3af;">
                <span class="fw-bold text-white">3,758</span> Followers
            </a>
        </li>
    </ul>


    <div class="popover-arrow position-absolute start-50 translate-middle-x"></div>
</div>`,
    'popovers1.css': `.user-profile-container .profile-popover-card {
    width: 280px;
    background-color: #1f2937;
    border: 1px solid #374151;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);

    visibility: hidden;
    opacity: 0;
    transform: translate(-50%, 10px);
    transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;
    z-index: 1050;
}

.user-profile-container:hover .profile-popover-card {
    visibility: visible;
    opacity: 1;
    transform: translate(-50%, 0);
}

.popover-arrow {
    bottom: -6px;
    width: 12px;
    height: 12px;
    background-color: #1f2937;
    border-bottom: 1px solid #374151;
    border-right: 1px solid #374151;
    transform: translateX(-50%) rotate(45deg);
}

.text-hover-underline:hover {
    text-decoration: underline !important;
}`,

    // Popovers Mẫu 2 (Company Profile)
    'popovers2.html': `<button type="button" class="btn px-4 py-2 fw-semibold rounded-3 text-white border-0"
    style="background-color: #3b82f6;">
    Company profile
</button>


<div class="profile-popover-wrapper position-absolute bottom-100 start-50">


    <div class="profile-popover-card p-3 shadow-lg rounded-4 position-relative"
        style="width: 330px; background-color: #1f2937; border: 1px solid #374151;">


        <div class="d-flex align-items-center mb-3 gap-3">
            <div class="rounded-3 d-flex align-items-center justify-content-center overflow-hidden"
                style="width: 48px; height: 48px; background-color: #1e293b; border: 1px solid #374151;">
                <img src="https://flowbite.com/docs/images/logo.svg" alt="Flowbite Logo"
                    style="width: 28px; height: 28px;">
            </div>
            <div>
                <h6 class="mb-0 text-white fw-bold fs-6">Flowbite</h6>
                <div style="font-size: 14px; color: #9ca3af;">Tech company</div>
            </div>
        </div>


        <p class="mb-3" style="font-size: 14px; color: #9ca3af; line-height: 1.5;">
            Breaking news alerts and the most talked about stories.
        </p>


        <div class="d-flex align-items-center gap-2 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#9ca3af" viewBox="0 0 16 16">
                <path
                    d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                <path
                    d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
            </svg>
            <a href="https://flowbite.com/" class="text-decoration-none fw-medium"
                style="color: #3b82f6; font-size: 14px;">https://flowbite.com/</a>
        </div>


        <div class="d-flex align-items-start gap-2 mb-3" style="font-size: 14px; color: #9ca3af;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="mt-1"
                viewBox="0 0 16 16">
                <path
                    d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
            </svg>
            <div style="line-height: 1.4;">
                102,567,936 people like this<br>including 5 of your friends
            </div>
        </div>


        <div class="avatar-group mb-3 ms-1">
            <img class="avatar-img" src="https://flowbite.com/docs/images/people/profile-picture-1.jpg" alt="Friend 1">
            <img class="avatar-img" src="https://flowbite.com/docs/images/people/profile-picture-2.jpg" alt="Friend 2">
            <img class="avatar-img" src="https://flowbite.com/docs/images/people/profile-picture-3.jpg" alt="Friend 3">
            <div class="avatar-more">+3</div>
        </div>


        <div class="d-flex gap-2">
            <button
                class="btn action-btn flex-grow-1 d-flex align-items-center justify-content-center gap-2 fw-medium border-0 rounded-3"
                style="font-size: 14px; padding: 8px 0;">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 16 16">
                    <path
                        d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.112.33.118.684.057 1.023a.5.5 0 0 0 .51.598c.277-.013.593.048.86.195.275.15.52.4.67.794.12.316.14.61.08.895a.5.5 0 0 0 .633.596c.264-.065.534-.05.74.07.202.118.36.315.4.52.04.202.01.44-.06.634a.5.5 0 0 0 .618.648c.28-.08.572-.05.8.1.228.15.4.38.45.62.05.24.01.48-.09.68a.5.5 0 0 0 .58.706c.15-.03.3-.01.42.06.12.07.22.18.28.32.13.3-.06.72-.41.87-.35.15-.81.25-1.41.25z" />
                </svg>
                Like page
            </button>
            <button class="btn action-btn d-flex align-items-center justify-content-center border-0 rounded-3 px-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path
                        d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                </svg>
            </button>
        </div>


        <div class="popover-arrow position-absolute start-50"></div>
    </div>
</div>`,
    'popovers2.css': `.profile-popover-wrapper {
    visibility: hidden;
    opacity: 0;

    transform: translateY(10px) translateX(-50%);
    transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;
    z-index: 1050;

    padding-bottom: 12px;
}

.user-profile-container:hover .profile-popover-wrapper {
    visibility: visible;
    opacity: 1;
    transform: translateY(0) translateX(-50%);
}


.popover-arrow {
    bottom: 7px;
    width: 14px;
    height: 14px;
    background-color: #1f2937;
    border-bottom: 1px solid #374151;
    border-right: 1px solid #374151;
    transform: translateX(-50%) rotate(45deg);
    z-index: -1;
}


.avatar-group {
    display: flex;
    align-items: center;
}

.avatar-group .avatar-img {
    width: 32px;
    height: 32px;
    border: 2px solid #1f2937;
    border-radius: 50%;
    object-fit: cover;
    margin-left: -10px;
    position: relative;
}

.avatar-group .avatar-img:first-child {
    margin-left: 0;
}

.avatar-group .avatar-more {
    width: 32px;
    height: 32px;
    border: 2px solid #1f2937;
    border-radius: 50%;
    background-color: #374151;
    color: #f9fafb;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 600;
    margin-left: -10px;
    position: relative;
}


.action-btn {
    background-color: #374151;
    color: #f9fafb;
    transition: background-color 0.2s;
}

.action-btn:hover {
    background-color: #4b5563;
    color: #f9fafb;
}`,

    // Popovers Mẫu 3 (Advanced Filter)
    'popovers3.html': `<div class="dropdown">

    <button class="btn btn-trigger dropdown-toggle shadow-none" type="button" data-bs-toggle="dropdown"
        aria-expanded="false" data-bs-auto-close="outside">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" stroke-width="2" class="me-1">
            <path stroke-linecap="round" stroke-linejoin="round"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filter Contacts
    </button>

    <form class="dropdown-menu crm-popover p-4">
        <h6 class="crm-popover-title">Advanced Filter</h6>

        <div class="mb-3">
            <label class="form-label crm-label">Search Keyword</label>
            <div class="input-group">
                <span class="input-group-text crm-control border-end-0 bg-transparent px-2 text-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </span>
                <input type="text" class="form-control crm-control border-start-0 ps-0 shadow-none"
                    placeholder="Name, email or company...">
            </div>
        </div>

        <div class="mb-3">
            <label class="form-label crm-label">Lead Status</label>
            <select class="form-select crm-control shadow-none">
                <option selected>All Statuses</option>
                <option value="new">New Lead</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="lost">Lost</option>
            </select>
        </div>

        <div class="mb-4">
            <label class="form-label crm-label mb-2">Priority Tags</label>
            <div class="form-check mb-1">
                <input class="form-check-input crm-checkbox shadow-none" type="checkbox" id="tagVIP" checked>
                <label class="form-check-label" for="tagVIP">VIP Client</label>
            </div>
            <div class="form-check mb-1">
                <input class="form-check-input crm-checkbox shadow-none" type="checkbox" id="tagUrgent">
                <label class="form-check-label" for="tagUrgent">Urgent Follow-up</label>
            </div>
        </div>

        <div class="d-flex justify-content-end gap-2 mt-2">
            <button type="reset" class="btn btn-action-ghost btn-sm px-3">Clear</button>
            <button type="button" class="btn btn-action-primary btn-sm px-4">Apply Filters</button>
        </div>
    </form>
</div>`,
    'popovers3.css': `.btn-trigger {
    background-color: #3b82f6;
    color: #fff;
    font-weight: 500;
    border: none;
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    transition: all 0.2s;
}

.btn-trigger:hover {
    background-color: #2563eb;
    color: #fff;
}

.crm-popover {
    background-color: #1f2937;
    border: 1px solid #374151;
    border-radius: 0.75rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
    padding: 1.25rem;
    min-width: 320px;
    color: #e5e7eb;
    margin-top: 0.5rem !important;
}

.crm-popover-title {
    font-size: 1rem;
    font-weight: 600;
    color: #fff;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.crm-label {
    font-size: 0.85rem;
    font-weight: 500;
    color: #9ca3af;
    margin-bottom: 0.4rem;
}

.crm-control {
    background-color: #374151;
    border: 1px solid #4b5563;
    color: #f3f4f6;
    border-radius: 0.5rem;
    font-size: 0.9rem;
}

.crm-control:focus {
    background-color: #374151;
    border-color: #3b82f6;
    box-shadow: 0 0 0 0.25rem rgba(59, 130, 246, 0.25);
    color: #fff;
}

.crm-control::placeholder {
    color: #9ca3af;
}

.form-select.crm-control {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e");
}

.form-check-input.crm-checkbox {
    background-color: #374151;
    border-color: #4b5563;
    cursor: pointer;
}

.form-check-input.crm-checkbox:checked {
    background-color: #3b82f6;
    border-color: #3b82f6;
}

.form-check-label {
    font-size: 0.9rem;
    cursor: pointer;
    color: #d1d5db;
}

.btn-action-primary {
    background-color: #3b82f6;
    color: #fff;
    font-weight: 500;
    border-radius: 0.5rem;
}

.btn-action-primary:hover {
    background-color: #2563eb;
    color: #fff;
}

.btn-action-ghost {
    background-color: transparent;
    color: #9ca3af;
    font-weight: 500;
}

.btn-action-ghost:hover {
    background-color: #374151;
    color: #fff;
}`,

    // Popovers Mẫu 4 (Quick Activity Note)
    'popovers4.html': `<div class="dropdown">

    <button class="btn btn-trigger shadow-none" type="button" data-bs-toggle="dropdown" aria-expanded="false"
        data-bs-auto-close="outside">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" stroke-width="2" class="me-1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Quick Note
    </button>

    <form class="dropdown-menu crm-popover p-4">
        <h6 class="crm-popover-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2" style="color: #10b981;">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Add Activity Note
        </h6>

        <div class="mb-3">
            <label class="form-label crm-label">Related to (Contact/Deal)</label>
            <input type="text" class="form-control crm-control shadow-none" placeholder="Search..."
                value="Phạm Minh Hào">
        </div>

        <div class="mb-4">
            <label class="form-label crm-label">Note Details</label>
            <textarea class="form-control crm-control shadow-none" rows="4"
                placeholder="Log a call, meeting, or quick update..."></textarea>
        </div>

        <button type="submit" class="btn btn-action-primary w-100 py-2">Save Note</button>
    </form>
</div>`,
    'popovers4.css': `.btn-trigger {
    background-color: #10b981;
    color: #fff;
    font-weight: 500;
    border: none;
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    transition: all 0.2s;
}

.btn-trigger:hover {
    background-color: #059669;
    color: #fff;
}

.crm-popover {
    background-color: #1f2937;
    border: 1px solid #374151;
    border-radius: 0.75rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
    padding: 1.25rem;
    min-width: 300px;
    color: #e5e7eb;
    margin-top: 0.5rem !important;
}

.crm-popover-title {
    font-size: 1rem;
    font-weight: 600;
    color: #fff;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.crm-label {
    font-size: 0.85rem;
    font-weight: 500;
    color: #9ca3af;
    margin-bottom: 0.4rem;
}

.crm-control {
    background-color: #374151;
    border: 1px solid #4b5563;
    color: #f3f4f6;
    border-radius: 0.5rem;
    font-size: 0.9rem;
}

.crm-control:focus {
    background-color: #374151;
    border-color: #10b981;
    box-shadow: 0 0 0 0.25rem rgba(16, 185, 129, 0.25);
    color: #fff;
}

.crm-control::placeholder {
    color: #9ca3af;
}

.btn-action-primary {
    background-color: #10b981;
    color: #fff;
    font-weight: 500;
    border: none;
    border-radius: 0.5rem;
}

.btn-action-primary:hover {
    background-color: #059669;
    color: #fff;
}`,

    // Dropdown Mẫu 1 (User Account Profile)
    'dropdown1.html': `<button class="btn crm-nav-user-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
    <img src="https://ui-avatars.com/api/?name=Pham+Minh+Hao&background=cbd5e1&color=334155" alt="Avatar" width="24"
        height="24" class="rounded-circle">
    <span class="fw-medium" style="font-size: 0.9rem;">SMBPlus</span>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down"
        viewBox="0 0 16 16">
        <path fill-rule="evenodd"
            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
    </svg>
</button>


<div class="dropdown-menu dropdown-menu-end crm-dropdown-menu">


    <div class="crm-dropdown-header">
        <img src="https://ui-avatars.com/api/?name=Pham+Minh+Hao&background=e2e8f0&color=475569" alt="Profile"
            class="crm-profile-img">
        <div>
            <p class="crm-profile-name">PHẠM MINH HÀO</p>
            <p class="crm-profile-email">2351010052hao@ou.edu.vn</p>
        </div>
        <span class="crm-badge-pro">user</span>
    </div>


    <a href="#" class="crm-dropdown-item">

        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
        Account Info (SMBPlus)
    </a>

    <a href="#" class="crm-dropdown-item">

        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round"
                d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
        </svg>
        Create a user
    </a>

    <a href="#" class="crm-dropdown-item">

        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round"
                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
        </svg>
        Settings & Billing
    </a>


    <div class="crm-dropdown-divider"></div>


    <div class="crm-dropdown-item pe-2" onclick="event.stopPropagation();">

        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round"
                d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
        </svg>
        Dark mode

        <div class="form-check form-switch crm-form-switch m-0">
            <input class="form-check-input" type="checkbox" role="switch" id="darkModeSwitch" checked>
        </div>
    </div>


    <div class="crm-dropdown-divider"></div>


    <a href="#" class="crm-dropdown-item crm-item-danger">

        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
        </svg>
        Sign out
    </a>

</div>`,
    'dropdown1.css': ` .crm-nav-user-btn {
     background-color: transparent;
     border: 1px solid #374151;
     color: #e5e7eb;
     display: flex;
     align-items: center;
     gap: 0.5rem;
     padding: 0.375rem 0.75rem;
     border-radius: 2rem;
     transition: all 0.2s;
 }

 .crm-nav-user-btn:hover,
 .crm-nav-user-btn:focus {
     background-color: #1f2937;
     border-color: #4b5563;
     color: #fff;
 }

 .crm-dropdown-menu {
     background-color: #1f2937;
     border: 1px solid #374151;
     border-radius: 0.75rem;
     box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
     min-width: 280px;
     padding: 0.5rem;
     margin-top: 0.5rem !important;
 }

 .crm-dropdown-header {
     background-color: #374151;
     border-radius: 0.5rem;
     padding: 0.75rem;
     margin-bottom: 0.5rem;
     display: flex;
     align-items: center;
     gap: 0.75rem;
 }

 .crm-profile-img {
     width: 40px;
     height: 40px;
     border-radius: 50%;
     object-fit: cover;
     background-color: #e5e7eb;
 }

 .crm-profile-name {
     color: #f9fafb;
     font-weight: 600;
     font-size: 0.95rem;
     margin: 0;
     line-height: 1.2;
 }

 .crm-profile-email {
     color: #9ca3af;
     font-size: 0.8rem;
     margin: 0;
 }

 .crm-badge-pro {
     background-color: #1e3a8a;
     color: #93c5fd;
     font-size: 0.7rem;
     font-weight: 600;
     padding: 0.15rem 0.4rem;
     border-radius: 0.25rem;
     margin-left: auto;
 }

 .crm-dropdown-item {
     display: flex;
     align-items: center;
     gap: 0.75rem;
     padding: 0.5rem 0.75rem;
     color: #d1d5db;
     text-decoration: none;
     border-radius: 0.5rem;
     font-size: 0.9rem;
     font-weight: 500;
     transition: all 0.2s;
     cursor: pointer;
 }

 .crm-dropdown-item:hover {
     background-color: #374151;
     color: #fff;
 }

 .crm-dropdown-item svg {
     color: #9ca3af;
     width: 18px;
     height: 18px;
 }

 .crm-dropdown-item:hover svg {
     color: #d1d5db;
 }

 .crm-dropdown-divider {
     height: 1px;
     background-color: #374151;
     margin: 0.5rem 0;
 }


 .crm-form-switch {
     margin-left: auto;
     padding-left: 0;
 }

 .crm-form-switch .form-check-input {
     width: 2.5em;
     height: 1.25em;
     background-color: #4b5563;
     border: none;
     cursor: pointer;
     float: right;
     margin-left: 0;
 }

 .crm-form-switch .form-check-input:checked {
     background-color: #3b82f6;
 }

 .crm-item-danger {
     color: #ef4444;
 }

 .crm-item-danger svg {
     color: #ef4444;
 }

 .crm-item-danger:hover {
     background-color: rgba(239, 68, 68, 0.1);
     color: #f87171;
 }`,
    'dropdown1.js': `document.getElementById('darkModeSwitch').addEventListener('click', function (e) {
    e.stopPropagation();
});`,

    // Dropdown Mẫu 2 (Multi-level Submenu Dropend)
    'dropdown2.html': `<div class="btn-group dropend">

    <button type="button" class="btn crm-btn-more shadow-none" data-bs-toggle="dropdown" aria-expanded="false"
        data-bs-auto-close="outside">
        <div class="d-flex align-items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path
                    d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
            </svg>
            More
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" class="crm-icon-sm" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
    </button>

    <ul class="dropdown-menu crm-dropdown-menu">

        <li class="dropdown-submenu">
            <a class="dropdown-item crm-dropdown-item crm-item-active" href="#">
                <span>CRM</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="crm-icon-sm" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </a>

            <ul class="dropdown-menu crm-dropdown-menu">
                <li>
                    <a class="dropdown-item crm-dropdown-item" href="#">
                        <span>Contacts</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="crm-icon-sm" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M15 4.5v3.25l2.25 3.25v2.25H12.75v6h-1.5v-6H4.5v-2.25L6.75 7.75V4.5M15 4.5H4.5" />
                        </svg>
                    </a>
                </li>
                <li>
                    <a class="dropdown-item crm-dropdown-item" href="#">
                        <span>Companies</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="crm-icon-sm" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M15 4.5v3.25l2.25 3.25v2.25H12.75v6h-1.5v-6H4.5v-2.25L6.75 7.75V4.5M15 4.5H4.5" />
                        </svg>
                    </a>
                </li>
                <li>
                    <a class="dropdown-item crm-dropdown-item" href="#">
                        <span>Deals</span>
                    </a>
                </li>
                <li>
                    <a class="dropdown-item crm-dropdown-item" href="#">
                        <span>Tickets</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="crm-icon-sm" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M15 4.5v3.25l2.25 3.25v2.25H12.75v6h-1.5v-6H4.5v-2.25L6.75 7.75V4.5M15 4.5H4.5" />
                        </svg>
                    </a>
                </li>
            </ul>
        </li>

        <li>
            <a class="dropdown-item crm-dropdown-item" href="#">
                <span>Marketing</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="crm-icon-sm" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </a>
        </li>

        <li>
            <a class="dropdown-item crm-dropdown-item" href="#">
                <span>Content</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="crm-icon-sm" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </a>
        </li>
        <li>
            <a class="dropdown-item crm-dropdown-item" href="#">
                <span>Sales</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="crm-icon-sm" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </a>
        </li>
        <li>
            <a class="dropdown-item crm-dropdown-item" href="#">
                <span>Revenue</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="crm-icon-sm" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </a>
        </li>
        <li>
            <a class="dropdown-item crm-dropdown-item" href="#">
                <span>Service</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="crm-icon-sm" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </a>
        </li>
    </ul>
</div>`,
    'dropdown2.css': ` .crm-btn-more {
     background-color: #383838;
     color: #e4e4e7;
     border: none;
     border-radius: 0.5rem;
     padding: 0.6rem 0.8rem;
     display: flex;
     justify-content: space-between;
     align-items: center;
     font-weight: 500;
     width: 220px;
     transition: all 0.2s;
     font-family: 'Inter', sans-serif;
 }

 .crm-btn-more:hover,
 .crm-btn-more[aria-expanded="true"] {
     background-color: #4a4a4a;
     color: #fff;
 }

 .dropend .dropdown-menu {
     margin-top: -0.6rem !important;
     margin-left: 0.5rem !important;
 }

 .crm-dropdown-menu {
     background-color: #2d2d2d;
     border: 1px solid #404040;
     border-radius: 0.75rem;
     box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
     min-width: 220px;
     padding: 0.5rem;
     font-family: 'Inter', sans-serif;
 }

 .crm-dropdown-item {
     display: flex;
     align-items: center;
     justify-content: space-between;
     color: #e4e4e7;
     padding: 0.5rem 0.75rem;
     border-radius: 0.5rem;
     text-decoration: none;
     font-size: 0.95rem;
     font-weight: 400;
     transition: background-color 0.2s, color 0.2s;
     cursor: pointer;
 }

 .crm-dropdown-item:hover,
 .crm-item-active {
     background-color: #4a4a4a;
     color: #fff;
 }

 .crm-icon-sm {
     width: 16px;
     height: 16px;
     color: #a3a3a3;
 }

 .crm-dropdown-item:hover .crm-icon-sm {
     color: #fff;
 }

 .dropdown-submenu {
     position: relative;
 }

 .dropdown-submenu>.crm-dropdown-menu {
     top: 0;
     left: 100%;
     margin-top: -0.5rem !important;
     margin-left: 0.1rem !important;
     display: none;
     position: absolute;
     min-width: 240px;
 }

 .dropdown-submenu:hover>.crm-dropdown-menu {
     display: block;
 }`,

    // Dropdown Mẫu 3 (Quick Filter Search)
    'dropdown3.html': `<button
    class="btn btn-white bg-white rounded-circle border d-flex align-items-center justify-content-center p-0 shadow-sm"
    type="button" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside"
    style="width: 32px; height: 32px;" title="Add a quick filter">
    <i class="bi bi-plus text-secondary fs-5"></i>
</button>

<div class="dropdown-menu custom-dropdown-menu p-3 mt-2 border-0">

    <h6 class="dropdown-header px-0 text-dark fw-bold fs-6 mb-2">Add a quick filter</h6>

    <div class="dropdown-search-wrapper mb-3">
        <i class="bi bi-search"></i>
        <input type="text" class="form-control rounded-pill dropdown-search-input shadow-none" id="dropdownQuickSearch"
            placeholder="Search">
    </div>

    <div class="dropdown-category-title">Deal activity</div>

    <ul class="list-unstyled mb-0 custom-dropdown-list" id="dropdownActionList">
        <li>
            <a href="#" class="text-decoration-none d-flex align-items-center gap-2 rounded custom-dropdown-item">
                <span class="item-icon-box text-muted">Abc</span>
                <span>Campaign of last booking in meetings tool</span>
            </a>
        </li>
        <li>
            <a href="#" class="text-decoration-none d-flex align-items-center gap-2 rounded custom-dropdown-item">
                <span class="item-icon-box text-muted">Abc</span>
                <span>Closed lost reason</span>
            </a>
        </li>
        <li>
            <a href="#" class="text-decoration-none d-flex align-items-center gap-2 rounded custom-dropdown-item">
                <span class="item-icon-box text-muted">Abc</span>
                <span>Closed won reason</span>
            </a>
        </li>
        <li>
            <a href="#" class="text-decoration-none d-flex align-items-center gap-2 rounded custom-dropdown-item">
                <span class="item-icon-box text-muted"><i class="bi bi-calendar3"></i></span>
                <span>Date of last meeting booked in meetings tool</span>
            </a>
        </li>
        <li>
            <a href="#" class="text-decoration-none d-flex align-items-center gap-2 rounded custom-dropdown-item">
                <span class="item-icon-box text-muted"><i class="bi bi-check2-square"></i></span>
                <span>Deal stage</span>
            </a>
        </li>
        <li>
            <a href="#" class="text-decoration-none d-flex align-items-center gap-2 rounded custom-dropdown-item">
                <span class="item-icon-box text-muted">fx</span>
                <span>Has Last Conversation Follow Ups</span>
            </a>
        </li>
        <li>
            <a href="#" class="text-decoration-none d-flex align-items-center gap-2 rounded custom-dropdown-item">
                <span class="item-icon-box text-muted">fx</span>
                <span>Has Last Meeting Follow Ups</span>
            </a>
        </li>

    </ul>

</div>`,
    'dropdown3.css': `.custom-dropdown-menu {
    width: 360px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
}

.dropdown-search-wrapper {
    position: relative;
}

.dropdown-search-wrapper i {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #6c757d;
}

.dropdown-search-input {
    padding-left: 2.5rem;
    border-color: #dee2e6;
    transition: all 0.2s;
}

.dropdown-search-input:focus {
    border-color: #0d6efd;
    box-shadow: 0 0 0 0.15rem rgba(13, 110, 253, 0.15);
}

.dropdown-category-title {
    font-size: 0.85rem;
    color: #212529;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.custom-dropdown-list {
    max-height: 280px;
    overflow-y: auto;
    padding-right: 4px;
}

.custom-dropdown-list::-webkit-scrollbar {
    width: 6px;
}

.custom-dropdown-list::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 4px;
}

.custom-dropdown-list::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
}

.custom-dropdown-item {
    font-size: 0.875rem;
    color: #495057;
    padding: 0.5rem 0.5rem;
    transition: background-color 0.15s;
    cursor: pointer;
}

.custom-dropdown-item:hover {
    background-color: #f8f9fa;
    color: #212529;
}

.item-icon-box {
    width: 24px;
    display: inline-flex;
    justify-content: center;
    color: #868e96;
    font-size: 0.9rem;
    font-style: italic;
}`,
    'dropdown3.js': `document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById('dropdownQuickSearch');
    const listItems = document.querySelectorAll('#dropdownActionList li');

    if (searchInput && listItems.length > 0) {
        searchInput.addEventListener('keyup', function () {

            let filter = searchInput.value.toLowerCase();

            listItems.forEach(function (item) {

                let textValue = item.textContent || item.innerText;

                if (textValue.toLowerCase().indexOf(filter) > -1) {
                    item.style.display = "";
                } else {
                    item.style.display = "none";
                }
            });
        });
    }
});`
,

    'modal1.html': `<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createCompanyModal">
    <i class="bi bi-plus-lg"></i> Open Create Company Modal
</button>


<div class="modal fade" id="createCompanyModal" tabindex="-1" aria-labelledby="createCompanyModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content crm-modal-dark p-2">
            <div class="modal-header border-0 pb-0">
                <h5 class="modal-title fw-bold" id="createCompanyModalLabel">Create new company</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>
            <div class="modal-body border-bottom border-secondary border-opacity-25 mb-3">
                <form action="#" method="POST">
                    @csrf
                    <div class="mb-3">
                        <label class="form-label text-light fs-6 fw-semibold mb-1">Company Name</label>
                        <input type="text" class="form-control crm-input-dark py-2" name="name"
                            placeholder="Type company name">
                    </div>
                    <div class="row mb-3">
                        <div class="col-6">
                            <label class="form-label text-light fs-6 fw-semibold mb-1">Estimated Value</label>
                            <input type="text" class="form-control crm-input-dark py-2" name="value"
                                placeholder="$50,000">
                        </div>
                        <div class="col-6">
                            <label class="form-label text-light fs-6 fw-semibold mb-1">Industry</label>
                            <select class="form-select crm-input-dark py-2" name="industry">
                                <option selected>Select industry</option>
                                <option value="tech">Technology</option>
                                <option value="finance">Finance</option>
                                <option value="health">Healthcare</option>
                            </select>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label text-light fs-6 fw-semibold mb-1">Company Description</label>
                        <textarea class="form-control crm-input-dark" name="description" rows="4"
                            placeholder="Write company background here..."></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer border-0 pt-0 justify-content-start">
                <button type="button" class="btn crm-btn-primary px-4 py-2 me-2">
                    <i class="bi bi-plus"></i> Add new company
                </button>
                <button type="button" class="btn crm-btn-cancel px-4 py-2" data-bs-dismiss="modal">Cancel</button>
            </div>
        </div>
    </div>
</div>`,
    'modal1.css': `.crm-modal-dark {
    background-color: #1e293b;
    color: #f8fafc;
    border: 1px solid #334155;
    border-radius: 0.75rem;
}

.crm-input-dark {
    background-color: #334155;
    border: 1px solid #475569;
    color: #f8fafc;
    border-radius: 0.5rem;
}

.crm-input-dark:focus {
    background-color: #334155;
    border-color: #3b82f6;
    color: #f8fafc;
    box-shadow: 0 0 0 0.25rem rgba(59, 130, 246, 0.25);
}

.crm-btn-primary {
    background-color: #3b82f6;
    border-color: #3b82f6;
    border-radius: 0.5rem;
    font-weight: 500;
}

.crm-btn-primary:hover {
    background-color: #2563eb;
}

.crm-btn-cancel {
    background-color: #334155;
    border: 1px solid #475569;
    color: #cbd5e1;
    border-radius: 0.5rem;
}

.crm-btn-cancel:hover {
    background-color: #475569;
    color: white;
}`,
    'modal2.html': `<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#dealActivityModal">
    <i class="bi bi-clock-history"></i> Open Deal Activity
</button>


<div class="modal fade" id="dealActivityModal" tabindex="-1" aria-labelledby="dealActivityModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content crm-modal-dark p-2">
            <div class="modal-header border-0 pb-0">
                <h5 class="modal-title fw-bold" id="dealActivityModalLabel">Deal Activity Log</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>
            <div class="modal-body mt-3">
                <div class="timeline-item mb-4 pb-2">
                    <div class="timeline-icon"><i class="bi bi-file-earmark-text"></i></div>
                    <h6 class="fw-bold mb-1">Contract Sent to Client</h6>
                    <p class="text-secondary small mb-2">Proposal v2.0 including new pricing models.</p>
                    <button class="btn timeline-btn py-1 px-3"><i class="bi bi-download me-1"></i> Download PDF</button>
                </div>
                <div class="timeline-item mb-4 pb-2">
                    <div class="timeline-icon"><i class="bi bi-camera-video"></i></div>
                    <h6 class="fw-bold mb-1">Negotiation Meeting</h6>
                    <p class="text-secondary small mb-2">Discussed terms with technical team.</p>
                    <button class="btn timeline-btn py-1 px-3"><i class="bi bi-eye me-1"></i> View Notes</button>
                </div>
                <div class="timeline-item mb-2 border-0">
                    <div class="timeline-icon"><i class="bi bi-flag"></i></div>
                    <h6 class="fw-bold mb-1">Deal Stage: Qualification</h6>
                    <p class="text-secondary small mb-2">Lead successfully qualified by marketing.</p>
                    <button class="btn timeline-btn py-1 px-3"><i class="bi bi-box-arrow-up-right me-1"></i> Open
                        Details</button>
                </div>
            </div>
            <div class="modal-footer border-0 pt-0 d-block">
                <button type="button" class="btn crm-btn-primary w-100 py-2">View Full History</button>
            </div>
        </div>
    </div>
</div>`,
    'modal2.css': ` .crm-modal-dark {
     background-color: #1e293b;
     color: #f8fafc;
     border: 1px solid #334155;
     border-radius: 0.75rem;
 }

 .crm-btn-primary {
     background-color: #3b82f6;
     border-color: #3b82f6;
     border-radius: 0.5rem;
     font-weight: 500;
 }

 .crm-btn-primary:hover {
     background-color: #2563eb;
 }

 .timeline-item {
     border-left: 1px solid #475569;
     margin-left: 1rem;
     padding-left: 1.5rem;
     position: relative;
 }

 .timeline-icon {
     position: absolute;
     left: -0.75rem;
     top: 0;
     background-color: #334155;
     border-radius: 50%;
     width: 1.5rem;
     height: 1.5rem;
     display: flex;
     align-items: center;
     justify-content: center;
     color: #3b82f6;
     font-size: 0.75rem;
 }

 .timeline-btn {
     background-color: #334155;
     color: #cbd5e1;
     border: 1px solid #475569;
     font-size: 0.85rem;
     border-radius: 0.5rem;
 }

 .timeline-btn:hover {
     background-color: #475569;
     color: white;
 }`,
    'modal3.html': `<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#connectContactModal">
    <i class="bi bi-person-lines-fill"></i> Open Contact Channel
</button>


<div class="modal fade" id="connectContactModal" tabindex="-1" aria-labelledby="connectContactModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content crm-modal-dark p-2">
            <div class="modal-header border-0 pb-0">
                <h5 class="modal-title fw-bold" id="connectContactModalLabel">Reach out</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p class="text-secondary mb-4 small">Select a preferred channel to communicate with this contact or sync
                    their data.</p>

                <div class="contact-option d-flex align-items-center justify-content-between p-3 mb-3">
                    <div class="d-flex align-items-center">
                        <i class="bi bi-linkedin fs-4 text-primary me-3"></i>
                        <span class="fw-semibold text-white">LinkedIn Message</span>
                    </div>
                    <span class="badge rounded-pill contact-badge px-2 py-1">Primary</span>
                </div>

                <div class="contact-option d-flex align-items-center p-3 mb-3">
                    <i class="bi bi-envelope-fill fs-4 text-light me-3"></i>
                    <span class="fw-semibold text-white">Direct Email</span>
                </div>

                <div class="contact-option d-flex align-items-center p-3 mb-3">
                    <i class="bi bi-telephone-fill fs-4 text-success me-3"></i>
                    <span class="fw-semibold text-white">Phone Call</span>
                </div>

                <div class="contact-option d-flex align-items-center p-3 mb-3">
                    <i class="bi bi-whatsapp fs-4 text-success me-3"></i>
                    <span class="fw-semibold text-white">WhatsApp Business</span>
                </div>

                <div class="contact-option d-flex align-items-center p-3 mb-2">
                    <i class="bi bi-calendar-event-fill fs-4 text-info me-3"></i>
                    <span class="fw-semibold text-white">Schedule Meeting</span>
                </div>

                <div class="mt-3">
                    <a href="#" class="text-secondary small text-decoration-none"><i
                            class="bi bi-question-circle me-1"></i> How are interactions logged?</a>
                </div>
            </div>
        </div>
    </div>
</div>`,
    'modal3.css': `.crm-modal-dark {
    background-color: #1e293b;
    color: #f8fafc;
    border: 1px solid #334155;
    border-radius: 0.75rem;
}

.contact-option {
    background-color: #334155;
    border: 1px solid #475569;
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
}

.contact-option:hover {
    background-color: #475569;
    border-color: #64748b;
}

.contact-badge {
    font-size: 0.7rem;
    background-color: #374151;
    color: #9ca3af;
    border: 1px solid #475569;
}`,
    'modal4.html': `<button type="button" class="btn crm-btn-toggle px-4 py-2 rounded-3" data-bs-toggle="modal"
    data-bs-target="#deleteCrmRecordModal">
    Toggle modal
</button>


<div class="modal fade" id="deleteCrmRecordModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content crm-modal-content">


            <div class="modal-header border-0 pb-0 justify-content-end">
                <button type="button" class="btn-close btn-close-white shadow-none" data-bs-dismiss="modal"
                    aria-label="Close"></button>
            </div>

            <div class="modal-body text-center pb-4 pt-0 px-4">

                <div class="mb-4 d-flex justify-content-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="1.5" class="crm-icon-warning">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>


                <h5 class="fw-normal mb-4 crm-modal-text">
                    Are you sure you want to delete this lead from your CRM account?
                </h5>


                <div class="d-flex justify-content-center gap-3 mt-2">

                    <button type="button" class="btn crm-btn-danger px-4 py-2 rounded-3 text-white fw-medium"
                        data-bs-dismiss="modal">
                        Yes, I'm sure
                    </button>


                    <button type="button" class="btn crm-btn-cancel px-4 py-2 rounded-3 fw-medium"
                        data-bs-dismiss="modal">
                        No, cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>`,
    'modal4.css': `.crm-btn-toggle {
    background-color: #1e3a8a;
    border-color: #3b82f6;
    color: #93c5fd;
    font-weight: 500;
}

.crm-btn-toggle:hover {
    background-color: #1e40af;
    color: #fff;
}

.crm-modal-content {
    background-color: #1f2937;
    color: #f3f4f6;
    border-radius: 0.75rem;
    border: none;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.crm-modal-text {
    color: #d1d5db;
    font-size: 1.1rem;
    line-height: 1.5;
}

.crm-icon-warning {
    color: #9ca3af;
}

.crm-btn-danger {
    background-color: #dc2626;
    border: none;
}

.crm-btn-danger:hover {
    background-color: #b91c1c;
}

.crm-btn-cancel {
    background-color: #374151;
    border: 1px solid #4b5563;
    color: #f3f4f6;
}

.crm-btn-cancel:hover {
    background-color: #4b5563;
    color: #fff;
}`,
    'modal5.html': `<div class="quick-filter-bar">

    <button type="button" class="btn-qf-text" data-filter="Ticket owner">
        Ticket owner <i class="bi bi-caret-down-fill"></i>
    </button>

    <button type="button" class="btn-qf-text" data-filter="Create date">
        Create date <i class="bi bi-caret-down-fill"></i>
    </button>

    <button type="button" class="btn-qf-text" data-filter="Last activity date">
        Last activity date <i class="bi bi-caret-down-fill"></i>
    </button>

    <button type="button" class="btn-qf-text" data-filter="Priority">
        Priority <i class="bi bi-caret-down-fill"></i>
    </button>

    <div class="qf-divider"></div>

    <button type="button" class="btn-qf-circle shadow-sm" data-bs-toggle="modal" data-bs-target="#editQuickFiltersModal"
        title="Edit quick filters">
        <i class="bi bi-pencil"></i>
    </button>

</div>

<div class="modal fade" id="editQuickFiltersModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content hubspot-style">

            <div class="modal-header hubspot-style">
                <h5 class="modal-title">Edit quick filters</h5>
                <button type="button" class="btn-close shadow-none" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div class="modal-body hubspot-style pb-2">
                <div class="filter-count-text">Quick filters used: <span id="filterCounter">4</span>/10</div>

                <div id="filterListContainer">

                    <div class="filter-item-row">
                        <div class="filter-select-wrapper">
                            <i class="bi bi-person-check prefix-icon"></i>
                            <select class="form-select">
                                <option selected>Ticket owner</option>
                                <option>Deal owner</option>
                                <option>Create date</option>
                                <option>Close date</option>
                                <option>Last activity date</option>
                                <option>Priority</option>
                                <option>Ticket status</option>
                                <option>Source</option>
                                <option>Associated company</option>
                                <option>Associated contact</option>
                            </select>
                        </div>
                        <button type="button" class="btn-trash" title="Delete filter">
                            <i class="bi bi-trash3"></i>
                        </button>
                    </div>

                    <div class="filter-item-row">
                        <div class="filter-select-wrapper">
                            <i class="bi bi-calendar3 prefix-icon"></i>
                            <select class="form-select">
                                <option>Ticket owner</option>
                                <option>Deal owner</option>
                                <option selected>Create date</option>
                                <option>Close date</option>
                                <option>Last activity date</option>
                                <option>Priority</option>
                                <option>Ticket status</option>
                                <option>Source</option>
                                <option>Associated company</option>
                                <option>Associated contact</option>
                            </select>
                        </div>
                        <button type="button" class="btn-trash" title="Delete filter">
                            <i class="bi bi-trash3"></i>
                        </button>
                    </div>

                    <div class="filter-item-row">
                        <div class="filter-select-wrapper">
                            <i class="bi bi-calendar-check prefix-icon"></i>
                            <select class="form-select">
                                <option>Ticket owner</option>
                                <option>Deal owner</option>
                                <option>Create date</option>
                                <option>Close date</option>
                                <option selected>Last activity date</option>
                                <option>Priority</option>
                                <option>Ticket status</option>
                                <option>Source</option>
                                <option>Associated company</option>
                                <option>Associated contact</option>
                            </select>
                        </div>
                        <button type="button" class="btn-trash" title="Delete filter">
                            <i class="bi bi-trash3"></i>
                        </button>
                    </div>

                    <div class="filter-item-row">
                        <div class="filter-select-wrapper">
                            <i class="bi bi-list-task prefix-icon"></i>
                            <select class="form-select">
                                <option>Ticket owner</option>
                                <option>Deal owner</option>
                                <option>Create date</option>
                                <option>Close date</option>
                                <option>Last activity date</option>
                                <option selected>Priority</option>
                                <option>Ticket status</option>
                                <option>Source</option>
                                <option>Associated company</option>
                                <option>Associated contact</option>
                            </select>
                        </div>
                        <button type="button" class="btn-trash" title="Delete filter">
                            <i class="bi bi-trash3"></i>
                        </button>
                    </div>

                </div>

                <div class="d-flex gap-2 mt-4">
                    <button type="button" class="btn-action-pill shadow-none" id="btnAddFilter">
                        <i class="bi bi-plus-lg"></i> Add quick filter
                    </button>
                    <button type="button" class="btn-action-pill shadow-none" id="btnClearFilters">
                        <i class="bi bi-trash3"></i> Delete all quick filters
                    </button>
                </div>
            </div>

            <div class="modal-footer hubspot-style mt-3">
                <button type="button" class="btn-hs-primary shadow-none" data-bs-dismiss="modal">Done</button>
                <button type="button" class="btn-hs-outline shadow-none" data-bs-dismiss="modal">Cancel</button>
            </div>

        </div>
    </div>
</div>`,
    'modal5.css': `.quick-filter-bar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 0;
}

.btn-qf-text {
    font-weight: 600;
    color: #33475b;
    border: none;
    background: transparent;
    padding: 0.4rem 0.75rem;
    border-radius: 4px;
    font-size: 0.95rem;
    transition: background-color 0.2s, color 0.2s;
    display: flex;
    align-items: center;
    gap: 0.4rem;
}

.btn-qf-text:hover {
    background-color: #f5f8fa;
    color: #0091ae;
}

.btn-qf-text i {
    font-size: 0.75rem;
    color: #516f90;
}

.qf-divider {
    width: 1px;
    height: 24px;
    background-color: #cbd6e2;
    margin: 0 0.5rem;
}

.btn-qf-circle {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid #cbd6e2;
    background: white;
    color: #33475b;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    cursor: pointer;
}

.btn-qf-circle:hover {
    background-color: #f5f8fa;
    border-color: #7c98b6;
}

.modal-content.hubspot-style {
    border: none;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.modal-header.hubspot-style {
    border-bottom: 1px solid #e5e7eb;
    padding: 1.25rem 1.5rem;
}

.modal-title {
    font-weight: 600;
    color: #212529;
    font-size: 1.25rem;
}

.modal-body.hubspot-style {
    padding: 1.5rem;
}

.filter-count-text {
    font-size: 0.875rem;
    color: #495057;
    margin-bottom: 1rem;
}

.filter-item-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
}

.filter-select-wrapper {
    position: relative;
    flex-grow: 1;
}

.filter-select-wrapper .prefix-icon {
    position: absolute;
    left: 0.875rem;
    top: 50%;
    transform: translateY(-50%);
    color: #868e96;
    font-size: 0.9rem;
    pointer-events: none;
}

.filter-select-wrapper .form-select {
    padding-left: 2.25rem;
    border-radius: 6px;
    border: 1px solid #ced4da;
    color: #495057;
    font-size: 0.9rem;
    height: 42px;
    box-shadow: none;
    cursor: pointer;
}

.filter-select-wrapper .form-select:focus {
    border-color: #0d6efd;
}

.btn-trash {
    background: transparent;
    border: none;
    color: #6c757d;
    padding: 0.5rem;
    border-radius: 6px;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-trash:hover {
    background-color: #f3f4f6;
    color: #dc3545;
}

.btn-action-pill {
    background: white;
    border: 1px solid #ced4da;
    border-radius: 20px;
    padding: 0.4rem 1rem;
    font-size: 0.825rem;
    color: #495057;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
}

.btn-action-pill:hover {
    background-color: #f8f9fa;
    color: #212529;
}

.modal-footer.hubspot-style {
    border-top: none;
    padding: 0 1.5rem 1.5rem 1.5rem;
    justify-content: flex-start;
    gap: 0.75rem;
}

.btn-hs-primary {
    background-color: #224341;
    color: white;
    border-radius: 6px;
    padding: 0.5rem 1.5rem;
    font-weight: 600;
    border: none;
    transition: background-color 0.2s;
}

.btn-hs-primary:hover {
    background-color: #18302f;
    color: white;
}

.btn-hs-outline {
    background-color: white;
    color: #212529;
    border: 1px solid #ced4da;
    border-radius: 6px;
    padding: 0.5rem 1.5rem;
    font-weight: 600;
    transition: background-color 0.2s;
}

.btn-hs-outline:hover {
    background-color: #f8f9fa;
}

.btn-qf-text.active {
    background-color: #eaf0f6;
    color: #0091ae;
}

.btn-qf-text.active i {
    color: #0091ae;
}

.btn-action-pill:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}

.qf-empty-notice {
    color: #868e96;
    font-size: 0.875rem;
    padding: 0.4rem 0.75rem;
}`,
    'modal5.js': `/**
 * HubSpot CRM - Edit Quick Filters Modal Component
 * Tự động đồng bộ các bộ lọc trong Modal với thanh Quick Filter Bar bên ngoài
 */

document.addEventListener("DOMContentLoaded", function () {
    const modalEl = document.getElementById('editQuickFiltersModal');
    const filterContainer = document.getElementById('filterListContainer');
    const filterCounter = document.getElementById('filterCounter');
    const btnClearFilters = document.getElementById('btnClearFilters');
    const btnAddFilter = document.getElementById('btnAddFilter');

    // Danh mục các bộ lọc CRM khả dụng và icon tương ứng
    const FILTER_OPTIONS = [
        { value: 'Ticket owner', icon: 'bi-person-check' },
        { value: 'Deal owner', icon: 'bi-person-badge' },
        { value: 'Create date', icon: 'bi-calendar3' },
        { value: 'Close date', icon: 'bi-calendar-x' },
        { value: 'Last activity date', icon: 'bi-calendar-check' },
        { value: 'Priority', icon: 'bi-list-task' },
        { value: 'Ticket status', icon: 'bi-check2-circle' },
        { value: 'Source', icon: 'bi-diagram-3' },
        { value: 'Associated company', icon: 'bi-building' },
        { value: 'Associated contact', icon: 'bi-people' }
    ];

    const MAX_FILTERS = 10;
    let savedModalHtml = '';

    // 1. Hàm cập nhật số đếm filters
    function updateCounter() {
        if (!filterContainer || !filterCounter) return;
        const count = filterContainer.querySelectorAll('.filter-item-row').length;
        filterCounter.textContent = count;

        if (btnAddFilter) {
            if (count >= MAX_FILTERS) {
                btnAddFilter.disabled = true;
                btnAddFilter.classList.add('opacity-50');
            } else {
                btnAddFilter.disabled = false;
                btnAddFilter.classList.remove('opacity-50');
            }
        }
    }

    // 2. Hàm đồng bộ danh sách filters ra thanh Quick Filter Bar bên ngoài
    function syncFiltersToBar() {
        const filterBars = document.querySelectorAll('.quick-filter-bar');
        if (!filterBars.length || !filterContainer) return;

        // Lấy danh sách tên filter hiện tại từ các row trong modal
        const rows = filterContainer.querySelectorAll('.filter-item-row');
        const activeFilters = [];
        rows.forEach(row => {
            const select = row.querySelector('.form-select');
            if (select && select.value) {
                activeFilters.push(select.value);
            }
        });

        filterBars.forEach(bar => {
            const divider = bar.querySelector('.qf-divider');

            // Xóa tất cả các nút filter cũ và thông báo trống trước divider
            const oldBtns = bar.querySelectorAll('.btn-qf-text');
            oldBtns.forEach(btn => btn.remove());
            const emptyNotice = bar.querySelector('.qf-empty-notice');
            if (emptyNotice) emptyNotice.remove();

            if (activeFilters.length === 0) {
                const notice = document.createElement('span');
                notice.className = 'text-muted small fst-italic me-2 qf-empty-notice';
                notice.style.fontSize = '0.85rem';
                notice.textContent = 'Chưa có bộ lọc nhanh';
                if (divider) {
                    bar.insertBefore(notice, divider);
                } else {
                    bar.appendChild(notice);
                }
            } else {
                // Thêm các nút filter mới tương ứng với các item trong modal
                activeFilters.forEach(name => {
                    const btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = 'btn-qf-text';
                    btn.setAttribute('data-filter', name);
                    btn.innerHTML = \`\${name} <i class="bi bi-caret-down-fill"></i>\`;
                    if (divider) {
                        bar.insertBefore(btn, divider);
                    } else {
                        bar.appendChild(btn);
                    }
                });
            }

            // Bắn custom event để dev khác có thể lắng nghe sự kiện thay đổi filter
            bar.dispatchEvent(new CustomEvent('filtersChanged', {
                bubbles: true,
                detail: { filters: activeFilters }
            }));
        });
    }

    // 3. Hàm tạo một dòng filter item mới
    function createFilterRow(selectedName) {
        const filter = FILTER_OPTIONS.find(f => f.value === selectedName) || FILTER_OPTIONS[0];
        const row = document.createElement('div');
        row.className = 'filter-item-row';

        let optionsHtml = '';
        FILTER_OPTIONS.forEach(opt => {
            const isSel = opt.value === filter.value ? 'selected' : '';
            optionsHtml += \`<option value="\${opt.value}" \${isSel}>\${opt.value}</option>\`;
        });

        row.innerHTML = \`
            <div class="filter-select-wrapper">
                <i class="bi \${filter.icon} prefix-icon"></i>
                <select class="form-select">
                    \${optionsHtml}
                </select>
            </div>
            <button type="button" class="btn-trash" title="Delete filter">
                <i class="bi bi-trash3"></i>
            </button>
        \`;
        return row;
    }

    // 4. Chuẩn hóa tất cả các dropdown có sẵn trong modal để có đầy đủ lựa chọn
    if (filterContainer) {
        filterContainer.querySelectorAll('.filter-item-row').forEach(row => {
            const select = row.querySelector('.form-select');
            const iconEl = row.querySelector('.prefix-icon');
            if (select) {
                const currentVal = select.value;
                if (select.options.length < FILTER_OPTIONS.length) {
                    select.innerHTML = '';
                    FILTER_OPTIONS.forEach(opt => {
                        const optEl = document.createElement('option');
                        optEl.value = opt.value;
                        optEl.textContent = opt.value;
                        if (opt.value === currentVal) optEl.selected = true;
                        select.appendChild(optEl);
                    });
                }
                // Đồng bộ lại icon tương ứng
                const optMatch = FILTER_OPTIONS.find(o => o.value === currentVal);
                if (optMatch && iconEl) {
                    iconEl.className = \`bi \${optMatch.icon} prefix-icon\`;
                }
            }
        });
    }

    // 5. Xử lý khi người dùng đổi option trong dropdown (<select>)
    if (filterContainer) {
        filterContainer.addEventListener('change', function (e) {
            const select = e.target.closest('.form-select');
            if (select) {
                const selectedVal = select.value;
                const wrapper = select.closest('.filter-select-wrapper');
                const iconEl = wrapper ? wrapper.querySelector('.prefix-icon') : null;
                const optMatch = FILTER_OPTIONS.find(o => o.value === selectedVal);
                if (iconEl && optMatch) {
                    iconEl.className = \`bi \${optMatch.icon} prefix-icon\`;
                }
                syncFiltersToBar();
            }
        });

        // Xử lý nút xóa từng filter
        filterContainer.addEventListener('click', function (e) {
            const trashBtn = e.target.closest('.btn-trash');
            if (trashBtn) {
                const row = trashBtn.closest('.filter-item-row');
                if (row) {
                    row.remove();
                    updateCounter();
                    syncFiltersToBar();
                }
            }
        });
    }

    // 6. Xử lý nút "Add quick filter"
    if (btnAddFilter) {
        btnAddFilter.addEventListener('click', function () {
            if (!filterContainer) return;
            const currentRows = filterContainer.querySelectorAll('.filter-item-row');
            if (currentRows.length >= MAX_FILTERS) return;

            // Tìm filter chưa được dùng
            const usedFilters = Array.from(currentRows).map(r => {
                const sel = r.querySelector('.form-select');
                return sel ? sel.value : '';
            });

            const nextFilter = FILTER_OPTIONS.find(o => !usedFilters.includes(o.value)) || FILTER_OPTIONS[0];
            const newRow = createFilterRow(nextFilter.value);
            filterContainer.appendChild(newRow);

            updateCounter();
            syncFiltersToBar();
        });
    }

    // 7. Xử lý nút "Delete all quick filters"
    if (btnClearFilters) {
        btnClearFilters.addEventListener('click', function () {
            if (filterContainer) {
                filterContainer.innerHTML = '';
                updateCounter();
                syncFiltersToBar();
            }
        });
    }

    // 8. Quản lý trạng thái Modal (Lưu snapshot, Done, Cancel)
    if (modalEl) {
        // Lưu trạng thái trước khi mở modal
        modalEl.addEventListener('show.bs.modal', function () {
            savedModalHtml = filterContainer ? filterContainer.innerHTML : '';
        });

        // Bấm Cancel: Khôi phục lại trạng thái cũ
        const cancelBtn = modalEl.querySelector('.btn-hs-outline');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function () {
                if (filterContainer && savedModalHtml !== '') {
                    filterContainer.innerHTML = savedModalHtml;
                    updateCounter();
                    syncFiltersToBar();
                }
            });
        }

        // Bấm Done: Xác nhận lưu các thay đổi
        const doneBtn = modalEl.querySelector('.btn-hs-primary');
        if (doneBtn) {
            doneBtn.addEventListener('click', function () {
                savedModalHtml = filterContainer ? filterContainer.innerHTML : '';
                updateCounter();
                syncFiltersToBar();
            });
        }
    }

    // 9. Cho phép click vào từng nút filter bên ngoài để toggle active state
    document.addEventListener('click', function (e) {
        const qfBtn = e.target.closest('.btn-qf-text');
        if (qfBtn) {
            qfBtn.classList.toggle('active');
            const filterName = qfBtn.getAttribute('data-filter') || qfBtn.textContent.trim();
            qfBtn.dispatchEvent(new CustomEvent('filter:click', {
                bubbles: true,
                detail: { filterName: filterName, isActive: qfBtn.classList.contains('active') }
            }));
        }
    });

    // Đồng bộ ban đầu khi load trang
    updateCounter();
    syncFiltersToBar();
});`
,

    'card1.html': `<div class="container-fluid">

    <div class="crm-detail-card">

        <div class="crm-detail-header">
            <a href="#" class="text-decoration-none text-dark fw-medium d-flex align-items-center gap-1">
                <i class="bi bi-chevron-left"></i> Deals
            </a>
            <div class="dropdown">
                <button class="btn btn-light btn-sm border dropdown-toggle fw-medium px-2 py-1" type="button"
                    data-bs-toggle="dropdown">
                    Actions
                </button>
                <ul class="dropdown-menu dropdown-menu-end shadow-sm">
                    <li><a class="dropdown-item" href="#"><i class="bi bi-pencil me-2"></i> Edit</a></li>
                    <li><a class="dropdown-item" href="#"><i class="bi bi-share me-2"></i> Share</a></li>
                    <li>
                        <hr class="dropdown-divider">
                    </li>
                    <li><a class="dropdown-item text-danger" href="#"><i class="bi bi-trash me-2"></i> Delete</a></li>
                </ul>
            </div>
        </div>

        <div class="crm-detail-body">
            <div class="d-flex align-items-center gap-3 mb-3">
                <div class="deal-icon-box">
                    <i class="bi bi-handshake"></i>
                </div>
                <h4 class="mb-0 fw-bold text-dark">test</h4>
            </div>

            <div class="d-flex flex-column gap-2 mb-4 fs-6">
                <div class="text-secondary">
                    Amount: <span class="text-dark fw-semibold">$10</span>
                </div>
                <div class="text-secondary d-flex align-items-center gap-1">
                    Close Date: <i class="bi bi-calendar3"></i> <span class="text-dark fw-semibold">09/30/2026</span>
                </div>
                <div class="text-secondary d-flex align-items-center gap-2">
                    Pipeline: <span class="badge text-bg-light border text-dark fw-medium px-2 py-1">Sales
                        Pipeline</span>
                </div>
                <div class="text-secondary d-flex align-items-center gap-2">
                    Deal Stage: <span class="badge text-bg-primary px-2 py-1 fw-medium text-truncate"
                        style="max-width: 170px;">Appointment Scheduled</span>
                </div>
            </div>

            <div class="d-flex justify-content-between align-items-center pt-2 border-top">
                <button type="button" class="action-btn-item">
                    <span class="action-icon-circle"><i class="bi bi-journal-text"></i></span>
                    Note
                </button>
                <button type="button" class="action-btn-item">
                    <span class="action-icon-circle"><i class="bi bi-envelope"></i></span>
                    Email
                </button>
                <button type="button" class="action-btn-item">
                    <span class="action-icon-circle"><i class="bi bi-telephone"></i></span>
                    Call
                </button>
                <button type="button" class="action-btn-item">
                    <span class="action-icon-circle"><i class="bi bi-list-check"></i></span>
                    Task
                </button>
                <button type="button" class="action-btn-item">
                    <span class="action-icon-circle"><i class="bi bi-calendar-event"></i></span>
                    Meeting
                </button>
                <button type="button" class="action-btn-item">
                    <span class="action-icon-circle"><i class="bi bi-three-dots"></i></span>
                    More
                </button>
            </div>
        </div>
    </div>

</div>`,
    'card1.css': `.crm-detail-card {
    background-color: #ffffff;
    border: 1px solid #dee2e6;
    border-radius: 0.75rem;
    width: 360px;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.05);
    overflow: hidden;
}

.crm-detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid #f1f3f5;
}

.crm-detail-body {
    padding: 1.25rem;
}

.deal-icon-box {
    width: 36px;
    height: 36px;
    background-color: #f1f3f5;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #495057;
    font-size: 1.1rem;
}

.action-btn-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: none;
    border: none;
    padding: 0;
    color: #495057;
    font-size: 0.75rem;
    transition: color 0.2s;
}

.action-btn-item:hover {
    color: #0d6efd;
}

.action-icon-circle {
    width: 40px;
    height: 40px;
    border: 1px solid #dee2e6;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.35rem;
    background-color: #fff;
    font-size: 0.95rem;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.02);
    transition: all 0.2s ease;
}

.action-btn-item:hover .action-icon-circle {
    border-color: #0d6efd;
    color: #0d6efd;
    box-shadow: 0 0.25rem 0.5rem rgba(13, 110, 253, 0.1);
}`,
    'card2.html': `<div class="crm-kanban-card">
    <div class="crm-card-title">test</div>

    <div class="crm-card-item">
        <i class="bi bi-calendar-event icon-main"></i>
        <span>09/07/2026</span>
    </div>

    <div class="crm-card-item">
        <i class="bi bi-calendar-check icon-main"></i>
        <span>09/30/2026</span>
    </div>

    <div class="crm-card-item">
        <i class="bi bi-currency-dollar icon-main"></i>
        <span>$10</span>
    </div>

    <div class="crm-card-item" style="margin-bottom: 0;">
        <div class="crm-avatar-small"><i class="bi bi-person-fill"></i></div>
        <span class="text-uppercase" style="font-size: 13px; letter-spacing: 0.02em;">HÀO PHẠM MINH</span>
    </div>

    <div class="crm-card-footer">
        <div class="crm-footer-actions">
            <i class="bi bi-stickies" role="button"></i>
            <i class="bi bi-list-task" role="button"></i>
        </div>

        <div class="crm-time-badge">
            <i class="bi bi-calendar3"></i>
            <span>6 days ago</span>
            <div class="separator"></div>
            <i class="bi bi-exclamation-circle alert-icon"></i>
        </div>
    </div>
</div>`,
    'card2.css': ` .crm-kanban-card {
     background: #ffffff;
     border: 1px solid #e5e7eb;
     border-radius: 12px;
     padding: 16px;
     width: 320px;
     box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
     transition: all 0.2s ease-in-out;
     cursor: pointer;
 }

 .crm-kanban-card:hover {
     transform: translateY(-2px);
     box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
     border-color: #d1d5db;
 }

 .crm-card-title {
     font-size: 16px;
     font-weight: 700;
     color: #0f766e;
     margin-bottom: 14px;
     letter-spacing: -0.01em;
 }

 .crm-card-item {
     display: flex;
     align-items: center;
     gap: 12px;
     font-size: 14px;
     color: #4b5563;
     margin-bottom: 10px;
     font-weight: 500;
 }

 .crm-card-item i.icon-main {
     color: #6b7280;
     font-size: 16px;
     width: 18px;
     display: flex;
     justify-content: center;
 }

 .crm-avatar-small {
     width: 22px;
     height: 22px;
     background-color: #f3f4f6;
     color: #6b7280;
     border-radius: 50%;
     display: flex;
     align-items: center;
     justify-content: center;
     font-size: 12px;
 }

 .crm-card-footer {
     display: flex;
     justify-content: space-between;
     align-items: center;
     margin-top: 18px;
     padding-top: 14px;
     border-top: 1px solid #f3f4f6;
 }

 .crm-footer-actions {
     display: flex;
     gap: 14px;
     color: #9ca3af;
     font-size: 16px;
 }

 .crm-footer-actions i {
     transition: color 0.15s ease;
 }

 .crm-footer-actions i:hover {
     color: #4b5563;
 }

 .crm-time-badge {
     display: flex;
     align-items: center;
     gap: 8px;
     background-color: #f9fafb;
     padding: 4px 10px;
     border-radius: 6px;
     font-size: 12px;
     color: #4b5563;
     font-weight: 600;
     border: 1px solid #e5e7eb;
     transition: background-color 0.15s ease;
 }

 .crm-time-badge:hover {
     background-color: #f3f4f6;
 }

 .crm-time-badge .separator {
     width: 1px;
     height: 14px;
     background-color: #d1d5db;
 }

 .crm-time-badge .alert-icon {
     color: #ef4444;
     font-size: 14px;
 }`
,

    'offcanvas1.html': `<button class="btn-add-contact" type="button" data-bs-toggle="offcanvas" data-bs-target="#createContactCanvas">
    Add contacts
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
        stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
</button>

<div class="offcanvas offcanvas-end" tabindex="-1" id="createContactCanvas">
    <div class="offcanvas-header">
        <h5 class="offcanvas-title">Create Contact</h5>
        <button type="button" class="btn-close-custom" data-bs-dismiss="offcanvas">✕</button>
    </div>

    <div class="offcanvas-body">
        <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" class="form-control" value="test@gmail.com" placeholder="Enter email address">
        </div>

        <div class="form-group">
            <label class="form-label">First name</label>
            <input type="text" class="form-control" value="test" placeholder="Enter first name">
        </div>

        <div class="form-group">
            <label class="form-label">Last name</label>
            <input type="text" class="form-control" placeholder="Enter last name">
        </div>

        <div class="form-group">
            <label class="form-label">Contact owner</label>
            <div class="custom-select-wrapper">
                <div class="custom-select-trigger">
                    <span>Phạm Minh Hào</span>
                </div>
                <div class="custom-select-menu">
                    <div class="custom-select-search-wrap">
                        <input type="text" class="custom-select-search" placeholder="Search owners...">
                    </div>
                    <div class="custom-select-list">
                        <div class="custom-select-item">Phạm Minh Hào</div>
                        <div class="custom-select-item">John Doe</div>
                        <div class="custom-select-item">Jane Smith</div>
                        <div class="custom-select-item">Unassigned</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="form-group">
            <label class="form-label">Job title</label>
            <input type="text" class="form-control" placeholder="E.g. Marketing Manager">
        </div>

        <div class="form-group">
            <label class="form-label">Phone number</label>
            <input type="tel" class="form-control" placeholder="E.g. +1 234 567 8900">
        </div>

        <div class="form-group">
            <label class="form-label">Lifecycle stage</label>
            <div class="custom-select-wrapper">
                <div class="custom-select-trigger">
                    <span class="c-badge bg-mql">Marketing Qualified Lead</span>
                </div>
                <div class="custom-select-menu">
                    <div class="custom-select-search-wrap">
                        <input type="text" class="custom-select-search" placeholder="Search stages...">
                    </div>
                    <div class="custom-select-list">
                        <div class="custom-select-item">
                            <span class="c-badge bg-subscriber">Subscriber</span>
                        </div>
                        <div class="custom-select-item">
                            <span class="c-badge bg-lead">Lead</span>
                        </div>
                        <div class="custom-select-item">
                            <span class="c-badge bg-mql">Marketing Qualified Lead</span>
                        </div>
                        <div class="custom-select-item">
                            <span class="c-badge bg-sql">Sales Qualified Lead</span>
                        </div>
                        <div class="custom-select-item">
                            <span class="c-badge bg-opportunity">Opportunity</span>
                        </div>
                        <div class="custom-select-item">
                            <span class="c-badge bg-customer">Customer</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="offcanvas-footer">
        <button class="btn-create">Create</button>
        <button class="btn-outline">Create and add another</button>
        <button class="btn-outline" data-bs-dismiss="offcanvas">Cancel</button>
    </div>
</div>`,
    'offcanvas1.css': `.btn-add-contact {
    background-color: #00a2ff;
    color: #ffffff;
    border-radius: 20px;
    padding: 8px 16px;
    font-weight: 500;
    font-size: 14px;
    border: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: background-color 0.2s, transform 0.1s;
    box-shadow: 0 4px 12px rgba(0, 162, 255, 0.3);
}

.btn-add-contact:hover {
    background-color: #008ce6;
    transform: translateY(-1px);
    color: #ffffff;
    box-shadow: 0 6px 16px rgba(0, 162, 255, 0.4);
}

.offcanvas {
    width: 500px !important;
    border-left: none;
    box-shadow: -10px 0 30px rgba(0, 0, 0, 0.1);
    background-color: #ffffff;
    color: #334155;
}

.offcanvas-header {
    border-bottom: 1px solid #e2e8f0;
    padding: 24px;
    background-color: #ffffff;
}

.offcanvas-title {
    font-size: 20px;
    font-weight: 600;
    color: #0f172a;
}

.btn-close-custom {
    background: rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    width: 32px;
    height: 32px;
    font-size: 16px;
    color: #64748b;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.btn-close-custom:hover {
    background: rgba(0, 0, 0, 0.08);
    color: #0f172a;
}

.offcanvas-body {
    padding: 24px;
    background-color: #f8fafc;
    color: #334155;
}

.form-group {
    margin-bottom: 24px;
}

.form-label {
    font-size: 13px;
    font-weight: 500;
    color: #475569;
    margin-bottom: 8px;
    display: block;
}

.form-control {
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 12px 16px;
    font-size: 14px;
    color: #0f172a;
    background-color: #ffffff;
    transition: all 0.2s ease;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.02);
}

.form-control:focus {
    background-color: #ffffff;
    color: #0f172a;
    border-color: #00a2ff;
    box-shadow: 0 0 0 3px rgba(0, 162, 255, 0.25);
    outline: none;
}

.form-control::placeholder {
    color: #94a3b8;
}

.custom-select-wrapper {
    position: relative;
}

.custom-select-trigger {
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 12px 40px 12px 16px;
    font-size: 14px;
    color: #0f172a;
    background-color: #ffffff;
    cursor: pointer;
    display: flex;
    align-items: center;
    min-height: 46px;
    transition: all 0.2s ease;
    position: relative;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.02);
}

.custom-select-trigger::after {
    content: "▼";
    font-size: 10px;
    color: #64748b;
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
}

.custom-select-wrapper.open .custom-select-trigger {
    background-color: #ffffff;
    border-color: #00a2ff;
    box-shadow: 0 0 0 3px rgba(0, 162, 255, 0.25);
}

.custom-select-menu {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    width: 100%;
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    z-index: 1050;
    display: none;
    flex-direction: column;
    overflow: hidden;
}

.custom-select-wrapper.open .custom-select-menu {
    display: flex;
    animation: fadeInDown 0.2s ease-out;
}

@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.custom-select-search-wrap {
    padding: 12px;
    border-bottom: 1px solid #e2e8f0;
    background-color: #ffffff;
    position: sticky;
    top: 0;
    z-index: 2;
}

.custom-select-search {
    width: 100%;
    border: 1px solid #cbd5e1;
    border-radius: 20px;
    padding: 8px 16px 8px 36px;
    font-size: 13px;
    color: #0f172a;
    background-color: #f1f5f9;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='%2364748b' viewBox='0 0 16 16'%3E%3Cpath d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: 12px center;
    transition: all 0.2s;
}

.custom-select-search:focus {
    outline: none;
    border-color: #00a2ff;
    background-color: #ffffff;
}

.custom-select-search::placeholder {
    color: #94a3b8;
}

.custom-select-list {
    max-height: 220px;
    overflow-y: auto;
    padding: 8px 0;
}

.custom-select-list::-webkit-scrollbar {
    width: 6px;
}

.custom-select-list::-webkit-scrollbar-track {
    background: transparent;
}

.custom-select-list::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 10px;
}

.custom-select-item {
    padding: 10px 16px;
    cursor: pointer;
    font-size: 14px;
    color: #334155;
    display: flex;
    align-items: center;
    transition: background-color 0.1s;
}

.custom-select-item:hover {
    background-color: #f1f5f9;
    color: #0f172a;
}

.c-badge {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    color: #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.bg-subscriber {
    background-color: #00a2ff;
}

.bg-lead {
    background-color: #f59e0b;
}

.bg-mql {
    background-color: #10b981;
}

.bg-sql {
    background-color: #8b5cf6;
}

.bg-opportunity {
    background-color: #ec4899;
}

.bg-customer {
    background-color: #22c55e;
}

.offcanvas-footer {
    border-top: 1px solid #e2e8f0;
    padding: 20px 24px;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    gap: 12px;
}

.btn-create {
    background-color: #00a2ff;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    padding: 10px 24px;
    font-weight: 600;
    font-size: 14px;
    transition: all 0.2s;
    box-shadow: 0 4px 10px rgba(0, 162, 255, 0.25);
}

.btn-create:hover {
    background-color: #008ce6;
    transform: translateY(-1px);
    box-shadow: 0 6px 12px rgba(0, 162, 255, 0.35);
}

.btn-outline {
    background-color: transparent;
    color: #475569;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 10px 20px;
    font-weight: 500;
    font-size: 14px;
    transition: all 0.2s;
}

.btn-outline:hover {
    background-color: #f8fafc;
    color: #0f172a;
    border-color: #94a3b8;
}`,
    'offcanvas1.js': `document.addEventListener('DOMContentLoaded', function () {
    const wrappers = document.querySelectorAll('.custom-select-wrapper');

    wrappers.forEach(wrapper => {
        const trigger = wrapper.querySelector('.custom-select-trigger');
        const searchInput = wrapper.querySelector('.custom-select-search');
        const items = wrapper.querySelectorAll('.custom-select-item');

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = wrapper.classList.contains('open');
            document.querySelectorAll('.custom-select-wrapper').forEach(w => w.classList.remove('open'));
            if (!isOpen) {
                wrapper.classList.add('open');
                searchInput.focus();
            }
        });

        searchInput.addEventListener('input', (e) => {
            const filter = e.target.value.toLowerCase();
            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(filter)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });

        items.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                trigger.innerHTML = item.innerHTML;
                wrapper.classList.remove('open');
                searchInput.value = '';
                items.forEach(i => i.style.display = 'flex');
            });
        });
    });

    document.addEventListener('click', () => {
        wrappers.forEach(wrapper => wrapper.classList.remove('open'));
    });

    document.querySelectorAll('.custom-select-menu').forEach(menu => {
        menu.addEventListener('click', (e) => e.stopPropagation());
    });
});`,
    'offcanvas2.html': `<div class="container">

    <div class="bell-badge-wrapper" data-bs-toggle="offcanvas" data-bs-target="#notificationOffcanvas"
        aria-controls="notificationOffcanvas">
        <i class="bi bi-bell fs-3 text-dark"></i>
        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            style="font-size: 0.65rem;">
            2
        </span>
    </div>
</div>

<div class="offcanvas offcanvas-end notification-offcanvas shadow" tabindex="-1" id="notificationOffcanvas"
    aria-labelledby="notificationOffcanvasLabel">

    <div class="offcanvas-header border-bottom py-3 px-4">
        <h5 class="offcanvas-title fw-bold text-dark fs-4" id="notificationOffcanvasLabel">Notifications</h5>
        <button type="button" class="btn-close shadow-none" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>


    <div class="offcanvas-body p-0 d-flex flex-column">

        <div class="d-flex justify-content-between align-items-center px-3 border-bottom">
            <ul class="nav nav-tabs nav-tabs-custom mb-0">
                <li class="nav-item">
                    <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#tab-unread">Unread
                        (2)</button>
                </li>
                <li class="nav-item">
                    <button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-all">All</button>
                </li>
                <li class="nav-item">
                    <button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-trash">Trash</button>
                </li>
            </ul>
            <button class="btn btn-link text-dark p-0 fs-5"><i class="bi bi-gear"></i></button>
        </div>

        <div class="notification-action-bar d-flex justify-content-between align-items-center" id="actionBar">

            <div id="defaultActionContent" class="d-flex align-items-center justify-content-between w-100">
                <div class="form-check d-flex align-items-center gap-2 mb-0">
                    <input class="form-check-input notification-checkbox shadow-none mt-0" type="checkbox"
                        id="selectAllCheckbox" style="width: 1.15em; height: 1.15em; cursor: pointer;">
                    <label class="form-check-label text-dark user-select-none" for="selectAllCheckbox"
                        style="cursor: pointer;">
                        Select all <i class="bi bi-info-circle text-muted" style="font-size: 0.8rem;"></i>
                    </label>
                </div>
                <div class="text-secondary">
                    Type: <span class="fw-semibold text-dark dropdown-toggle" style="cursor: pointer;">All</span>
                </div>
            </div>

            <div id="selectedActionContent" class="d-none align-items-center justify-content-between w-100">
                <div class="form-check d-flex align-items-center gap-2 mb-0">
                    <input class="form-check-input notification-checkbox shadow-none mt-0" type="checkbox"
                        id="selectAllCheckboxActive" style="width: 1.15em; height: 1.15em; cursor: pointer;" checked>
                    <label class="form-check-label fw-medium text-dark user-select-none" for="selectAllCheckboxActive"
                        id="selectionCountText" style="cursor: pointer;">
                        All selected
                    </label>
                </div>
                <div class="d-flex align-items-center gap-3">
                    <button
                        class="btn btn-link text-dark text-decoration-none p-0 d-flex align-items-center gap-1 fs-6 fw-normal shadow-none"
                        style="font-size: 0.875rem !important;">
                        <i class="bi bi-envelope"></i> Mark as read
                    </button>
                    <button
                        class="btn btn-link text-dark text-decoration-none p-0 d-flex align-items-center gap-1 fs-6 fw-normal shadow-none"
                        style="font-size: 0.875rem !important;">
                        <i class="bi bi-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>

        <div class="tab-content flex-grow-1 overflow-auto">
            <div class="tab-pane fade show active" id="tab-unread">
                <div class="notification-item d-flex align-items-start gap-3">
                    <div class="form-check mt-1 mb-0">
                        <input class="form-check-input single-item-checkbox shadow-none" type="checkbox" value=""
                            style="width: 1.15em; height: 1.15em; cursor: pointer;">
                    </div>
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between align-items-start mb-1">
                            <h6 class="mb-0 fw-bold text-dark fs-6">Your invitation to test1@gmail.com didn't arrive
                            </h6>
                            <span class="text-muted" style="font-size: 0.75rem;">3d</span>
                        </div>
                        <p class="text-secondary mb-2" style="font-size: 0.825rem;">We've detected that your teammate
                            hasn't received their ema...</p>
                        <a href="#"
                            class="btn btn-outline-secondary btn-sm rounded-pill px-3 py-1 text-dark text-decoration-none d-inline-flex align-items-center gap-1 fw-medium"
                            style="font-size: 0.75rem;">
                            <i class="bi bi-link-45deg"></i> Manage Users
                        </a>
                    </div>
                </div>

                <div class="notification-item d-flex align-items-start gap-3">
                    <div class="form-check mt-1 mb-0">
                        <input class="form-check-input single-item-checkbox shadow-none" type="checkbox" value=""
                            style="width: 1.15em; height: 1.15em; cursor: pointer;">
                    </div>
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between align-items-start mb-1">
                            <h6 class="mb-0 fw-bold text-dark fs-6">New unassigned Live Chat conversation from Mar...
                            </h6>
                            <span class="text-muted" style="font-size: 0.75rem;">7d</span>
                        </div>
                        <p class="text-secondary mb-0" style="font-size: 0.825rem;">Maria Johnson (Sample Contact)
                            started this conversation: "A...</p>
                    </div>
                </div>
            </div>

            <div class="tab-pane fade" id="tab-all">
                <div class="p-4 text-center text-muted fs-6">No other notifications</div>
            </div>

            <div class="tab-pane fade" id="tab-trash">
                <div class="p-4 text-center text-muted fs-6">Trash is empty</div>
            </div>
        </div>
    </div>
</div>`,
    'offcanvas2.css': `.notification-offcanvas {
    width: 460px !important;
}

.nav-tabs-custom .nav-link {
    border: none;
    color: #495057;
    font-weight: 500;
    padding: 0.75rem 1rem;
    background: transparent;
}

.nav-tabs-custom .nav-link.active {
    color: #212529;
    font-weight: 600;
    background: transparent;
    border-bottom: 2px solid #212529;
}

.notification-item {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid #dee2e6;
    transition: background-color 0.15s ease;
}

.notification-item:hover {
    background-color: #f8f9fa;
}

.notification-action-bar {
    background-color: #f8f9fa;
    border-bottom: 1px solid #dee2e6;
    padding: 0.6rem 1.25rem;
    font-size: 0.875rem;
    min-height: 48px;
}

.bell-badge-wrapper {
    position: relative;
    display: inline-block;
    cursor: pointer;
}`,
    'offcanvas2.js': `document.addEventListener("DOMContentLoaded", function () {
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    const selectAllCheckboxActive = document.getElementById('selectAllCheckboxActive');
    const itemCheckboxes = document.querySelectorAll('.single-item-checkbox');

    const defaultActionContent = document.getElementById('defaultActionContent');
    const selectedActionContent = document.getElementById('selectedActionContent');
    const selectionCountText = document.getElementById('selectionCountText');

    function updateActionBarState() {
        const totalItems = itemCheckboxes.length;
        const checkedItems = document.querySelectorAll('.single-item-checkbox:checked').length;
        const isSelectAllChecked = selectAllCheckbox.checked;

        if (isSelectAllChecked || checkedItems > 0) {
            defaultActionContent.classList.add('d-none');
            defaultActionContent.classList.remove('d-flex');
            selectedActionContent.classList.add('d-flex');
            selectedActionContent.classList.remove('d-none');

            if (isSelectAllChecked || checkedItems === totalItems) {
                selectionCountText.innerHTML = 'All selected <i class="bi bi-info-circle text-muted" style="font-size: 0.8rem;"></i>';
                selectAllCheckboxActive.checked = true;
                selectAllCheckboxActive.indeterminate = false;
                itemCheckboxes.forEach(cb => cb.checked = true);
            } else {
                selectionCountText.textContent = checkedItems + ' selected';
                selectAllCheckboxActive.checked = false;
                selectAllCheckboxActive.indeterminate = true;
            }
        } else {
            selectedActionContent.classList.add('d-none');
            selectedActionContent.classList.remove('d-flex');
            defaultActionContent.classList.add('d-flex');
            defaultActionContent.classList.remove('d-none');
            selectAllCheckbox.checked = false;
        }
    }

    selectAllCheckbox.addEventListener('change', function () {
        const isChecked = this.checked;
        itemCheckboxes.forEach(cb => cb.checked = isChecked);
        updateActionBarState();
    });

    selectAllCheckboxActive.addEventListener('change', function () {
        const isChecked = this.checked;
        itemCheckboxes.forEach(cb => cb.checked = isChecked);
        selectAllCheckbox.checked = isChecked;
        updateActionBarState();
    });

    itemCheckboxes.forEach(cb => {
        cb.addEventListener('change', function () {
            const checkedCount = document.querySelectorAll('.single-item-checkbox:checked').length;
            if (checkedCount === 0) {
                selectAllCheckbox.checked = false;
            }
            updateActionBarState();
        });
    });
});`
,

    'table1.html': `<div class="container-fluid px-0">
    <div class="d-flex justify-content-between align-items-center p-3 hs-toolbar">
        <div class="d-flex align-items-center gap-3">
            <div class="position-relative">
                <i class="bi bi-search hs-search-icon"></i>
                <input type="text" class="form-control hs-search-input" placeholder="Search ( / )">
            </div>

            <button class="hs-btn hs-btn-pill" type="button" data-bs-toggle="collapse"
                data-bs-target="#quickFiltersCollapse" aria-expanded="true" aria-controls="quickFiltersCollapse">
                <i class="bi bi-filter"></i> Filter
            </button>

            <div class="dropdown">
                <button class="hs-btn hs-btn-pill" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="bi bi-sort-down"></i> Sort by
                </button>
                <div class="dropdown-menu dropdown-menu-custom">
                    <label class="form-label text-muted small fw-semibold mb-2">Sort by</label>
                    <div class="d-flex gap-2">
                        <select class="form-select form-select-sm border-secondary-subtle">
                            <option selected>Lead Status</option>
                            <option>Create Date</option>
                            <option>Name</option>
                        </select>
                        <div class="btn-group sort-btn-group" role="group">
                            <button type="button" class="btn btn-light active">Z &rarr; A</button>
                            <button type="button" class="btn btn-light">A &rarr; Z</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <div class="collapse show" id="quickFiltersCollapse">
        <div class="d-flex align-items-center gap-3 p-3 hs-quick-filters">
            <div class="dropdown">
                <button class="hs-quick-filter-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Contact owner <i class="bi bi-caret-down-fill small"></i>
                </button>
                <ul class="dropdown-menu dropdown-menu-small">
                    <li><a class="dropdown-item dropdown-item-custom" href="#">Me</a></li>
                    <li><a class="dropdown-item dropdown-item-custom" href="#">Unassigned</a></li>
                    <li>
                        <hr class="dropdown-divider">
                    </li>
                    <li><a class="dropdown-item dropdown-item-custom" href="#">All owners</a></li>
                </ul>
            </div>

            <div class="dropdown">
                <button class="hs-quick-filter-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Create date <i class="bi bi-caret-down-fill small"></i>
                </button>
                <div class="dropdown-menu dropdown-menu-custom">
                    <label class="form-label text-muted small fw-semibold mb-2">Date range</label>
                    <select class="form-select form-select-sm mb-2">
                        <option>Today</option>
                        <option>Yesterday</option>
                        <option>This week</option>
                        <option>This month</option>
                        <option>Custom range</option>
                    </select>
                </div>
            </div>

            <div class="dropdown">
                <button class="hs-quick-filter-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Last activity date <i class="bi bi-caret-down-fill small"></i>
                </button>
                <div class="dropdown-menu dropdown-menu-custom">
                    <label class="form-label text-muted small fw-semibold mb-2">Date range</label>
                    <select class="form-select form-select-sm mb-2">
                        <option>Any time</option>
                        <option>Past 7 days</option>
                        <option>Past 30 days</option>
                    </select>
                </div>
            </div>

            <div class="dropdown">
                <button class="hs-quick-filter-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Lead status <i class="bi bi-caret-down-fill small"></i>
                </button>
                <div class="dropdown-menu dropdown-menu-custom">
                    <div class="form-check mb-2">
                        <input class="form-check-input hs-checkbox" type="checkbox" id="status1">
                        <label class="form-check-label ms-2 font-inter" style="font-size: 14px;"
                            for="status1">New</label>
                    </div>
                    <div class="form-check mb-2">
                        <input class="form-check-input hs-checkbox" type="checkbox" id="status2">
                        <label class="form-check-label ms-2 font-inter" style="font-size: 14px;"
                            for="status2">Open</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input hs-checkbox" type="checkbox" id="status3">
                        <label class="form-check-label ms-2 font-inter" style="font-size: 14px;"
                            for="status3">Connected</label>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="hs-table-container">
        <table class="table hs-table align-middle">
            <thead>
                <tr>
                    <th style="width: 40px;"><input class="form-check-input hs-checkbox" type="checkbox"
                            id="selectAllCheckbox"></th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Contact owner</th>
                    <th>Primary company</th>
                    <th>Last Activity Date</th>
                    <th>Lead Status <i class="bi bi-arrow-down"></i></th>
                    <th>Create Date</th>
                    <th style="width: 40px;"></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><input class="form-check-input hs-checkbox row-checkbox" type="checkbox"></td>
                    <td>
                        <div class="d-flex align-items-center gap-2">
                            <i class="bi bi-chevron-right text-muted small"></i>
                            <div class="hs-avatar hs-avatar-gray">P</div>
                            <a href="#" class="hs-link">phamminhhao050...</a>
                        </div>
                    </td>
                    <td><a href="#" class="hs-link">phamminhhao05082005... <i
                                class="bi bi-box-arrow-up-right small"></i></a></td>
                    <td class="text-muted">--</td>
                    <td>
                        <div class="d-flex align-items-center gap-2">
                            <div class="hs-avatar hs-avatar-gray"><i class="bi bi-person"></i></div>
                            HÀO PHẠM MINH (2351...
                        </div>
                    </td>
                    <td class="text-muted">--</td>
                    <td class="text-muted">--</td>
                    <td>Connected</td>
                    <td>Sep 12, 2026 10:07 AM GMT+7</td>
                    <td><button class="btn btn-sm text-muted"><i class="bi bi-grip-vertical"></i></button></td>
                </tr>
                <tr>
                    <td><input class="form-check-input hs-checkbox row-checkbox" type="checkbox"></td>
                    <td>
                        <div class="d-flex align-items-center gap-2">
                            <i class="bi bi-chevron-right text-muted small"></i>
                            <div class="hs-avatar bg-primary text-white"><i class="bi bi-building"></i></div>
                            <a href="#" class="hs-link">dsad dsad</a>
                        </div>
                    </td>
                    <td><a href="#" class="hs-link">2351010052hao@ou.edu... <i
                                class="bi bi-box-arrow-up-right small"></i></a></td>
                    <td class="text-muted">--</td>
                    <td>
                        <div class="d-flex align-items-center gap-2">
                            <div class="hs-avatar hs-avatar-gray"><i class="bi bi-person"></i></div>
                            HÀO PHẠM MINH (2351...
                        </div>
                    </td>
                    <td>
                        <div class="d-flex align-items-center gap-2">
                            <div class="hs-avatar bg-primary text-white"><i class="bi bi-building"></i></div>
                            <a href="#" class="hs-link">Trường Đại học Mở Th...</a>
                        </div>
                    </td>
                    <td class="text-muted">--</td>
                    <td class="text-muted">--</td>
                    <td>Sep 11, 2026 2:12 PM GMT+7</td>
                    <td><button class="btn btn-sm text-muted"><i class="bi bi-grip-vertical"></i></button></td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Thanh phân trang CRM (HubSpot style dark footer) -->
    <div class="hs-pagination-footer d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div class="hs-pagination-info">
            Showing <span class="hs-page-start">1</span> to <span class="hs-page-end">10</span> of <span class="hs-page-total">420</span> results
        </div>

        <div class="dropdown hs-pagination-per-page">
            <button class="hs-pagination-per-page-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <span class="hs-per-page-text">Per page</span>
                <span class="hs-per-page-value">10</span>
                <i class="bi bi-chevron-down hs-chevron-icon"></i>
            </button>
            <ul class="dropdown-menu hs-pagination-dropdown-menu">
                <li><a class="dropdown-item active" href="javascript:void(0)" data-per-page="10">10</a></li>
                <li><a class="dropdown-item" href="javascript:void(0)" data-per-page="25">25</a></li>
                <li><a class="dropdown-item" href="javascript:void(0)" data-per-page="50">50</a></li>
                <li><a class="dropdown-item" href="javascript:void(0)" data-per-page="100">100</a></li>
            </ul>
        </div>

        <div class="hs-pagination-nav" role="navigation" aria-label="Table Pagination">
            <button type="button" class="hs-pagination-btn active" data-page="1">1</button>
            <button type="button" class="hs-pagination-btn" data-page="2">2</button>
            <button type="button" class="hs-pagination-btn" data-page="3">3</button>
            <button type="button" class="hs-pagination-btn" data-page="4">4</button>
            <span class="hs-pagination-ellipsis">&hellip;</span>
            <button type="button" class="hs-pagination-btn" data-page="41">41</button>
            <button type="button" class="hs-pagination-btn" data-page="42">42</button>
        </div>
    </div>
</div>`,
    'table1.css': `.hs-btn {
    background-color: #fdfdfd;
    border: 1px solid #cbd6e2;
    color: #33475b;
    font-size: 14px;
    font-weight: 500;
    padding: 6px 16px;
    border-radius: 3px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s ease-in-out;
}

.hs-btn:hover {
    background-color: #eaf0f6;
    border-color: #cbd6e2;
}

.hs-btn-pill {
    border-radius: 50px;
    padding: 4px 16px;
}

.hs-btn-pill[aria-expanded="true"] {
    background-color: #eaf0f6;
    border-color: #cbd6e2;
}

.hs-search-input {
    border-radius: 50px;
    border: 1px solid #cbd6e2;
    padding-left: 36px;
    font-size: 14px;
    min-width: 250px;
}

.hs-search-input:focus {
    box-shadow: none;
    border-color: #0091ae;
}

.hs-search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #516f90;
}

.hs-toolbar {
    background-color: #ffffff;
    border: 1px solid #dfe3eb;
    border-bottom: none;
    border-radius: 8px 8px 0 0;
}

.hs-quick-filters {
    background-color: #ffffff;
    border-left: 1px solid #dfe3eb;
    border-right: 1px solid #dfe3eb;
    font-size: 14px;
    color: #33475b;
    font-weight: 600;
}

.hs-quick-filter-btn {
    background: none;
    border: none;
    color: #0091ae;
    font-weight: 600;
    padding: 4px 8px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

.hs-quick-filter-btn:hover {
    background-color: #eaf0f6;
    border-radius: 3px;
}

.hs-quick-filter-btn i {
    color: #33475b;
}

.hs-table-container {
    background-color: #ffffff;
    border: 1px solid #dfe3eb;
    border-bottom: none;
    border-radius: 0;
    overflow-x: auto;
}

.hs-table {
    margin-bottom: 0;
    font-size: 14px;
    white-space: nowrap;
}

.hs-table th {
    font-weight: 500;
    color: #516f90;
    border-bottom: 2px solid #dfe3eb;
    padding: 12px 16px;
    background-color: #fdfdfd;
}

.hs-table td {
    color: #33475b;
    border-bottom: 1px solid #dfe3eb;
    padding: 12px 16px;
    vertical-align: middle;
}

.hs-table tbody tr:hover {
    background-color: #f5f8fa;
}

.hs-link {
    color: #0091ae;
    text-decoration: none;
    font-weight: 500;
}

.hs-link:hover {
    text-decoration: underline;
}

.hs-avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 600;
}

.hs-avatar-gray {
    background-color: #eaf0f6;
    color: #516f90;
}

.hs-checkbox {
    width: 16px;
    height: 16px;
    border: 1px solid #cbd6e2;
    border-radius: 3px;
    cursor: pointer;
}

.hs-checkbox:checked,
.hs-checkbox:indeterminate {
    background-color: #0091ae;
    border-color: #0091ae;
}

.hs-icon-btn {
    background: none;
    border: 1px solid #cbd6e2;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #33475b;
}

.hs-icon-btn:hover {
    background-color: #eaf0f6;
}

.dropdown-menu-custom {
    border: 1px solid #cbd6e2;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    padding: 16px;
    min-width: 250px;
}

.dropdown-menu-small {
    min-width: 200px;
    padding: 8px 0;
}

.dropdown-item-custom {
    font-size: 14px;
    color: #33475b;
    padding: 8px 16px;
}

.dropdown-item-custom:hover {
    background-color: #eaf0f6;
}

.sort-btn-group .btn {
    border-color: #cbd6e2;
    color: #33475b;
    font-size: 14px;
}

.sort-btn-group .btn.active {
    background-color: #eaf0f6;
    font-weight: 600;
}

.table-row-selected {
    background-color: #eaf0f6 !important;
}

/* ==========================================================================
   TABLE 1 PAGINATION STYLING (Light Theme - Modern CRM Style)
   ========================================================================== */
.hs-pagination-footer {
    background-color: #ffffff;
    border: 1px solid #dfe3eb;
    border-top: 1px solid #edf1f7;
    border-radius: 0 0 8px 8px;
    padding: 12px 20px;
    color: #33475b;
    font-size: 14px;
    font-family: inherit;
}

.hs-pagination-info {
    color: #516f90;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: -0.01em;
    user-select: none;
}

.hs-pagination-info .hs-page-start,
.hs-pagination-info .hs-page-end,
.hs-pagination-info .hs-page-total {
    font-weight: 600;
    color: #33475b;
}

.hs-pagination-per-page {
    position: relative;
}

.hs-pagination-per-page-btn {
    background-color: #ffffff;
    border: 1.5px solid #0091ae;
    color: #33475b;
    border-radius: 6px;
    padding: 5px 14px;
    font-size: 14px;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    box-shadow: 0 1px 2px rgba(0, 145, 174, 0.08);
}

.hs-pagination-per-page-btn::after {
    display: none !important;
}

.hs-pagination-per-page-btn:hover,
.hs-pagination-per-page-btn:focus,
.hs-pagination-per-page-btn[aria-expanded="true"] {
    background-color: #f5fbfc;
    border-color: #007a93;
    color: #1e293b;
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 145, 174, 0.18);
}

.hs-per-page-text {
    color: #64748b;
    font-weight: 400;
}

.hs-per-page-value {
    color: #0091ae;
    font-weight: 600;
}

.hs-chevron-icon {
    font-size: 11px;
    color: #64748b;
    transition: transform 0.2s ease;
}

.hs-pagination-per-page-btn[aria-expanded="true"] .hs-chevron-icon {
    transform: rotate(180deg);
}

.hs-pagination-dropdown-menu {
    background-color: #ffffff;
    border: 1px solid #cbd6e2;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    min-width: 100px;
    padding: 6px;
}

.hs-pagination-dropdown-menu .dropdown-item {
    color: #33475b;
    font-size: 13px;
    padding: 6px 12px;
    border-radius: 5px;
    transition: all 0.15s ease;
}

.hs-pagination-dropdown-menu .dropdown-item:hover {
    background-color: #eaf0f6;
    color: #0091ae;
}

.hs-pagination-dropdown-menu .dropdown-item.active,
.hs-pagination-dropdown-menu .dropdown-item:active {
    background-color: #0091ae;
    color: #ffffff;
    font-weight: 600;
}

/* Grouped segmented buttons */
.hs-pagination-nav {
    display: inline-flex;
    align-items: center;
    background-color: #ffffff;
    border: 1px solid #cbd6e2;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.hs-pagination-btn {
    background: #ffffff;
    border: none;
    border-right: 1px solid #dfe3eb;
    color: #33475b;
    font-size: 14px;
    font-weight: 500;
    min-width: 38px;
    height: 36px;
    padding: 0 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s ease;
    user-select: none;
}

.hs-pagination-btn:last-child {
    border-right: none;
}

.hs-pagination-btn:hover:not(.active) {
    background-color: #f5f8fa;
    color: #0091ae;
}

.hs-pagination-btn.active {
    background-color: #eaf0f6;
    color: #0091ae;
    font-weight: 600;
    cursor: default;
}

.hs-pagination-ellipsis {
    color: #8898aa;
    font-size: 14px;
    height: 36px;
    min-width: 32px;
    padding: 0 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid #dfe3eb;
    user-select: none;
}`,
    'table1.js': `document.addEventListener('DOMContentLoaded', function () {
    const tables = document.querySelectorAll('.hs-table');

    if (tables.length > 0) {
        tables.forEach(table => {
            const selectAllCheckbox = table.querySelector('thead input[type="checkbox"]');
            const rowCheckboxes = table.querySelectorAll('.row-checkbox');

            if (!selectAllCheckbox) return;

            function updateRowStyle(checkbox) {
                const tr = checkbox.closest('tr');
                if (tr) {
                    if (checkbox.checked) {
                        tr.classList.add('table-row-selected');
                    } else {
                        tr.classList.remove('table-row-selected');
                    }
                }
            }

            selectAllCheckbox.addEventListener('change', function () {
                rowCheckboxes.forEach(checkbox => {
                    checkbox.checked = selectAllCheckbox.checked;
                    updateRowStyle(checkbox);
                });
            });

            rowCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', function () {
                    const allChecked = Array.from(rowCheckboxes).length > 0 && Array.from(rowCheckboxes).every(c => c.checked);
                    const someChecked = Array.from(rowCheckboxes).some(c => c.checked);

                    selectAllCheckbox.checked = allChecked;
                    selectAllCheckbox.indeterminate = someChecked && !allChecked;

                    updateRowStyle(checkbox);
                });
            });
        });
    } else {
        const selectAllCheckbox = document.getElementById('selectAllCheckbox');
        const rowCheckboxes = document.querySelectorAll('.row-checkbox');

        if (!selectAllCheckbox) return;

        function updateRowStyle(checkbox) {
            const tr = checkbox.closest('tr');
            if (tr) {
                if (checkbox.checked) {
                    tr.classList.add('table-row-selected');
                } else {
                    tr.classList.remove('table-row-selected');
                }
            }
        }

        selectAllCheckbox.addEventListener('change', function () {
            rowCheckboxes.forEach(checkbox => {
                checkbox.checked = selectAllCheckbox.checked;
                updateRowStyle(checkbox);
            });
        });

        rowCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function () {
                const allChecked = Array.from(rowCheckboxes).length > 0 && Array.from(rowCheckboxes).every(c => c.checked);
                const someChecked = Array.from(rowCheckboxes).some(c => c.checked);

                selectAllCheckbox.checked = allChecked;
                selectAllCheckbox.indeterminate = someChecked && !allChecked;

                updateRowStyle(checkbox);
            });
        });
    }

    // ==========================================
    // Table 1 Pagination Interactive Logic
    // ==========================================
    function initTable1Pagination() {
        const paginationFooters = document.querySelectorAll('.hs-pagination-footer');
        paginationFooters.forEach(footer => {
            if (footer.dataset.paginationInitialized) return;
            footer.dataset.paginationInitialized = 'true';

            let currentPage = 1;
            let perPage = 10;
            const totalResults = 420;

            const infoStart = footer.querySelector('.hs-page-start');
            const infoEnd = footer.querySelector('.hs-page-end');
            const infoTotal = footer.querySelector('.hs-page-total');
            const perPageValue = footer.querySelector('.hs-per-page-value');
            const perPageItems = footer.querySelectorAll('.hs-pagination-dropdown-menu .dropdown-item');
            const navContainer = footer.querySelector('.hs-pagination-nav');

            function updatePaginationInfo() {
                const totalPages = Math.ceil(totalResults / perPage);
                if (currentPage > totalPages) currentPage = totalPages;
                if (currentPage < 1) currentPage = 1;

                const start = totalResults === 0 ? 0 : (currentPage - 1) * perPage + 1;
                const end = Math.min(currentPage * perPage, totalResults);

                if (infoStart) infoStart.textContent = start;
                if (infoEnd) infoEnd.textContent = end;
                if (infoTotal) infoTotal.textContent = totalResults;
                if (perPageValue) perPageValue.textContent = perPage;

                renderPaginationButtons(totalPages);
            }

            function renderPaginationButtons(totalPages) {
                if (!navContainer) return;

                let pages = [];
                if (totalPages <= 7) {
                    for (let i = 1; i <= totalPages; i++) pages.push(i);
                } else {
                    if (currentPage <= 4) {
                        pages = [1, 2, 3, 4, '...', totalPages - 1, totalPages];
                    } else if (currentPage >= totalPages - 3) {
                        pages = [1, 2, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
                    } else {
                        pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
                    }
                }

                navContainer.innerHTML = '';
                pages.forEach(p => {
                    if (p === '...') {
                        const ellipsis = document.createElement('span');
                        ellipsis.className = 'hs-pagination-ellipsis';
                        ellipsis.innerHTML = '&hellip;';
                        navContainer.appendChild(ellipsis);
                    } else {
                        const btn = document.createElement('button');
                        btn.type = 'button';
                        btn.className = p === currentPage ? 'hs-pagination-btn active' : 'hs-pagination-btn';
                        btn.textContent = p;
                        btn.setAttribute('data-page', p);
                        btn.addEventListener('click', function (e) {
                            e.preventDefault();
                            if (currentPage !== p) {
                                currentPage = p;
                                updatePaginationInfo();
                            }
                        });
                        navContainer.appendChild(btn);
                    }
                });
            }

            // Per page dropdown selection
            perPageItems.forEach(item => {
                item.addEventListener('click', function (e) {
                    e.preventDefault();
                    perPageItems.forEach(el => el.classList.remove('active'));
                    this.classList.add('active');
                    perPage = parseInt(this.getAttribute('data-per-page'), 10) || 10;
                    currentPage = 1;
                    updatePaginationInfo();
                });
            });

            // Bind click to static initial buttons
            if (navContainer) {
                const initialBtns = navContainer.querySelectorAll('.hs-pagination-btn');
                initialBtns.forEach(btn => {
                    btn.addEventListener('click', function (e) {
                        e.preventDefault();
                        const p = parseInt(this.getAttribute('data-page'), 10);
                        if (p && p !== currentPage) {
                            currentPage = p;
                            updatePaginationInfo();
                        }
                    });
                });
            }
        });
    }

    initTable1Pagination();
});`
};

// 5. Hàm tự động tải HTML, CSS và JS vào trang
async function loadComponent(htmlPath, cssPath, previewId, codeHtmlId, codeCssId, jsPath, codeJsId) {
    let htmlContent = '';
    let cssContent = '';
    let jsContent = '';

    const getFallback = (p) => {
        if (!p || typeof FALLBACK_COMPONENTS === 'undefined') return '';
        const clean = p.replace(/^\.\//, '');
        return FALLBACK_COMPONENTS[p] || FALLBACK_COMPONENTS[clean] || FALLBACK_COMPONENTS['./' + clean] || '';
    };

    // Tải HTML
    try {
        const htmlRes = await fetch(htmlPath);
        if (htmlRes.ok) {
            htmlContent = await htmlRes.text();
        } else {
            throw new Error(`HTTP ${htmlRes.status}`);
        }
    } catch (fetchErr) {
        htmlContent = getFallback(htmlPath);
        if (!htmlContent) {
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
            cssContent = getFallback(cssPath);
            if (!cssContent) {
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
            jsContent = getFallback(jsPath);
            if (!jsContent) {
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

    // Tải 4 Mẫu Popovers
    loadComponent(
        'popovers1.html',
        'popovers1.css',
        'preview-popovers1',
        'code-html-popovers1',
        'code-css-popovers1'
    );

    loadComponent(
        'popovers2.html',
        'popovers2.css',
        'preview-popovers2',
        'code-html-popovers2',
        'code-css-popovers2'
    );

    loadComponent(
        'popovers3.html',
        'popovers3.css',
        'preview-popovers3',
        'code-html-popovers3',
        'code-css-popovers3'
    );

    loadComponent(
        'popovers4.html',
        'popovers4.css',
        'preview-popovers4',
        'code-html-popovers4',
        'code-css-popovers4'
    );

    // Tải 3 Mẫu Dropdowns
    loadComponent(
        'dropdown1.html',
        'dropdown1.css',
        'preview-dropdown1',
        'code-html-dropdown1',
        'code-css-dropdown1',
        'dropdown1.js',
        'code-js-dropdown1'
    );

    loadComponent(
        'dropdown2.html',
        'dropdown2.css',
        'preview-dropdown2',
        'code-html-dropdown2',
        'code-css-dropdown2'
    );

    loadComponent(
        'dropdown3.html',
        'dropdown3.css',
        'preview-dropdown3',
        'code-html-dropdown3',
        'code-css-dropdown3',
        'dropdown3.js',
        'code-js-dropdown3'
    );

    // Tải 5 Mẫu Modals
    loadComponent(
        'modal1.html',
        'modal1.css',
        'preview-modal1',
        'code-html-modal1',
        'code-css-modal1'
    );

    loadComponent(
        'modal2.html',
        'modal2.css',
        'preview-modal2',
        'code-html-modal2',
        'code-css-modal2'
    );

    loadComponent(
        'modal3.html',
        'modal3.css',
        'preview-modal3',
        'code-html-modal3',
        'code-css-modal3'
    );

    loadComponent(
        'modal4.html',
        'modal4.css',
        'preview-modal4',
        'code-html-modal4',
        'code-css-modal4'
    );

    loadComponent(
        'modal5.html',
        'modal5.css',
        'preview-modal5',
        'code-html-modal5',
        'code-css-modal5',
        'modal5.js',
        'code-js-modal5'
    );

    // Tải 2 Mẫu Cards
    loadComponent(
        'card1.html',
        'card1.css',
        'preview-card1',
        'code-html-card1',
        'code-css-card1'
    );

    loadComponent(
        'card2.html',
        'card2.css',
        'preview-card2',
        'code-html-card2',
        'code-css-card2'
    );

    // Tải 2 Mẫu Offcanvas
    loadComponent(
        'offcanvas1.html',
        'offcanvas1.css',
        'preview-offcanvas1',
        'code-html-offcanvas1',
        'code-css-offcanvas1',
        'offcanvas1.js',
        'code-js-offcanvas1'
    );

    loadComponent(
        'offcanvas2.html',
        'offcanvas2.css',
        'preview-offcanvas2',
        'code-html-offcanvas2',
        'code-css-offcanvas2',
        'offcanvas2.js',
        'code-js-offcanvas2'
    );

    // Tải Component Table
    loadComponent(
        'table1.html',
        'table1.css',
        'preview-table1',
        'code-html-table1',
        'code-css-table1',
        'table1.js',
        'code-js-table1'
    );

    // Kích hoạt đồng bộ Tab
    setupTabHashSync();
});