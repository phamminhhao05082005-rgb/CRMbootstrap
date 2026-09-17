document.addEventListener('DOMContentLoaded', () => {
    const chatToggleBtn = document.getElementById('chatToggleBtn');
    const chatWindow = document.getElementById('chatWindow');
    const closeBtns = document.querySelectorAll('.close-btn');
    const expandBtns = document.querySelectorAll('.expand-btn');
    const backToListBtn = document.getElementById('backToListBtn');
    const openChatBtn = document.getElementById('openChatBtn');
    const chatBodyScroll = document.getElementById('chatBodyScroll');

    function toggleChat() {
        chatWindow.classList.toggle('open');
        chatToggleBtn.classList.toggle('active');
        if (chatWindow.classList.contains('open')) {
            chatBodyScroll.scrollTop = chatBodyScroll.scrollHeight;
        }
    }

    chatToggleBtn.addEventListener('click', toggleChat);

    closeBtns.forEach(btn => {
        btn.addEventListener('click', toggleChat);
    });

    expandBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            chatWindow.classList.toggle('expanded');
        });
    });

    backToListBtn.addEventListener('click', () => {
        chatWindow.classList.add('show-list');
    });

    openChatBtn.addEventListener('click', () => {
        chatWindow.classList.remove('show-list');
        chatBodyScroll.scrollTop = chatBodyScroll.scrollHeight;
    });
});