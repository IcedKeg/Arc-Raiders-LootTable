# 🎮 Arc Raiders Loot Data & UI Project  

## 🧠 Overview  
This project is a community-driven data visualization tool for *Arc Raiders*, designed to organize and display in-game loot information such as **sell values**, **recycle values**, and **value deltas**.  
It helps players quickly evaluate which items are profitable or useful, combining data clarity with intuitive UI design.

The project bridges **data science**, **web development**, and **game-design thinking**, using AI tools as both a learning aid and a workflow accelerator.

---

## 💡 Why I Started This Project  
I was frustrated trying to determine the real value of loot items in-game. Arc Raiders’ **recycling system** lets players break down items into components, but some recycle into **secondary materials**, creating multiple hidden value layers.  

Example:  
- *Computer → Processor → Electrical Parts*  

The deeper the chain, the harder it became to judge true worth. I wanted a system that visualized these relationships clearly.  
All base data was **sourced directly from the [Arc Raiders Wiki](https://arcraiders.wiki)** to ensure accuracy.  

Encouraged by my mentor, I decided to apply the same AI-assisted approach I use for studying to an actual engineering project — building a working website powered by creativity, structure, and curiosity.

---

## 🧩 How I Built It  
- **Python (BeautifulSoup, JSON, pandas):** Parsed and cleaned wiki data into structured loot tables.  
- **HTML + JavaScript:** Created sortable tables, dynamic color coding, and rarity highlights.  
- **Vercel Hosting:** Deployed a clean, static web app with public access.  

The final structure:  
```
index.html
script.js
style.css
data/loot_table.json
assets/images/
```

---

## 🤖 AI Integration & Workflow  
- **AI-Guided Systems Design:** Used AI to plan the project architecture, debug setup issues, and understand core libraries before writing code.  
- **Vibe Coding Phase:** Employed AI as a pair-programmer to generate helper scripts that scraped and cleaned image data, standardized file names, and generated missing-image reports.  

This workflow balanced creativity and control — learning the logic while accelerating implementation.  

---

## 🚀 Future Plans  
- Add **sorting and filtering** by rarity, category, and profit margin.  
- Create a **value-hierarchy system** that factors in:
  - **Hideout Upgrades**  
  - **Wipe Tasks**  
  - **Quests and Crafting Needs**  
- Expand to include **crafting and upgrade paths**, and possibly integrate a live data backend.  

---

## 🧭 Reflection  
This project taught me how data structure, visual design, and systems thinking intersect.  
Each problem — from scraping to visualization — deepened my understanding of how engineers use both logic and iteration to make systems work.  

For extended commentary, AI methodology, and deeper reflections, see [PROJECT_NOTES.md](./PROJECT_NOTES.md).
