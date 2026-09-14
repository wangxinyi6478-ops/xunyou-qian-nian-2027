const revealItems = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealItems.forEach((item) => observer.observe(item));

const interactionStatus = document.querySelector('#interaction-status');

function announce(item, prefix = '') {
  if (!interactionStatus || !item) return;
  const title = item.dataset.title || '';
  const note = item.dataset.note || '';
  interactionStatus.textContent = `${prefix}${title}${note ? `：${note}` : ''}`;
}

function setupSelectableGroup(selector, prefix) {
  const items = [...document.querySelectorAll(selector)];
  items.forEach((item) => {
    item.addEventListener('click', () => {
      const wasSelected = item.classList.contains('is-selected');
      items.forEach((candidate) => {
        candidate.classList.toggle('is-selected', candidate === item && !wasSelected);
        candidate.setAttribute('aria-pressed', candidate === item && !wasSelected ? 'true' : 'false');
      });
      if (wasSelected) {
        if (interactionStatus) interactionStatus.textContent = '';
      } else {
        announce(item, prefix);
      }
    });
  });
}

setupSelectableGroup('.value-item', '已查看工作坊重點：');
setupSelectableGroup('.fact-card', '工作坊安排：');
setupSelectableGroup('.journey-step', '目前創作階段：');
setupSelectableGroup('.event', '已選擇歷史事件：');

document.querySelectorAll('.value-item, .fact-card').forEach((item) => {
  item.addEventListener('pointermove', (event) => {
    const bounds = item.getBoundingClientRect();
    item.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
    item.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
  });
});
