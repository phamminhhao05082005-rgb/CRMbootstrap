document.addEventListener('DOMContentLoaded', () => {
    const trigger = document.querySelector('.dropdown-trigger');
    const dropdown = document.getElementById('associateDropdown');
    const navItems = document.querySelectorAll('.sidebar-scrollable .nav-item');
    const panels = document.querySelectorAll('.content-panel');
    const genericSearchInput = document.querySelector('.generic-search-input');

    if (!trigger || !dropdown) return;

    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const bsCollapse = new bootstrap.Collapse(dropdown, {
            toggle: false
        });
        
        if (dropdown.classList.contains('show')) {
            bsCollapse.hide();
        } else {
            bsCollapse.show();
        }
    });

    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && !trigger.contains(e.target) && dropdown.classList.contains('show')) {
            const bsCollapse = new bootstrap.Collapse(dropdown, { toggle: false });
            bsCollapse.hide();
        }
    });

    dropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            const targetName = item.getAttribute('data-target');
            const targetPanelId = `panel-${targetName}`;
            
            panels.forEach(panel => panel.classList.remove('active-panel'));

            const specificPanel = document.getElementById(targetPanelId);
            if (specificPanel) {
                specificPanel.classList.add('active-panel');
            } else {
                const genericPanel = document.getElementById('panel-generic');
                if (genericPanel) {
                    genericPanel.classList.add('active-panel');
                }
                if (genericSearchInput) {
                    const categoryName = item.querySelector('span:first-child').textContent;
                    genericSearchInput.placeholder = `Search ${categoryName.trim()}`;
                }
            }
        });
    });
});
