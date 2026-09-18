document.addEventListener('DOMContentLoaded', () => {
    const collapseElement = document.getElementById('summaryContent');
    const toggleBtn = document.querySelector('.collapse-trigger');

    if (collapseElement && toggleBtn) {
        collapseElement.addEventListener('hide.bs.collapse', () => {
            toggleBtn.classList.add('collapsed');
        });

        collapseElement.addEventListener('show.bs.collapse', () => {
            toggleBtn.classList.remove('collapsed');
        });
    }
});