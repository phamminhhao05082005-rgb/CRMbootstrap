document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('draggableTrack');
    const progressBar = document.getElementById('progressBar');
    let isDown = false;
    let startX;
    let scrollLeft;

    function updateProgressBar() {

        const maxScrollLeft = slider.scrollWidth - slider.clientWidth;

        if (maxScrollLeft <= 0) {
            progressBar.style.width = '100%';
            return;
        }

        const scrollPercentage = (slider.scrollLeft / maxScrollLeft) * 100;

        progressBar.style.width = Math.max(5, scrollPercentage) + '%';
    }

    setTimeout(updateProgressBar, 100);

    slider.addEventListener('scroll', updateProgressBar);
    window.addEventListener('resize', updateProgressBar);

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.style.scrollBehavior = 'auto';
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.style.scrollBehavior = 'smooth';
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    });
});