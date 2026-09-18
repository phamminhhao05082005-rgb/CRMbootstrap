document.addEventListener('DOMContentLoaded', () => {
    
    const clearAccountBtn = document.getElementById('clearAccount');
    if (clearAccountBtn) {
        clearAccountBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const accountText = document.getElementById('accountText');
            if (accountText) {
                accountText.textContent = '';
                accountText.classList.add('text-muted');
                clearAccountBtn.style.display = 'none';
            }
        });
    }

    const removeContactChipBtn = document.getElementById('removeContactChip');
    if (removeContactChipBtn) {
        removeContactChipBtn.addEventListener('click', (e) => {
            const chip = document.getElementById('contactChip');
            if (chip) {
                chip.remove();
            }
        });
    }
});