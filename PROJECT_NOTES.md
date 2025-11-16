# Keg Loot Organizer

Client-side table that helps track Arc Raiders loot, showing sell and recycle values with quick filtering and sorting controls.

## Folder Layout

```
Keg-Loot-Organizer/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── dataLoader.js
│   ├── filters.js
│   ├── renderTable.js
│   ├── safeToSell.js
│   ├── sorting.js
│   └── storage.js
├── data/
│   └── loot_table.json
└── assets/
    └── images/
```

## Local Development

1. Serve the folder through any static server (Live Server, `python -m http.server`, etc.).
2. Open `index.html` in a browser.
3. Update `data/loot_table.json` or add new assets in `assets/images` as needed.

The JS files are split by responsibility (storage, data loading, rendering, filters, sorting, and helper logic) to make future maintenance and additions easier.
