document.addEventListener('mousemove', function (e) {
    if (!document.querySelector('.event-section')) return;
    const threshold = window.innerWidth - 50;
    if (e.clientX > threshold) {
        document.body.classList.add('scroll-visible');
    } else {
        document.body.classList.remove('scroll-visible');
    }
});
