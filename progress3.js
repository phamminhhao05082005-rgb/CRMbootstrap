document.addEventListener('DOMContentLoaded', () => {
    const p3 = document.getElementById('progressBar3');
    if (p3) {
        setTimeout(() => { p3.style.width = p3.getAttribute('data-target') + '%'; }, 100);
    }
});