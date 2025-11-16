(function (app) {
  if (!app) {
    throw new Error('LootApp is not initialized before filters.js runs');
  }

  let searchBox;
  let raritySelect;
  let categorySelect;

  function initFilters() {
    searchBox = document.getElementById('searchBox');
    raritySelect = document.getElementById('filterRarity');
    categorySelect = document.getElementById('filterCategory');
    const resetButton = document.getElementById('resetFilters');

    if (!searchBox || !raritySelect || !categorySelect) {
      console.warn('Filter controls are missing from the DOM');
      return;
    }

    applySavedFilters();

    [searchBox, raritySelect, categorySelect].forEach((el) =>
      el.addEventListener('input', handleFiltersChanged)
    );

    if (resetButton) {
      resetButton.addEventListener('click', resetFilters);
    }
  }

  function applySavedFilters() {
    searchBox.value = app.state.filters.term || '';
    raritySelect.value = app.state.filters.rarity || '';
    categorySelect.value = app.state.filters.category || '';
  }

  function handleFiltersChanged() {
    app.persistFilters({
      term: searchBox.value.trim(),
      rarity: raritySelect.value,
      category: categorySelect.value
    });
    app.sortAndRender(getCurrentFiltered());
  }

  function resetFilters() {
    const defaults = app.getDefaultFilters();
    searchBox.value = defaults.term;
    raritySelect.value = defaults.rarity;
    categorySelect.value = defaults.category;
    app.persistFilters(defaults);
    app.sortAndRender(app.state.allItems);
  }

  function filterItems(items = app.state.allItems) {
    const term = (searchBox?.value || '').toLowerCase();
    const rarity = raritySelect?.value || '';
    const category = categorySelect?.value || '';

    return items.filter((item) => {
      const matchesTerm = term ? item.name.toLowerCase().includes(term) : true;
      const matchesRarity = rarity ? item.rarity === rarity : true;
      const matchesCategory = category ? item.category === category : true;
      return matchesTerm && matchesRarity && matchesCategory;
    });
  }

  function getCurrentFiltered() {
    return filterItems(app.state.allItems);
  }

  function populateCategoryFilter(items) {
    if (!categorySelect) {
      categorySelect = document.getElementById('filterCategory');
    }
    if (!categorySelect) return;

    categorySelect.querySelectorAll('option[data-dynamic="true"]').forEach((opt) => opt.remove());

    const categories = [...new Set(items.map((item) => item.category))].sort();
    categories.forEach((category) => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      option.dataset.dynamic = 'true';
      categorySelect.appendChild(option);
    });

    categorySelect.value = app.state.filters.category || '';
  }

  app.initFilters = initFilters;
  app.resetFilters = resetFilters;
  app.filterItems = filterItems;
  app.getCurrentFiltered = getCurrentFiltered;
  app.populateCategoryFilter = populateCategoryFilter;
  app.applyFilters = () => app.sortAndRender(getCurrentFiltered());
})(window.LootApp);
