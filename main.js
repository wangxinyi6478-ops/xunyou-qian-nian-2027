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

function announce(item, prefix = '', suffix = '') {
  if (!interactionStatus || !item) return;
  const title = item.dataset.title || '';
  const note = item.dataset.note || '';
  interactionStatus.textContent = `${prefix}${title}${note ? `：${note}` : ''}${suffix}`;
}

function selectOnly(items, selected) {
  items.forEach((item) => {
    const isSelected = item === selected;
    item.classList.toggle('is-selected', isSelected);
    item.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
  });
}

// 01｜檔案卡：以游標光點和可開合的選取狀態回應閱讀。
const archiveTiles = [...document.querySelectorAll('.value-item--archive')];
archiveTiles.forEach((tile) => {
  tile.addEventListener('pointermove', (event) => {
    const bounds = tile.getBoundingClientRect();
    tile.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
    tile.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
  });
  tile.addEventListener('click', () => {
    const wasSelected = tile.classList.contains('is-selected');
    archiveTiles.forEach((candidate) => {
      candidate.classList.toggle('is-selected', candidate === tile && !wasSelected);
      candidate.setAttribute('aria-pressed', candidate === tile && !wasSelected ? 'true' : 'false');
    });
    if (wasSelected && interactionStatus) {
      interactionStatus.textContent = '';
    } else {
      announce(tile, '已查看工作坊重點：');
    }
  });
});

// 02｜資料卡：像翻閱檔案一樣，每次只打開一張安排卡。
const catalogCards = [...document.querySelectorAll('.fact-card--catalog')];
catalogCards.forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    const bounds = card.getBoundingClientRect();
    card.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
    card.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
  });
  card.addEventListener('click', () => {
    const wasSelected = card.classList.contains('is-selected');
    catalogCards.forEach((candidate) => {
      candidate.classList.toggle('is-selected', candidate === card && !wasSelected);
      candidate.setAttribute('aria-pressed', candidate === card && !wasSelected ? 'true' : 'false');
    });
    if (wasSelected && interactionStatus) {
      interactionStatus.textContent = '';
    } else {
      announce(card, '工作坊安排：');
    }
  });
});

// 03｜進度卡：選一格就留下走過的路，讓創作流程變成可讀的進度。
const progressSteps = [...document.querySelectorAll('.journey-step--progress')];
progressSteps.forEach((step, index) => {
  step.addEventListener('click', () => {
    progressSteps.forEach((candidate, candidateIndex) => {
      candidate.classList.toggle('is-selected', candidate === step);
      candidate.classList.toggle('is-visited', candidateIndex < index);
      candidate.setAttribute('aria-pressed', candidate === step ? 'true' : 'false');
      if (candidate === step) candidate.setAttribute('aria-current', 'step');
      else candidate.removeAttribute('aria-current');
    });
    announce(step, '目前創作階段：', index ? `（已完成前 ${index} 個階段）` : '（創作起點）');
  });
});

// 04｜時間卡：沿著歷史事件線選取一格，節點與卡片同步聚焦。
const timelineCards = [...document.querySelectorAll('.event--timeline')];
const timeline = document.querySelector('.event-line');
timelineCards.forEach((card, index) => {
  card.addEventListener('click', () => {
    selectOnly(timelineCards, card);
    timeline?.style.setProperty('--selected-event', index);
    announce(card, '已選擇歷史事件：');
  });
});
