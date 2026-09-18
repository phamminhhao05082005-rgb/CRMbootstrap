document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('carouselTrack');
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');

    const updateButtons = () => {
        btnPrev.disabled = track.scrollLeft <= 0;
        btnNext.disabled = track.scrollLeft >= (track.scrollWidth - track.clientWidth - 1);
    };

    btnPrev.addEventListener('click', () => {
        track.scrollBy({ left: -266, behavior: 'smooth' });
    });

    btnNext.addEventListener('click', () => {
        track.scrollBy({ left: 266, behavior: 'smooth' });
    });

    track.addEventListener('scroll', updateButtons);
    window.addEventListener('resize', updateButtons);
    
    updateButtons();
});