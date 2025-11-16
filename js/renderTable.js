(function (app) {
  if (!app) {
    throw new Error('LootApp is not initialized before renderTable.js runs');
  }

  const FALLBACK_CELL_COLOR = '#1a1d24';
  const PLACEHOLDER_IMAGE =
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

  function nameToFilename(name) {
    return (
      name
        .trim()
        .replace(/[^A-Za-z0-9]+/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '') + '.png'
    );
  }

  const imageOverrides = {
    "Dried-Out ARC Resin": 'Dried-Out_ARC_Resin.png',
    "Lance's Mixtape (5th Edition)": "Lance's_Mixtape_(5th_Edition).png"
  };

  function getGradientColor(value, min, max) {
    if (!Number.isFinite(value)) return FALLBACK_CELL_COLOR;
    if (value === 0 || !Number.isFinite(min) || !Number.isFinite(max) || min === max) {
      return FALLBACK_CELL_COLOR;
    }

    if (value > 0) {
      const intensity = Math.min(Math.abs(value) / Math.abs(max || 1), 1);
      const r = Math.round(80 * (1 - intensity));
      const g = Math.round(200 + 55 * intensity);
      return `rgba(${r},${g},0,0.35)`;
    }

    const intensity = Math.min(Math.abs(value) / Math.abs(min || 1), 1);
    const r = Math.round(120 + 100 * intensity);
    const channel = Math.round(20 * (1 - intensity));
    return `rgba(${r},${channel},${channel},0.35)`;
  }

  function renderLootTable(items) {
    const tbody = document.querySelector('#lootTable tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (!items || !items.length) {
      return;
    }

    const deltaValues = items.map((item) => Number(item.delta_sell) || 0);
    const minDelta = Math.min(...deltaValues, 0);
    const maxDelta = Math.max(...deltaValues, 0);

    items.forEach((item) => {
      const tr = document.createElement('tr');
      const formattedDelta = app.formatDelta(item.delta_sell);
      const recommendation = app.safeToSell(item);
      const imageFile = imageOverrides[item.name] || nameToFilename(item.name);
      const imagePath = encodeURI(`./assets/images/${imageFile}`);
      const gradientColor = getGradientColor(item.delta_sell, minDelta, maxDelta);

      tr.innerHTML = `
        <td>
          <img src="${imagePath}"
               alt="${item.name}"
               class="item-image"
               onerror="this.onerror=null;this.src='${PLACEHOLDER_IMAGE}';" />
        </td>
        <td>${item.name}</td>
        <td class="rarity rarity-${(item.rarity || 'common').toLowerCase()}">
          ${item.rarity}
        </td>
        <td>${item.category}</td>
        <td>${item.sell_value}</td>
        <td>${item.recycle_value}</td>
        <td style="background-color:${gradientColor}; font-weight:bold;" title="${recommendation}">
          ${formattedDelta}
        </td>
      `;

      tbody.appendChild(tr);
    });
  }

  app.renderLootTable = renderLootTable;
  app.getGradientColor = getGradientColor;
})(window.LootApp);
