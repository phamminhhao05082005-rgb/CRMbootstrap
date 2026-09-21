document.addEventListener('DOMContentLoaded', () => {
    const p5 = document.getElementById('progressBar5');
    if (p5) setTimeout(() => { p5.style.width = p5.getAttribute('data-target') + '%'; }, 100);
});