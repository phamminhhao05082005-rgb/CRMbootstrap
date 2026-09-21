document.addEventListener('DOMContentLoaded', () => {
    const p2 = document.getElementById('progressBar2');
    if (p2) {
        setTimeout(() => { p2.style.width = p2.getAttribute('data-target') + '%'; }, 100);
    }
});