let allItems = [];
let currentSort = { key: 'name', asc: true };

fetch('./data/loot_table.json')
  .then(res => res.json())
  .then(data => {
    // Preprocess each item
    allItems = data.map(item => {
  const sellValue = parseFloat(item.sell_price) || 0;
  const recycleValue = estimateRecycleValue(item.recycles_to);
  const deltaSell = recycleValue - sellValue; // ✅ flipped for correct logic
  return { ...item, sell_value: sellValue, recycle_value: recycleValue, delta_sell: deltaSell };
});


    populateCategoryFilter(allItems);
    renderLootTable(allItems);
  });

// --- Helper to extract a rough recycle value from text like "2x Metal Parts" ---
function estimateRecycleValue(text) {
  if (!text || text === "Cannot be recycled" || text === "-") return 0;
  const matches = [...text.matchAll(/(\d+)x/gi)];
  let sum = 0;
  for (const m of matches) sum += parseInt(m[1]);
  return sum * 100; // ← adjustable base value per recycled unit
}

// --- Build dropdown filter dynamically ---
function populateCategoryFilter(data) {
  const categories = [...new Set(data.map(i => i.category))].sort();
  const select = document.getElementById('filterCategory');
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });
}

// --- Render Table ---

// Map item name to image filename in Complete Image Set
function nameToFilename(name) {
  return name
    .trim()
    .replace(/[^A-Za-z0-9]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '') + '.png';
}
// Explicit overrides for filenames that differ from generated pattern
const imageOverrides = {
  "Dried-Out ARC Resin": "Dried-Out_ARC_Resin.png",
  "Lance's Mixtape (5th Edition)": "Lance's_Mixtape_(5th_Edition).png"
};
function renderLootTable(items) {
  const tbody = document.querySelector('#lootTable tbody');
  tbody.innerHTML = '';

  const minDelta = Math.min(...items.map(i => i.delta_sell));
  const maxDelta = Math.max(...items.map(i => i.delta_sell));

  items.forEach(item => {
    const tr = document.createElement('tr');
    const deltaColor = getGradientColor(item.delta_sell, minDelta, maxDelta);

    // Add + sign for positive values
    const formattedDelta = item.delta_sell > 0
      ? `+${item.delta_sell.toFixed(0)}`
      : item.delta_sell.toFixed(0);

    const imgFile = imageOverrides[item.name] || nameToFilename(item.name);
    const imgPath = `./assets/images/${imgFile}`;
    const imgSrc = encodeURI(imgPath);

    tr.innerHTML = `
      <td>
        <img src="${imgSrc}"
             alt="${item.name}"
             class="item-image"
             onerror="this.onerror=null;this.style.opacity='0';this.src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='" />
      </td>
      <td>${item.name}</td>
      <td class="rarity rarity-${item.rarity?.toLowerCase() || 'common'}">
        ${item.rarity}
      </td>
      <td>${item.category}</td>
      <td>${item.sell_value}</td>
      <td>${item.recycle_value}</td>
      <td style="background-color:${deltaColor}; font-weight:bold;">
        ${formattedDelta}
      </td>
    `;

    tbody.appendChild(tr);
  });
}


function getGradientColor(value, min, max) {
  // Neutral (no delta)
  if (value === 0) return '#1a1d24'; // match your table background

  // Positive delta (recycling is better)
  if (value > 0) {
    const intensity = Math.min(value / max, 1);
    const r = Math.round(80 * (1 - intensity)); // keeps low red tone
    const g = Math.round(200 + 55 * intensity); // brightens as profit increases
    return `rgba(${r},${g},0,0.35)`;
  }

  // Negative delta (selling is better)
  if (value < 0) {
    const intensity = Math.min(Math.abs(value) / Math.abs(min || 1), 1);
    const r = Math.round(120 + 100 * intensity); // 120→220 range of red
    const g = Math.round(20 * (1 - intensity));  // dim green channel
    const b = Math.round(20 * (1 - intensity));  // dim blue channel
    return `rgba(${r},${g},${b},0.35)`;
  }

  // Safety fallback
  return '#1a1d24';
}






// === Filters and Search ===
const searchBox = document.getElementById('searchBox');
const raritySelect = document.getElementById('filterRarity');
const categorySelect = document.getElementById('filterCategory');
const resetButton = document.getElementById('resetFilters');

[searchBox, raritySelect, categorySelect].forEach(el =>
  el.addEventListener('input', applyFilters)
);
resetButton.addEventListener('click', resetFilters);

function applyFilters() {
  let filtered = [...allItems];
  const term = searchBox.value.toLowerCase();
  const rarity = raritySelect.value;
  const category = categorySelect.value;

  if (term) filtered = filtered.filter(i => i.name.toLowerCase().includes(term));
  if (rarity) filtered = filtered.filter(i => i.rarity === rarity);
  if (category) filtered = filtered.filter(i => i.category === category);

  sortAndRender(filtered);
}

function resetFilters() {
  searchBox.value = '';
  raritySelect.value = '';
  categorySelect.value = '';
  sortAndRender(allItems);
}

// === Sorting ===
document.querySelectorAll('th[data-sort]').forEach(th => {
  th.addEventListener('click', () => {
    const key = th.dataset.sort;
    if (currentSort.key === key) {
      currentSort.asc = !currentSort.asc;
    } else {
      currentSort.key = key;
      currentSort.asc = true;
    }
    sortAndRender(getCurrentFiltered());
    updateSortIndicators(th);
  });
});

function sortAndRender(items) {
  const key = currentSort.key;
  const asc = currentSort.asc;
  items.sort((a, b) => {
    const A = (a[key] ?? '').toString().toLowerCase();
    const B = (b[key] ?? '').toString().toLowerCase();
    if (!isNaN(parseFloat(A)) && !isNaN(parseFloat(B))) {
      return asc ? A - B : B - A;
    }
    return asc ? A.localeCompare(B) : B.localeCompare(A);
  });
  renderLootTable(items);
}

function getCurrentFiltered() {
  let filtered = [...allItems];
  const term = searchBox.value.toLowerCase();
  const rarity = raritySelect.value;
  const category = categorySelect.value;

  if (term) filtered = filtered.filter(i => i.name.toLowerCase().includes(term));
  if (rarity) filtered = filtered.filter(i => i.rarity === rarity);
  if (category) filtered = filtered.filter(i => i.category === category);
  return filtered;
}

function updateSortIndicators(activeTh) {
  document.querySelectorAll('th[data-sort]').forEach(th => {
    th.textContent = th.textContent.replace(/[▲▼]/g, '').trim();
  });
  activeTh.textContent += currentSort.asc ? ' ▲' : ' ▼';
}


