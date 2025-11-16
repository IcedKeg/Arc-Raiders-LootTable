"""
Utility script to extract structured gameplay data from scraped ARC Raiders wiki pages.

Current milestone:
  * walk the HTML archive
  * identify likely item vs quest pages
  * pull the base fields (name, rarity, category, sell price) for item pages
  * emit `combined_data.json` that matches the downstream schema with placeholder
    structures for data that will be filled in future passes.
"""
from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Dict, List, Optional, Tuple

try:
    from bs4 import BeautifulSoup
except ModuleNotFoundError as exc:  # pragma: no cover - defensive guardrail
    raise SystemExit(
        "BeautifulSoup4 is required for this script. Install with `pip install beautifulsoup4`."
    ) from exc

RARITIES = {"Common", "Uncommon", "Rare", "Epic", "Legendary"}
HUB_KEYWORDS = {
    "quests",
    "weapons",
    "loot",
    "workshop",
    "traders",
    "materials",
    "components",
    "items",
    "crafting",
    "upgrades",
}
CATEGORY_REGEX = re.compile(r'"wgCategories":(\[.*?\])', re.S)
TRADER_PATTERN = re.compile(r"quest(?:s)?\s+(?:given|offered)\s+by\s+([A-Z][a-z]+)", re.I)


def clean_text(value: Optional[str]) -> str:
    if not value:
        return ""
    return re.sub(r"\s+", " ", value).strip()


def extract_categories(raw_html: str) -> List[str]:
    match = CATEGORY_REGEX.search(raw_html)
    if not match:
        return []
    payload = match.group(1)
    try:
        return json.loads(payload)
    except json.JSONDecodeError:
        # Fallback to a naive split in case the JSON is slightly malformed.
        return [
            part.strip().strip('"')
            for part in payload.strip("[]").split(",")
            if part.strip()
        ]


def is_hub_page(path: Path, categories: List[str]) -> bool:
    base_name = path.stem.lower()
    if any(keyword in base_name for keyword in HUB_KEYWORDS):
        return True
    return any("Lore" in cat for cat in categories)


def is_quest_page(path: Path, categories: List[str]) -> bool:
    base_name = path.stem.lower()
    if "quest" in base_name:
        return True
    return any(cat.lower().startswith("quest") for cat in categories)


def is_item_page(soup: BeautifulSoup, categories: List[str]) -> bool:
    if any("quest" in cat.lower() for cat in categories):
        return False
    if any("lore" in cat.lower() for cat in categories):
        return False
    infobox = soup.select_one("table.infobox")
    if not infobox:
        return False
    sell_row = infobox.find("th", string=lambda text: text and "Sell" in text)
    return sell_row is not None


def parse_category_and_rarity(infobox: BeautifulSoup) -> Tuple[Optional[str], Optional[str]]:
    category = None
    rarity = None
    for row in infobox.select("tr.data-tag"):
        text = clean_text(row.get_text())
        if not text:
            continue
        if text in RARITIES:
            rarity = text
        elif not category:
            category = text
    return category, rarity


def parse_sell_price(infobox: BeautifulSoup) -> Optional[int]:
    sell_row = infobox.find("tr", class_=lambda value: value and "data-sellprice" in value)
    if not sell_row:
        return None
    value_text = clean_text(sell_row.get_text())
    match = re.search(r"(\d[\d,]*)", value_text)
    if not match:
        return None
    return int(match.group(1).replace(",", ""))


def parse_components(_soup: BeautifulSoup) -> List[Dict[str, int]]:
    """Placeholder for future component parsing logic."""
    return []


def parse_requirements(_soup: BeautifulSoup) -> Dict[str, List[Dict[str, object]]]:
    """Placeholder for future requirement parsing logic."""
    return {"workshop": [], "quests": [], "crafting": []}


def parse_item_page(soup: BeautifulSoup, _categories: List[str]) -> Optional[Dict[str, object]]:
    infobox = soup.select_one("table.infobox")
    if not infobox:
        return None

    name_element = infobox.select_one("tr.infobox-title")
    if name_element:
        name = clean_text(name_element.get_text())
    else:
        heading = soup.select_one("#firstHeading")
        name = clean_text(heading.get_text() if heading else "")

    if not name:
        return None

    category, rarity = parse_category_and_rarity(infobox)
    sell_price = parse_sell_price(infobox)

    return {
        "name": name,
        "rarity": rarity,
        "category": category,
        "values": {
            "sell": sell_price,
            "recycle": {},
        },
        "components": parse_components(soup),
        "requirements": parse_requirements(soup),
    }


def parse_quest_page(soup: BeautifulSoup, _categories: List[str]) -> Dict[str, object]:
    heading = soup.select_one("#firstHeading")
    quest_name = clean_text(heading.get_text() if heading else "")

    trader = None
    meta_desc = soup.find("meta", attrs={"name": "description"})
    if meta_desc and meta_desc.has_attr("content"):
        match = TRADER_PATTERN.search(meta_desc["content"])
        if match:
            trader = match.group(1)

    infobox = soup.select_one("table.infobox")
    if not trader and infobox:
        trader_row = infobox.find(
            "th", string=lambda text: text and ("Trader" in text or "Quest Giver" in text)
        )
        if trader_row:
            cell = trader_row.find_next("td")
            trader = clean_text(cell.get_text() if cell else "")

    return {
        "quest_name": quest_name,
        "trader": trader,
        "requirements": [],
    }


def read_html(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def write_combined_data(items: List[Dict[str, object]], output_path: Path) -> None:
    output_path.write_text(json.dumps(items, indent=2, ensure_ascii=False), encoding="utf-8")


def main() -> None:
    repo_root = Path(__file__).resolve().parents[1]
    wiki_dir = repo_root / "assets" / "arcraiders_wiki_pages"
    output_path = repo_root / "data" / "combined_data.json"

    items: List[Dict[str, object]] = []
    quests: List[Dict[str, object]] = []

    for html_file in sorted(wiki_dir.glob("*.html")):
        raw_html = read_html(html_file)
        categories = extract_categories(raw_html)

        if is_hub_page(html_file, categories):
            continue

        soup = BeautifulSoup(raw_html, "html.parser")

        if is_quest_page(html_file, categories):
            quests.append(parse_quest_page(soup, categories))
            continue

        if is_item_page(soup, categories):
            parsed = parse_item_page(soup, categories)
            if parsed:
                items.append(parsed)

    write_combined_data(items, output_path)
    print(f"Extracted {len(items)} items into {output_path}")
    print(f"Indexed {len(quests)} quest summaries for future requirement mapping.")


if __name__ == "__main__":
    main()
