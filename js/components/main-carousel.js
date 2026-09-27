const btnRight = document.querySelector('.button-arrow.-right');
const btnLeft = document.querySelector('.button-arrow.-left');
const items = document.querySelector('.main-carousel .items');
const progress = document.querySelector('.carousel-progress');
const cards = Array.from(items.querySelectorAll('.node-card'));
let dragStart = null;
let scrollStart = 0;

const updateButtons = () => {
    const maxScroll = items.scrollWidth - items.clientWidth;
    btnLeft.disabled = items.scrollLeft <= 1;
    btnRight.disabled = items.scrollLeft >= maxScroll - 1;
    const activeCard = maxScroll > 0 ? Math.round((items.scrollLeft / maxScroll) * (cards.length - 1)) : 0;
    progress.textContent = `EXP. ${activeCard + 1} / ${cards.length}`;
};

const stopDragging = (event) => {
    if (dragStart === null) return;
    dragStart = null;
    items.classList.remove('-dragging');
    if (items.hasPointerCapture(event.pointerId)) items.releasePointerCapture(event.pointerId);
};

btnRight.addEventListener('click', () => {
    items.scrollBy({ left: Math.min(320, items.clientWidth), behavior: 'smooth' });
});

btnLeft.addEventListener('click', () => {
    items.scrollBy({ left: -Math.min(320, items.clientWidth), behavior: 'smooth' });
});

items.addEventListener('scroll', updateButtons);
window.addEventListener('resize', updateButtons);

items.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse') return;
    dragStart = event.clientX;
    scrollStart = items.scrollLeft;
    items.classList.add('-dragging');
    items.setPointerCapture(event.pointerId);
});

items.addEventListener('pointermove', (event) => {
    if (dragStart === null) return;
    items.scrollLeft = scrollStart - (event.clientX - dragStart);
});

items.addEventListener('pointerup', stopDragging);
items.addEventListener('pointercancel', stopDragging);

updateButtons();
