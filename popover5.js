document.addEventListener('DOMContentLoaded', () => {
    const trigger = document.getElementById('contactPopoverTrigger');
    const template = document.getElementById('contactPopoverTemplate').innerHTML;
    
    const popover = new bootstrap.Popover(trigger, {
        html: true,
        content: template,
        placement: 'bottom',
        customClass: 'custom-popover-container',
        trigger: 'manual',
        sanitize: false
    });

    let hideTimeout;

    const showPopover = () => {
        clearTimeout(hideTimeout);
        popover.show();
        
        const popoverElement = document.querySelector('.custom-popover-container');
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

    trigger.addEventListener('mouseenter', showPopover);
    trigger.addEventListener('mouseleave', hidePopover);
    trigger.addEventListener('focus', showPopover);
    trigger.addEventListener('blur', hidePopover);
});