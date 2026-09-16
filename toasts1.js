document.addEventListener('DOMContentLoaded', () => {
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
                progressBar.style.transition = `width ${TOAST_DURATION}ms linear`;
                progressBar.style.width = '100%';
            }, 50);
        });

        toastElement.addEventListener('hidden.bs.toast', () => {
            progressBar.style.transition = 'none';
            progressBar.style.width = '0%';
        });
    }
});