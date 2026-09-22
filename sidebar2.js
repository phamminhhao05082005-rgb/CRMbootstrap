document.addEventListener('DOMContentLoaded', () => {
    
    const moreViews = document.getElementById('moreViews');
    const toggleText = document.querySelector('.toggle-text');

    if (moreViews && toggleText) {
        moreViews.addEventListener('show.bs.collapse', () => {
            toggleText.textContent = 'Less';
        });
        
        moreViews.addEventListener('hide.bs.collapse', () => {
            toggleText.textContent = 'More';
        });
    }

    const navLinks = document.querySelectorAll('.custom-v-nav .nav-link:not(.toggle-more)');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            navLinks.forEach(l => l.classList.remove('active'));
            
            link.classList.add('active');
        });
    });

});