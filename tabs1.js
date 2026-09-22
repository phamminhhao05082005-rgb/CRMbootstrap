document.addEventListener('DOMContentLoaded', () => {
    
    const tabList = document.getElementById('viewTabs');
    const tabContentContainer = document.getElementById('viewTabsContent');
    const dropdownToggleBtn = document.getElementById('dropdownAddView');
    
    tabList.addEventListener('click', (e) => {
        if (e.target.classList.contains('tab-close')) {
            e.preventDefault();
            e.stopPropagation();

            const tabItem = e.target.closest('.nav-item');
            const navLink = tabItem.querySelector('.nav-link');
            const targetPaneId = navLink.getAttribute('data-bs-target');
            const targetPane = document.querySelector(targetPaneId);

            const isActive = navLink.classList.contains('active');

            tabItem.remove();
            if (targetPane) {
                targetPane.remove();
            }

            if (isActive) {
                const remainingTabs = tabList.querySelectorAll('.nav-link');
                if (remainingTabs.length > 0) {
                    const lastTab = remainingTabs[remainingTabs.length - 1];
                    const tabInstance = new bootstrap.Tab(lastTab);
                    tabInstance.show();
                }
            }
        }
    });

    const viewItems = document.querySelectorAll('.view-item');
    
    viewItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            const viewName = item.textContent.trim();
            const safeId = 'tab-' + viewName.toLowerCase().replace(/[^a-z0-9]/g, '-');
            const existingTab = document.getElementById(`${safeId}-tab`);
            if (existingTab) {
                const bsTab = new bootstrap.Tab(existingTab);
                bsTab.show();
                closeDropdown();
                return;
            }

            const li = document.createElement('li');
            li.className = 'nav-item';
            li.setAttribute('role', 'presentation');
            li.innerHTML = `
                <button class="nav-link" id="${safeId}-tab" data-bs-toggle="tab" data-bs-target="#${safeId}" type="button" role="tab" aria-selected="false">
                    <span class="tab-text">${viewName}</span>
                    <i class="bi bi-x tab-close" title="Close tab"></i>
                </button>
            `;

            const pane = document.createElement('div');
            pane.className = 'tab-pane fade';
            pane.id = safeId;
            pane.setAttribute('role', 'tabpanel');
            pane.innerHTML = `
                <h5 class="text-dark fw-bold">${viewName}</h5>
                <p class="text-secondary mt-3">Đây là nội dung được tạo động cho tab ${viewName}. Hệ thống tự load dữ liệu tương ứng.</p>
            `;

            tabList.appendChild(li);
            tabContentContainer.appendChild(pane);
            const newTabBtn = li.querySelector('.nav-link');
            const bsTab = new bootstrap.Tab(newTabBtn);
            bsTab.show();
            closeDropdown();
        });
    });

    function closeDropdown() {
        const bsDropdown = bootstrap.Dropdown.getInstance(dropdownToggleBtn);
        if (bsDropdown) {
            bsDropdown.hide();
        }
    }

    const searchInput = document.getElementById('viewSearchInput');
    const filterPills = document.querySelectorAll('.filter-pill');
    let currentCategoryFilter = 'all';
    let currentSearchTerm = '';

    const applyFilters = () => {
        viewItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            const category = item.getAttribute('data-category');
            
            const matchesSearch = text.includes(currentSearchTerm);
            const matchesCategory = currentCategoryFilter === 'all' || category === currentCategoryFilter;

            if (matchesSearch && matchesCategory) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    };

    searchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value.toLowerCase();
        applyFilters();
    });

    filterPills.forEach(pill => {
        pill.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); 

            filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            currentCategoryFilter = pill.getAttribute('data-filter');
            applyFilters();
        });
    });

});