document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.drag-card');
    const columns = document.querySelectorAll('.kanban-col-body');
    const boardWrapper = document.querySelector('.board-wrapper');

    let autoScrollId = null;
    let scrollSpeed = 0;

    function startAutoScroll() {
        if (scrollSpeed !== 0 && boardWrapper) {
            boardWrapper.scrollLeft += scrollSpeed;
            autoScrollId = requestAnimationFrame(startAutoScroll);
        } else {
            cancelAnimationFrame(autoScrollId);
            autoScrollId = null;
        }
    }

    function stopAutoScroll() {
        scrollSpeed = 0;
        if (autoScrollId) {
            cancelAnimationFrame(autoScrollId);
            autoScrollId = null;
        }
    }

    if (boardWrapper) {
        boardWrapper.addEventListener('dragover', (e) => {
            e.preventDefault(); 
            
            const draggingCard = document.querySelector('.dragging');
            if (!draggingCard) return;

            const threshold = 100;
            const rect = boardWrapper.getBoundingClientRect();
            
            const distToLeft = e.clientX - rect.left;
            const distToRight = rect.right - e.clientX;

            if (distToLeft < threshold) {
                scrollSpeed = -15 * (1 - distToLeft / threshold) - 3;
                if (!autoScrollId) startAutoScroll();
            } 
            else if (distToRight < threshold) {
                scrollSpeed = 15 * (1 - distToRight / threshold) + 3;
                if (!autoScrollId) startAutoScroll();
            } 
            else {
                stopAutoScroll();
            }
        });
    }

    cards.forEach(card => {
        card.addEventListener('dragstart', (e) => {
            if (e.target.tagName.toLowerCase() === 'button' || e.target.closest('button')) {
                e.preventDefault();
                return;
            }
            setTimeout(() => card.classList.add('dragging'), 0);
        });

        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
            stopAutoScroll();
        });
    });

    columns.forEach(column => {
        column.addEventListener('dragover', e => {
            e.preventDefault();
            const afterElement = getDragAfterElement(column, e.clientY);
            const draggable = document.querySelector('.dragging');
            
            if (draggable) {
                const addDealBtn = column.querySelector('.add-deal-btn');
                
                if (afterElement == null || afterElement === addDealBtn) {
                    column.insertBefore(draggable, addDealBtn);
                } else {
                    column.insertBefore(draggable, afterElement);
                }
            }
        });
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.drag-card:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
});
