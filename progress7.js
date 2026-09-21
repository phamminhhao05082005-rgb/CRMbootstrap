document.addEventListener('DOMContentLoaded', () => {
    const p7 = document.getElementById('progressBar7');
    if (p7) setTimeout(() => { p7.style.width = p7.getAttribute('data-target') + '%'; }, 100);
});