document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.focus-item');
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    const btnPlayPause = document.getElementById('btnPlayPause');
    const container = document.getElementById('sliderContainer');

    let currentIndex = 1;
    const totalItems = items.length;

    let autoPlayTimer;
    let isAutoPlaying = true;

    function updateSlider() {
        const activeIndex = currentIndex;
        const prevIndex = (currentIndex - 1 + totalItems) % totalItems;
        const nextIndex = (currentIndex + 1) % totalItems;

        items.forEach((item) => {
            item.className = 'focus-item';
        });

        items[activeIndex].classList.add('active');
        items[prevIndex].classList.add('prev');
        items[nextIndex].classList.add('next');
    }

    function goNext() {
        currentIndex = (currentIndex + 1) % totalItems;
        updateSlider();
    }

    function goPrev() {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateSlider();
    }

    btnNext.addEventListener('click', () => {
        goNext();
        resetAutoPlay();
    });

    btnPrev.addEventListener('click', () => {
        goPrev();
        resetAutoPlay();
    });

    items.forEach(item => {
        item.addEventListener('click', (e) => {
            if (item.classList.contains('prev')) {
                goPrev();
                resetAutoPlay();
            } else if (item.classList.contains('next')) {
                goNext();
                resetAutoPlay();
            }
        });
    });

    function startAutoPlay() {
        if (isAutoPlaying) {
            autoPlayTimer = setInterval(goNext, 3000);
        }
    }

    function resetAutoPlay() {
        clearInterval(autoPlayTimer);
        startAutoPlay();
    }

    btnPlayPause.addEventListener('click', () => {
        isAutoPlaying = !isAutoPlaying;
        if (isAutoPlaying) {
            btnPlayPause.innerHTML = '||';
            startAutoPlay();
        } else {
            btnPlayPause.innerHTML = '&#9654;';
            clearInterval(autoPlayTimer);
        }
    });

    let startX = 0;
    let isDragging = false;

    container.addEventListener('mousedown', (e) => {
        if (e.target.closest('button')) return;
        isDragging = true;
        startX = e.pageX;
        clearInterval(autoPlayTimer);
    });

    container.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        let endX = e.pageX;
        let diff = startX - endX;

        if (diff > 50) goNext();
        else if (diff < -50) goPrev();

        isDragging = false;
        startAutoPlay();
    });

    container.addEventListener('mouseleave', () => {
        isDragging = false;
    });

    container.addEventListener('touchstart', (e) => {
        if (e.target.closest('button')) return;
        startX = e.touches[0].clientX;
        clearInterval(autoPlayTimer);
    });

    container.addEventListener('touchend', (e) => {
        let endX = e.changedTouches[0].clientX;
        let diff = startX - endX;

        if (diff > 50) goNext();
        else if (diff < -50) goPrev();

        startAutoPlay();
    });

    updateSlider();
    startAutoPlay();
});