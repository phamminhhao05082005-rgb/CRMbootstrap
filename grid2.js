document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.deal-card');
    const dropzones = document.querySelectorAll('.dropzone');
    const boardContainer = document.getElementById('kanbanContainer');
    
    let draggedCard = null;
    let placeholder = document.createElement('div');
    placeholder.classList.add('drop-placeholder');

    let autoScrollId = null;
    let scrollSpeed = 0;

    function startAutoScroll() {
        if (scrollSpeed !== 0 && boardContainer) {
            boardContainer.scrollLeft += scrollSpeed;
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

    if (boardContainer) {
        boardContainer.addEventListener('dragover', (e) => {
            if (!draggedCard) return;

            const threshold = 100;
            const rect = boardContainer.getBoundingClientRect();
            
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
            draggedCard = card;
            
            const title = card.querySelector('.deal-title').textContent;
            const isDanger = card.classList.contains('card-danger');
            
            placeholder.innerHTML = `
                <div class="placeholder-title ${isDanger ? 'bg-danger-subtle border-danger-subtle text-danger' : 'bg-white border-light'}">${title}</div>
                <div class="placeholder-text">Move here</div>
            `;
            
            setTimeout(() => {
                card.classList.add('is-dragging');
            }, 0);
        });

        card.addEventListener('dragend', () => {
            card.classList.remove('is-dragging');
            draggedCard = null;
            stopAutoScroll();
            
            if (placeholder.parentNode) {
                placeholder.parentNode.removeChild(placeholder);
            }
            
            dropzones.forEach(zone => zone.classList.remove('drag-over'));
            updateColumnCounts();
        });
    });

    dropzones.forEach(zone => {
        zone.addEventListener('dragover', e => {
            e.preventDefault();
            zone.classList.add('drag-over');

            const afterElement = getDragAfterElement(zone, e.clientY);
            
            if (afterElement == null) {
                zone.appendChild(placeholder);
            } else {
                zone.insertBefore(placeholder, afterElement);
            }
        });

        zone.addEventListener('dragleave', e => {
            if (e.target === zone) {
                zone.classList.remove('drag-over');
            }
        });

        zone.addEventListener('drop', e => {
            e.preventDefault();
            zone.classList.remove('drag-over');
            stopAutoScroll();
            
            if (draggedCard) {
                zone.insertBefore(draggedCard, placeholder);
                
                const emptyBtn = zone.querySelector('.add-deal-btn');
                if (emptyBtn) emptyBtn.style.display = 'none';
            }
        });
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.deal-card:not(.is-dragging)')];

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

    function updateColumnCounts() {
        document.querySelectorAll('.kanban-col').forEach(col => {
            const count = col.querySelectorAll('.deal-card').length;
            const badge = col.querySelector('.stage-count');
            if (badge) {
                badge.textContent = count;
            }
            
            const body = col.querySelector('.kanban-body');
            let emptyBtn = body.querySelector('.add-deal-btn');
            
            if (count === 0) {
                if (!emptyBtn) {
                    body.innerHTML = `<button class="btn btn-light w-100 text-secondary border-0 bg-transparent shadow-none add-deal-btn"><i class="bi bi-plus"></i> Add deal</button>`;
                } else {
                    emptyBtn.style.display = 'block';
                }
            }
        });
    }
});