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
});