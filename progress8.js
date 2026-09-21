document.addEventListener('DOMContentLoaded', () => {
    const p8 = document.getElementById('progressBar8');
    if (p8) {
        const target = parseInt(p8.getAttribute('data-target'));
        const textSpan = p8.querySelector('.inner-text');
        
        setTimeout(() => { p8.style.width = target + '%'; }, 100);
        
        let count = 0;
        const interval = setInterval(() => {
            if (count >= target) {
                clearInterval(interval);
                textSpan.classList.add('show');
            } else {
                textSpan.textContent = (++count) + '%';
            }
        }, 1500 / target);
    }
});