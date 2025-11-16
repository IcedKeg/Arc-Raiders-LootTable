(function (global) {
  const STORAGE_KEY = 'lootAppPreferences';
  const DEFAULT_FILTERS = { term: '', rarity: '', category: '' };
  const DEFAULT_SORT = { key: 'name', asc: true };

  function loadState() {
    try {
      const raw = global.localStorage ? global.localStorage.getItem(STORAGE_KEY) : null;
      return raw ? JSON.parse(raw) : {};
    } catch (error) {
      console.warn('Unable to load saved preferences', error);
      return {};
    }
  }

  function saveState(filters, sort) {
    try {
      if (global.localStorage) {
        const payload = JSON.stringify({ filters, sort });
        global.localStorage.setItem(STORAGE_KEY, payload);
      }
    } catch (error) {
      console.warn('Unable to persist preferences', error);
    }
  }

  const persisted = loadState();
  const app = (global.LootApp = global.LootApp || {});

  app.state = {
    allItems: [],
    currentSort: { ...DEFAULT_SORT, ...(persisted.sort || {}) },
    filters: { ...DEFAULT_FILTERS, ...(persisted.filters || {}) }
  };

  app.getDefaultFilters = () => ({ ...DEFAULT_FILTERS });
  app.getDefaultSort = () => ({ ...DEFAULT_SORT });

  app.persistFilters = function persistFilters(filters) {
    app.state.filters = { ...DEFAULT_FILTERS, ...filters };
    saveState(app.state.filters, app.state.currentSort);
  };

  app.persistSort = function persistSort(sort) {
    app.state.currentSort = { ...DEFAULT_SORT, ...sort };
    saveState(app.state.filters, app.state.currentSort);
  };
})(window);
