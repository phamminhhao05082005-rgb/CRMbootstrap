function initList1() {
    const timeSearch = document.getElementById('timeSearch');
    const timeItems = document.querySelectorAll('.time-item-container');

    if (timeSearch) {
        timeSearch.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            timeItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(term) ? '' : 'none';
            });
        });
    }

    const assignSearch = document.getElementById('assignSearch');
    const assignItems = document.querySelectorAll('.assignee-item');

    if (assignSearch) {
        assignSearch.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            assignItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(term) ? '' : 'none';
            });
        });
    }

    let currentTime = 'All time';
    let selectedAssigneesCount = 0;

    const timeLinks = document.querySelectorAll('.time-item');
    timeLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            currentTime = link.dataset.value;

            const dropdownEl = document.getElementById('btnTimeFilter');
            if (dropdownEl && window.bootstrap) {
                const dropdownObj = bootstrap.Dropdown.getInstance(dropdownEl);
                if (dropdownObj) dropdownObj.hide();
            }

            updateUI();
        });
    });

    const assigneeCheckboxes = document.querySelectorAll('.assignee-cb');
    assigneeCheckboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            selectedAssigneesCount = document.querySelectorAll('.assignee-cb:checked').length;
            updateUI();
        });
    });

    const timeWrapper = document.getElementById('timeFilterWrapper');
    const timeLabel = document.getElementById('timeFilterLabel');
    const timeClear = document.getElementById('timeFilterClear');

    const assignWrapper = document.getElementById('assignFilterWrapper');
    const assignLabel = document.getElementById('assignFilterLabel');
    const assignClear = document.getElementById('assignFilterClear');

    const btnClearAll = document.getElementById('btnClearAll');

    function updateUI() {
        if (timeLabel && timeWrapper && timeClear) {
            if (currentTime !== 'All time') {
                timeLabel.textContent = currentTime;
                timeWrapper.classList.add('active-filter-bg');
                timeClear.classList.remove('d-none');
            } else {
                timeLabel.textContent = 'All time';
                timeWrapper.classList.remove('active-filter-bg');
                timeClear.classList.add('d-none');
            }
        }

        if (assignLabel && assignWrapper && assignClear) {
            if (selectedAssigneesCount > 0) {
                assignLabel.textContent = `Activity assigned to (${selectedAssigneesCount})`;
                assignWrapper.classList.add('active-filter-bg');
                assignClear.classList.remove('d-none');
            } else {
                assignLabel.textContent = 'Activity assigned to';
                assignWrapper.classList.remove('active-filter-bg');
                assignClear.classList.add('d-none');
            }
        }

        if (btnClearAll) {
            if (currentTime !== 'All time' || selectedAssigneesCount > 0) {
                btnClearAll.classList.remove('d-none');
            } else {
                btnClearAll.classList.add('d-none');
            }
        }
    }

    if (timeClear) {
        timeClear.addEventListener('click', (e) => {
            e.stopPropagation();
            currentTime = 'All time';
            updateUI();
        });
    }

    if (assignClear) {
        assignClear.addEventListener('click', (e) => {
            e.stopPropagation();
            assigneeCheckboxes.forEach(cb => cb.checked = false);
            selectedAssigneesCount = 0;
            updateUI();
        });
    }

    if (btnClearAll) {
        btnClearAll.addEventListener('click', () => {
            currentTime = 'All time';
            assigneeCheckboxes.forEach(cb => cb.checked = false);
            selectedAssigneesCount = 0;
            updateUI();
        });
    }
}

document.addEventListener('DOMContentLoaded', initList1);
