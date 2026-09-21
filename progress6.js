document.addEventListener('DOMContentLoaded', () => {
    const bar = document.getElementById('progressBar6');
    if (bar) {
        const target = 82; // Set target value here
        let count = 0;
        const textSpan = bar.querySelector('.circular-value');
        setTimeout(() => {
            const interval = setInterval(() => {
                if (count >= target) clearInterval(interval);
                else {
                    count++;
                    bar.style.setProperty('--p', count + '%');
                    textSpan.textContent = count + '%';
                }
            }, 1500 / target);
        }, 100);
    }
});