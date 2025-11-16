(function (app) {
  if (!app) {
    throw new Error('LootApp is not initialized before safeToSell.js runs');
  }

  function safeToSell(item) {
    if (!item) {
      return 'No data available';
    }
    if (item.delta_sell > 0) return 'Recycle for a better return';
    if (item.delta_sell < 0) return 'Sell for a better return';
    return 'Sell or recycle (equal value)';
  }

  function formatDelta(value) {
    if (value === undefined || value === null || Number.isNaN(Number(value))) {
      return '0';
    }
    const rounded = Number(value).toFixed(0);
    return Number(value) > 0 ? `+${rounded}` : rounded;
  }

  function getSafeToSellStatus(_item) {
    return '—';
  }

  app.safeToSell = safeToSell;
  app.formatDelta = formatDelta;
  app.getSafeToSellStatus = getSafeToSellStatus;
})(window.LootApp);
