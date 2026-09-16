document.addEventListener('DOMContentLoaded', function () {
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
});