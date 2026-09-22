document.addEventListener('DOMContentLoaded', () => {
    const collapseElements = document.querySelectorAll('#summaryContent');
    collapseElements.forEach(collapseElement => {
        const card = collapseElement.closest('.summary-card');
        if (!card) return;
        const toggleBtn = card.querySelector('.collapse-trigger');
        const collapsedInfo = card.querySelector('.summary-collapsed-info');

        collapseElement.addEventListener('hide.bs.collapse', () => {
            if (toggleBtn) toggleBtn.classList.add('collapsed');
            card.classList.add('is-collapsed');
            if (collapsedInfo) collapsedInfo.style.display = 'flex';
        });

        collapseElement.addEventListener('show.bs.collapse', () => {
            if (toggleBtn) toggleBtn.classList.remove('collapsed');
            card.classList.remove('is-collapsed');
            if (collapsedInfo) collapsedInfo.style.display = 'none';
        });
    });
});