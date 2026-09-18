document.addEventListener('DOMContentLoaded', () => {
    const starButtons = document.querySelectorAll('.star-btn');
    starButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.classList.contains('bi-star')) {
                this.classList.remove('bi-star');
                this.classList.add('bi-star-fill', 'active');
            } else {
                this.classList.remove('bi-star-fill', 'active');
                this.classList.add('bi-star');
            }
        });
    });
});