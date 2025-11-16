(function (app) {
  if (!app) {
    throw new Error('LootApp is not initialized before sorting.js runs');
  }

  function initSorting() {
    const headers = document.querySelectorAll('th[data-sort]');
    headers.forEach((th) => {
      if (!th.dataset.label) {
        th.dataset.label = th.textContent.trim();
      }
      th.addEventListener('click', () => handleSortClick(th));
    });

    const initialHeader = Array.from(headers).find(
      (header) => header.dataset.sort === app.state.currentSort.key
    );
    if (initialHeader) {
      updateSortIndicators(initialHeader);
    }
  }

  function handleSortClick(th) {
    const key = th.dataset.sort;
    if (!key) return;

    if (app.state.currentSort.key === key) {
      app.state.currentSort.asc = !app.state.currentSort.asc;
    } else {
      app.state.currentSort.key = key;
      app.state.currentSort.asc = true;
    }

    app.persistSort(app.state.currentSort);
    updateSortIndicators(th);
    app.sortAndRender(app.getCurrentFiltered());
  }

  function sortAndRender(items) {
    const sorted = [...items].sort((a, b) => compareValues(a, b, app.state.currentSort));
    app.renderLootTable(sorted);
  }

  function compareValues(a, b, sort) {
    const key = sort.key;
    const asc = sort.asc;
    const valueA = normalizeValue(a[key]);
    const valueB = normalizeValue(b[key]);

    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return asc ? valueA - valueB : valueB - valueA;
    }

    return asc
      ? String(valueA).localeCompare(String(valueB))
      : String(valueB).localeCompare(String(valueA));
  }

  function normalizeValue(value) {
    if (value === undefined || value === null) {
      return '';
    }

    const numericValue = Number(value);
    if (!Number.isNaN(numericValue)) {
      return numericValue;
    }

    return value.toString().toLowerCase();
  }

  function updateSortIndicators(activeTh) {
    const headers = document.querySelectorAll('th[data-sort]');

    headers.forEach((th) => {
      const baseLabel = th.dataset.label || th.textContent.replace(/[▲▼]/g, '').trim();
      if (!th.dataset.label) {
        th.dataset.label = baseLabel;
      }
      th.textContent = baseLabel;
      if (th === activeTh) {
        th.textContent = `${baseLabel} ${app.state.currentSort.asc ? '▲' : '▼'}`;
      }
    });
  }

  app.sortAndRender = sortAndRender;
  app.initSorting = initSorting;
  app.updateSortIndicators = updateSortIndicators;
})(window.LootApp);
