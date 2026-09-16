document.addEventListener('DOMContentLoaded', function () {
    const tables = document.querySelectorAll('.hs-table');

    if (tables.length > 0) {
        tables.forEach(table => {
            const selectAllCheckbox = table.querySelector('thead input[type="checkbox"]');
            const rowCheckboxes = table.querySelectorAll('.row-checkbox');

            if (!selectAllCheckbox) return;

            function updateRowStyle(checkbox) {
                const tr = checkbox.closest('tr');
                if (tr) {
                    if (checkbox.checked) {
                        tr.classList.add('table-row-selected');
                    } else {
                        tr.classList.remove('table-row-selected');
                    }
                }
            }

            selectAllCheckbox.addEventListener('change', function () {
                rowCheckboxes.forEach(checkbox => {
                    checkbox.checked = selectAllCheckbox.checked;
                    updateRowStyle(checkbox);
                });
            });

            rowCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', function () {
                    const allChecked = Array.from(rowCheckboxes).length > 0 && Array.from(rowCheckboxes).every(c => c.checked);
                    const someChecked = Array.from(rowCheckboxes).some(c => c.checked);

                    selectAllCheckbox.checked = allChecked;
                    selectAllCheckbox.indeterminate = someChecked && !allChecked;

                    updateRowStyle(checkbox);
                });
            });
        });
    } else {
        const selectAllCheckbox = document.getElementById('selectAllCheckbox');
        const rowCheckboxes = document.querySelectorAll('.row-checkbox');

        if (!selectAllCheckbox) return;

        function updateRowStyle(checkbox) {
            const tr = checkbox.closest('tr');
            if (tr) {
                if (checkbox.checked) {
                    tr.classList.add('table-row-selected');
                } else {
                    tr.classList.remove('table-row-selected');
                }
            }
        }

        selectAllCheckbox.addEventListener('change', function () {
            rowCheckboxes.forEach(checkbox => {
                checkbox.checked = selectAllCheckbox.checked;
                updateRowStyle(checkbox);
            });
        });

        rowCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function () {
                const allChecked = Array.from(rowCheckboxes).length > 0 && Array.from(rowCheckboxes).every(c => c.checked);
                const someChecked = Array.from(rowCheckboxes).some(c => c.checked);

                selectAllCheckbox.checked = allChecked;
                selectAllCheckbox.indeterminate = someChecked && !allChecked;

                updateRowStyle(checkbox);
            });
        });
    }

    function initTable1Pagination() {
        const paginationFooters = document.querySelectorAll('.hs-pagination-footer');
        paginationFooters.forEach(footer => {
            if (footer.dataset.paginationInitialized) return;
            footer.dataset.paginationInitialized = 'true';

            let currentPage = 1;
            let perPage = 10;
            const totalResults = 420;

            const infoStart = footer.querySelector('.hs-page-start');
            const infoEnd = footer.querySelector('.hs-page-end');
            const infoTotal = footer.querySelector('.hs-page-total');
            const perPageValue = footer.querySelector('.hs-per-page-value');
            const perPageItems = footer.querySelectorAll('.hs-pagination-dropdown-menu .dropdown-item');
            const navContainer = footer.querySelector('.hs-pagination-nav');

            function updatePaginationInfo() {
                const totalPages = Math.ceil(totalResults / perPage);
                if (currentPage > totalPages) currentPage = totalPages;
                if (currentPage < 1) currentPage = 1;

                const start = totalResults === 0 ? 0 : (currentPage - 1) * perPage + 1;
                const end = Math.min(currentPage * perPage, totalResults);

                if (infoStart) infoStart.textContent = start;
                if (infoEnd) infoEnd.textContent = end;
                if (infoTotal) infoTotal.textContent = totalResults;
                if (perPageValue) perPageValue.textContent = perPage;

                renderPaginationButtons(totalPages);
            }

            function renderPaginationButtons(totalPages) {
                if (!navContainer) return;

                let pages = [];
                if (totalPages <= 7) {
                    for (let i = 1; i <= totalPages; i++) pages.push(i);
                } else {
                    if (currentPage <= 4) {
                        pages = [1, 2, 3, 4, '...', totalPages - 1, totalPages];
                    } else if (currentPage >= totalPages - 3) {
                        pages = [1, 2, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
                    } else {
                        pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
                    }
                }

                navContainer.innerHTML = '';
                pages.forEach(p => {
                    if (p === '...') {
                        const ellipsis = document.createElement('span');
                        ellipsis.className = 'hs-pagination-ellipsis';
                        ellipsis.innerHTML = '&hellip;';
                        navContainer.appendChild(ellipsis);
                    } else {
                        const btn = document.createElement('button');
                        btn.type = 'button';
                        btn.className = p === currentPage ? 'hs-pagination-btn active' : 'hs-pagination-btn';
                        btn.textContent = p;
                        btn.setAttribute('data-page', p);
                        btn.addEventListener('click', function (e) {
                            e.preventDefault();
                            if (currentPage !== p) {
                                currentPage = p;
                                updatePaginationInfo();
                            }
                        });
                        navContainer.appendChild(btn);
                    }
                });
            }

            perPageItems.forEach(item => {
                item.addEventListener('click', function (e) {
                    e.preventDefault();
                    perPageItems.forEach(el => el.classList.remove('active'));
                    this.classList.add('active');
                    perPage = parseInt(this.getAttribute('data-per-page'), 10) || 10;
                    currentPage = 1;
                    updatePaginationInfo();
                });
            });

            if (navContainer) {
                const initialBtns = navContainer.querySelectorAll('.hs-pagination-btn');
                initialBtns.forEach(btn => {
                    btn.addEventListener('click', function (e) {
                        e.preventDefault();
                        const p = parseInt(this.getAttribute('data-page'), 10);
                        if (p && p !== currentPage) {
                            currentPage = p;
                            updatePaginationInfo();
                        }
                    });
                });
            }
        });
    }

    initTable1Pagination();
});