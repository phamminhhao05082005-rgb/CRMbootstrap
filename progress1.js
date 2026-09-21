document.addEventListener('DOMContentLoaded', () => {
    const p1 = document.getElementById('progressBar1');
    const t1 = document.getElementById('progressText1');
    if (p1 && t1) {
        const target = parseInt(p1.getAttribute('data-target'));
        setTimeout(() => { p1.style.width = target + '%'; }, 100);
        let count = 0;
        const interval = setInterval(() => {
            if (count >= target) clearInterval(interval);
            else t1.textContent = (++count) + '%';
        }, 1500 / target);
    }
});