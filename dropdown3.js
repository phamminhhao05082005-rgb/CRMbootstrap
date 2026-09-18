document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById('dropdownQuickSearch');
    const listContainer = document.getElementById('dropdownActionList');

    if (searchInput && listContainer) {
        const listItems = listContainer.querySelectorAll('li');

        searchInput.addEventListener('input', function () {
            const filter = searchInput.value.toLowerCase().trim();

            listItems.forEach(function (item) {
                const textValue = item.textContent || item.innerText;
                if (textValue.toLowerCase().indexOf(filter) > -1) {
                    item.style.display = "";
                } else {
                    item.style.display = "none";
                }
            });
        });
    }
});