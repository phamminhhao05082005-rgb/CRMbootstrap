document.addEventListener("DOMContentLoaded", function () {
    const modalEl = document.getElementById('editQuickFiltersModal');
    const filterContainer = document.getElementById('filterListContainer');
    const filterCounter = document.getElementById('filterCounter');
    const btnClearFilters = document.getElementById('btnClearFilters');
    const btnAddFilter = document.getElementById('btnAddFilter');

    const FILTER_OPTIONS = [
        { value: 'Ticket owner', icon: 'bi-person-check' },
        { value: 'Deal owner', icon: 'bi-person-badge' },
        { value: 'Create date', icon: 'bi-calendar3' },
        { value: 'Close date', icon: 'bi-calendar-x' },
        { value: 'Last activity date', icon: 'bi-calendar-check' },
        { value: 'Priority', icon: 'bi-list-task' },
        { value: 'Ticket status', icon: 'bi-check2-circle' },
        { value: 'Source', icon: 'bi-diagram-3' },
        { value: 'Associated company', icon: 'bi-building' },
        { value: 'Associated contact', icon: 'bi-people' }
    ];

    const MAX_FILTERS = 10;
    let savedModalHtml = '';

    function updateCounter() {
        if (!filterContainer || !filterCounter) return;
        const count = filterContainer.querySelectorAll('.filter-item-row').length;
        filterCounter.textContent = count;

        if (btnAddFilter) {
            if (count >= MAX_FILTERS) {
                btnAddFilter.disabled = true;
                btnAddFilter.classList.add('opacity-50');
            } else {
                btnAddFilter.disabled = false;
                btnAddFilter.classList.remove('opacity-50');
            }
        }
    }

    function syncFiltersToBar() {
        const filterBars = document.querySelectorAll('.quick-filter-bar');
        if (!filterBars.length || !filterContainer) return;

        const rows = filterContainer.querySelectorAll('.filter-item-row');
        const activeFilters = [];
        rows.forEach(row => {
            const select = row.querySelector('.form-select');
            if (select && select.value) {
                activeFilters.push(select.value);
            }
        });

        filterBars.forEach(bar => {
            const divider = bar.querySelector('.qf-divider');

            const oldBtns = bar.querySelectorAll('.btn-qf-text');
            oldBtns.forEach(btn => btn.remove());
            const emptyNotice = bar.querySelector('.qf-empty-notice');
            if (emptyNotice) emptyNotice.remove();

            if (activeFilters.length === 0) {
                const notice = document.createElement('span');
                notice.className = 'text-muted small fst-italic me-2 qf-empty-notice';
                notice.style.fontSize = '0.85rem';
                notice.textContent = 'Chưa có bộ lọc nhanh';
                if (divider) {
                    bar.insertBefore(notice, divider);
                } else {
                    bar.appendChild(notice);
                }
            } else {

                activeFilters.forEach(name => {
                    const btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = 'btn-qf-text';
                    btn.setAttribute('data-filter', name);
                    btn.innerHTML = `${name} <i class="bi bi-caret-down-fill"></i>`;
                    if (divider) {
                        bar.insertBefore(btn, divider);
                    } else {
                        bar.appendChild(btn);
                    }
                });
            }

            bar.dispatchEvent(new CustomEvent('filtersChanged', {
                bubbles: true,
                detail: { filters: activeFilters }
            }));
        });
    }

    function createFilterRow(selectedName) {
        const filter = FILTER_OPTIONS.find(f => f.value === selectedName) || FILTER_OPTIONS[0];
        const row = document.createElement('div');
        row.className = 'filter-item-row';

        let optionsHtml = '';
        FILTER_OPTIONS.forEach(opt => {
            const isSel = opt.value === filter.value ? 'selected' : '';
            optionsHtml += `<option value="${opt.value}" ${isSel}>${opt.value}</option>`;
        });

        row.innerHTML = `
            <div class="filter-select-wrapper">
                <i class="bi ${filter.icon} prefix-icon"></i>
                <select class="form-select">
                    ${optionsHtml}
                </select>
            </div>
            <button type="button" class="btn-trash" title="Delete filter">
                <i class="bi bi-trash3"></i>
            </button>
        `;
        return row;
    }

    if (filterContainer) {
        filterContainer.querySelectorAll('.filter-item-row').forEach(row => {
            const select = row.querySelector('.form-select');
            const iconEl = row.querySelector('.prefix-icon');
            if (select) {
                const currentVal = select.value;
                if (select.options.length < FILTER_OPTIONS.length) {
                    select.innerHTML = '';
                    FILTER_OPTIONS.forEach(opt => {
                        const optEl = document.createElement('option');
                        optEl.value = opt.value;
                        optEl.textContent = opt.value;
                        if (opt.value === currentVal) optEl.selected = true;
                        select.appendChild(optEl);
                    });
                }

                const optMatch = FILTER_OPTIONS.find(o => o.value === currentVal);
                if (optMatch && iconEl) {
                    iconEl.className = `bi ${optMatch.icon} prefix-icon`;
                }
            }
        });
    }

    if (filterContainer) {
        filterContainer.addEventListener('change', function (e) {
            const select = e.target.closest('.form-select');
            if (select) {
                const selectedVal = select.value;
                const wrapper = select.closest('.filter-select-wrapper');
                const iconEl = wrapper ? wrapper.querySelector('.prefix-icon') : null;
                const optMatch = FILTER_OPTIONS.find(o => o.value === selectedVal);
                if (iconEl && optMatch) {
                    iconEl.className = `bi ${optMatch.icon} prefix-icon`;
                }
                syncFiltersToBar();
            }
        });

        filterContainer.addEventListener('click', function (e) {
            const trashBtn = e.target.closest('.btn-trash');
            if (trashBtn) {
                const row = trashBtn.closest('.filter-item-row');
                if (row) {
                    row.remove();
                    updateCounter();
                    syncFiltersToBar();
                }
            }
        });
    }

    if (btnAddFilter) {
        btnAddFilter.addEventListener('click', function () {
            if (!filterContainer) return;
            const currentRows = filterContainer.querySelectorAll('.filter-item-row');
            if (currentRows.length >= MAX_FILTERS) return;

            const usedFilters = Array.from(currentRows).map(r => {
                const sel = r.querySelector('.form-select');
                return sel ? sel.value : '';
            });

            const nextFilter = FILTER_OPTIONS.find(o => !usedFilters.includes(o.value)) || FILTER_OPTIONS[0];
            const newRow = createFilterRow(nextFilter.value);
            filterContainer.appendChild(newRow);

            updateCounter();
            syncFiltersToBar();
        });
    }

    if (btnClearFilters) {
        btnClearFilters.addEventListener('click', function () {
            if (filterContainer) {
                filterContainer.innerHTML = '';
                updateCounter();
                syncFiltersToBar();
            }
        });
    }

    if (modalEl) {
        modalEl.addEventListener('show.bs.modal', function () {
            savedModalHtml = filterContainer ? filterContainer.innerHTML : '';
        });

        const cancelBtn = modalEl.querySelector('.btn-hs-outline');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function () {
                if (filterContainer && savedModalHtml !== '') {
                    filterContainer.innerHTML = savedModalHtml;
                    updateCounter();
                    syncFiltersToBar();
                }
            });
        }

        const doneBtn = modalEl.querySelector('.btn-hs-primary');
        if (doneBtn) {
            doneBtn.addEventListener('click', function () {
                savedModalHtml = filterContainer ? filterContainer.innerHTML : '';
                updateCounter();
                syncFiltersToBar();
            });
        }
    }

    document.addEventListener('click', function (e) {
        const qfBtn = e.target.closest('.btn-qf-text');
        if (qfBtn) {
            qfBtn.classList.toggle('active');
            const filterName = qfBtn.getAttribute('data-filter') || qfBtn.textContent.trim();
            qfBtn.dispatchEvent(new CustomEvent('filter:click', {
                bubbles: true,
                detail: { filterName: filterName, isActive: qfBtn.classList.contains('active') }
            }));
        }
    });

    updateCounter();
    syncFiltersToBar();
});