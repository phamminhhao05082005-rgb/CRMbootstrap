document.addEventListener('DOMContentLoaded', () => {
    const feedbackIcons = document.querySelectorAll('.feedback-icon');
    
    feedbackIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            feedbackIcons.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
});