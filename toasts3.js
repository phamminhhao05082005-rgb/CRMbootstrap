document.addEventListener('DOMContentLoaded', function () {
    const toastEl = document.getElementById('uploadToast');
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
});