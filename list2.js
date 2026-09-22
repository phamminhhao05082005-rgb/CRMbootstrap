document.addEventListener('DOMContentLoaded', () => {
    const selectAllCb = document.getElementById('selectAll');
    const itemCbs = document.querySelectorAll('.item-cb');

    const updateRowStyle = (checkbox) => {
        const row = checkbox.closest('.list-item');
        if (checkbox.checked) {
            row.classList.add('selected-row');
        } else {
            row.classList.remove('selected-row');
        }
    };

    if (selectAllCb) {
        selectAllCb.addEventListener('change', function() {
            const isChecked = this.checked;
            
            itemCbs.forEach(cb => {
                cb.checked = isChecked;
                updateRowStyle(cb);
            });
        });
    }

    itemCbs.forEach(cb => {
        cb.addEventListener('change', () => {
            updateRowStyle(cb);
            
            const total = itemCbs.length;
            const checkedCount = document.querySelectorAll('.item-cb:checked').length;
            
            if (selectAllCb) {
                if (checkedCount === total && total > 0) {
                    selectAllCb.checked = true;
                    selectAllCb.indeterminate = false;
                } 
                else if (checkedCount === 0) {
                    selectAllCb.checked = false;
                    selectAllCb.indeterminate = false;
                } 
                else {
                    selectAllCb.checked = false;
                    selectAllCb.indeterminate = true;
                }
            }
        });
    });

    const pageLinks = document.querySelectorAll('.inbox-footer .page-item:not(.disabled) .page-link');
    pageLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const parent = link.closest('.pagination');
            if (parent) {
                parent.querySelectorAll('.page-item').forEach(item => item.classList.remove('active'));
                const pageItem = link.closest('.page-item');
                if (pageItem) pageItem.classList.add('active');
            }
        });
    });
});