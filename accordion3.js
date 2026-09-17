document.addEventListener('DOMContentLoaded', () => {
    const collapseTrigger = document.querySelector('.header-trigger');
    const collapseElement = document.getElementById('dealsCollapse');

    if (!collapseTrigger || !collapseElement) return;

    collapseElement.addEventListener('hide.bs.collapse', () => {
        collapseTrigger.classList.add('collapsed');
    });

    collapseElement.addEventListener('show.bs.collapse', () => {
        collapseTrigger.classList.remove('collapsed');
    });
});
