document.addEventListener('DOMContentLoaded', function () {
    const wrappers = document.querySelectorAll('.custom-select-wrapper');

    wrappers.forEach(wrapper => {
        const trigger = wrapper.querySelector('.custom-select-trigger');
        const searchInput = wrapper.querySelector('.custom-select-search');
        const items = wrapper.querySelectorAll('.custom-select-item');

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = wrapper.classList.contains('open');
            document.querySelectorAll('.custom-select-wrapper').forEach(w => w.classList.remove('open'));
            if (!isOpen) {
                wrapper.classList.add('open');
                searchInput.focus();
            }
        });

        searchInput.addEventListener('input', (e) => {
            const filter = e.target.value.toLowerCase();
            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(filter)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });

        items.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                trigger.innerHTML = item.innerHTML;
                wrapper.classList.remove('open');
                searchInput.value = '';
                items.forEach(i => i.style.display = 'flex');
            });
        });
    });

    document.addEventListener('click', () => {
        wrappers.forEach(wrapper => wrapper.classList.remove('open'));
    });

    document.querySelectorAll('.custom-select-menu').forEach(menu => {
        menu.addEventListener('click', (e) => e.stopPropagation());
    });
});