document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById('dropdownQuickSearch');
    const listItems = document.querySelectorAll('#dropdownActionList li');

    if (searchInput && listItems.length > 0) {
        searchInput.addEventListener('keyup', function () {

            let filter = searchInput.value.toLowerCase();

            listItems.forEach(function (item) {

                let textValue = item.textContent || item.innerText;

                if (textValue.toLowerCase().indexOf(filter) > -1) {
                    item.style.display = "";
                } else {
                    item.style.display = "none";
                }
            });
        });
    }
});