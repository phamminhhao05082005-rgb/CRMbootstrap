document.addEventListener('DOMContentLoaded', () => {
    const profileLabel = document.getElementById('profileLabel');
    const popoverTemplateEl = document.getElementById('popoverTemplate');
    if (!profileLabel || !popoverTemplateEl) return;
    
    const popoverTemplate = popoverTemplateEl.innerHTML;
    
    const popover = new bootstrap.Popover(profileLabel, {
        html: true,
        content: popoverTemplate,
        placement: 'right',
        customClass: 'custom-profile-popover',
        trigger: 'manual',
        sanitize: false
    });

    let hideTimeout;

    const showPopover = () => {
        clearTimeout(hideTimeout);
        popover.show();
        
        const popoverElement = document.querySelector('.custom-profile-popover');
        if (popoverElement) {
            popoverElement.addEventListener('mouseenter', () => clearTimeout(hideTimeout));
            popoverElement.addEventListener('mouseleave', hidePopover);
        }
    };

    const hidePopover = () => {
        hideTimeout = setTimeout(() => {
            popover.hide();
        }, 300);
    };

    profileLabel.addEventListener('mouseenter', showPopover);
    profileLabel.addEventListener('mouseleave', hidePopover);
    profileLabel.addEventListener('focus', showPopover);
    profileLabel.addEventListener('blur', hidePopover);
});
