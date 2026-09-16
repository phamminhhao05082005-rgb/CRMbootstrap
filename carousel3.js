document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('logoTrack');
    const btn = document.getElementById('playPauseBtn');
    const iconPause = document.getElementById('icon-pause');
    const iconPlay = document.getElementById('icon-play');

    let isPlaying = true;

    btn.addEventListener('click', () => {
        if (isPlaying) {

            track.style.animationPlayState = 'paused';

            iconPause.style.display = 'none';
            iconPlay.style.display = 'block';
        } else {

            track.style.animationPlayState = 'running';

            iconPlay.style.display = 'none';
            iconPause.style.display = 'block';
        }
        isPlaying = !isPlaying;
    });
});