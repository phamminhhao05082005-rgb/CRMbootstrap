document.addEventListener("DOMContentLoaded", function () {
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    const selectAllCheckboxActive = document.getElementById('selectAllCheckboxActive');
    const itemCheckboxes = document.querySelectorAll('.single-item-checkbox');

    const defaultActionContent = document.getElementById('defaultActionContent');
    const selectedActionContent = document.getElementById('selectedActionContent');
    const selectionCountText = document.getElementById('selectionCountText');

    function updateActionBarState() {
        const totalItems = itemCheckboxes.length;
        const checkedItems = document.querySelectorAll('.single-item-checkbox:checked').length;
        const isSelectAllChecked = selectAllCheckbox.checked;

        if (isSelectAllChecked || checkedItems > 0) {
            defaultActionContent.classList.add('d-none');
            defaultActionContent.classList.remove('d-flex');
            selectedActionContent.classList.add('d-flex');
            selectedActionContent.classList.remove('d-none');

            if (isSelectAllChecked || checkedItems === totalItems) {
                selectionCountText.innerHTML = 'All selected <i class="bi bi-info-circle text-muted" style="font-size: 0.8rem;"></i>';
                selectAllCheckboxActive.checked = true;
                selectAllCheckboxActive.indeterminate = false;
                itemCheckboxes.forEach(cb => cb.checked = true);
            } else {
                selectionCountText.textContent = checkedItems + ' selected';
                selectAllCheckboxActive.checked = false;
                selectAllCheckboxActive.indeterminate = true;
            }
        } else {
            selectedActionContent.classList.add('d-none');
            selectedActionContent.classList.remove('d-flex');
            defaultActionContent.classList.add('d-flex');
            defaultActionContent.classList.remove('d-none');
            selectAllCheckbox.checked = false;
        }
    }

    selectAllCheckbox.addEventListener('change', function () {
        const isChecked = this.checked;
        itemCheckboxes.forEach(cb => cb.checked = isChecked);
        updateActionBarState();
    });

    selectAllCheckboxActive.addEventListener('change', function () {
        const isChecked = this.checked;
        itemCheckboxes.forEach(cb => cb.checked = isChecked);
        selectAllCheckbox.checked = isChecked;
        updateActionBarState();
    });

    itemCheckboxes.forEach(cb => {
        cb.addEventListener('change', function () {
            const checkedCount = document.querySelectorAll('.single-item-checkbox:checked').length;
            if (checkedCount === 0) {
                selectAllCheckbox.checked = false;
            }
            updateActionBarState();
        });
    });
});