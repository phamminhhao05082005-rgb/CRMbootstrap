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

// 3. Fallback data khi mở trực tiếp file:// (tránh lỗi CORS fetch mặc định của trình duyệt)
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
    <!-- KHỐI 1: Nút kèm Badge thông báo -->
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

    <!-- KHỐI 2: Badge trạng thái CRM thông thường -->
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

    <!-- KHỐI 3: Badge bo tròn hình viên thuốc (Pill Badges) -->
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
}`
};

// 4. Hàm tự động tải cả HTML và CSS vào trang
async function loadComponent(htmlPath, cssPath, previewId, codeHtmlId, codeCssId) {
    let htmlContent = '';
    let cssContent = '';

    // Tải HTML (thử fetch trước, nếu file:// CORS block thì lấy fallback)
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
    if (previewEl && htmlContent) previewEl.innerHTML = htmlContent;
    if (codeHtmlEl && htmlContent) codeHtmlEl.textContent = htmlContent.trim();

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
}

// 5. Đồng bộ Tab URL Hash (cho phép gõ #tab-badge hoặc #tab-accordion trên URL)
function setupTabHashSync() {
    const triggerTabList = document.querySelectorAll('#componentTabs button[data-bs-toggle="pill"]');
    triggerTabList.forEach(triggerEl => {
        triggerEl.addEventListener('shown.bs.tab', event => {
            const targetId = event.target.getAttribute('data-bs-target');
            if (targetId) {
                history.replaceState(null, null, targetId);
            }
        });
    });

    // Kích hoạt tab theo URL hash khi tải trang
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

// 6. Khởi chạy khi trang sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
    // Tải Accordion Mẫu 1 (Task Accordion)
    loadComponent(
        'accordion1.html', 
        'accordion1.css', 
        'preview-accordion1', 
        'code-html-accordion1', 
        'code-css-accordion1'
    );

    // Tải Accordion Mẫu 2 (Property Accordion - Mới thêm)
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

    // Kích hoạt đồng bộ Tab
    setupTabHashSync();
});