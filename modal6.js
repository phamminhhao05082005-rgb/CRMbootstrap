document.addEventListener('DOMContentLoaded', () => {
    
    const addTaskModal = document.getElementById('addTaskModal');
    const titleInput = addTaskModal.querySelector('.input-focus-blue');

    addTaskModal.addEventListener('shown.bs.modal', () => {
        titleInput.focus();
    });

    const clearOwnerBtn = document.getElementById('clearOwner');
    if(clearOwnerBtn) {
        clearOwnerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const ownerText = e.target.closest('.custom-select-box').querySelector('span');
            ownerText.textContent = 'Unassigned';
            ownerText.classList.add('text-muted');
        });
    }

    const removeChipBtn = document.getElementById('removeChip');
    if(removeChipBtn) {
        removeChipBtn.addEventListener('click', (e) => {
            const chip = document.getElementById('recordChip');
            if(chip) {
                chip.remove();
            }
        });
    }
});