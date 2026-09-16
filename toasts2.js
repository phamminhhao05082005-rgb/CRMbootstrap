document.addEventListener('DOMContentLoaded', function () {
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
});