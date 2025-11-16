(function (app) {
  if (!app) {
    throw new Error('LootApp is not initialized before dataLoader.js runs');
  }

  const DATA_PATH = './data/loot_table.json';

  function initialize() {
    app.initFilters();
    app.initSorting();
    fetchItems();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  function fetchItems() {
    fetch(DATA_PATH)
      .then((response) => response.json())
      .then((data) => {
        app.state.allItems = data.map(decorateItem);
        app.populateCategoryFilter(app.state.allItems);
        app.applyFilters();
      })
      .catch((error) => {
        console.error('Failed to load loot table data', error);
      });
  }

  function decorateItem(item) {
    const sellValue = parseFloat(item.sell_price) || 0;
    const recycleValue = estimateRecycleValue(item.recycles_to);
    const deltaSell = recycleValue - sellValue;

    return {
      ...item,
      sell_value: sellValue,
      recycle_value: recycleValue,
      delta_sell: deltaSell
    };
  }

  function estimateRecycleValue(text) {
    if (!text || text === 'Cannot be recycled' || text === '-') {
      return 0;
    }

    const matches = [...text.matchAll(/(\d+)x/gi)];
    const sum = matches.reduce((total, match) => total + parseInt(match[1], 10), 0);
    return sum * 100;
  }
})(window.LootApp);
