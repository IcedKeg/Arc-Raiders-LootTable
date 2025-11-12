# 🧾 Project Notes – Arc Raiders Loot Data & UI Project  

This file expands on the background, AI workflow, and reflections behind the main project.  
While the README introduces the system at a high level, this document captures the **engineering thought process**, **AI collaboration style**, and **lessons learned** along the way.

---

## 🤖 AI Integration & Workflow  

### 🧠 Phase 1: AI-Guided Systems Design  
Before writing any code, I used AI as a **collaborative design partner and technical sounding board**.  
This phase focused on learning and understanding the underlying systems rather than offloading tasks.  

AI was used to:
- Explain how each import (`requests`, `os`, `re`, `BeautifulSoup4`, `json`) worked in context.  
- Help structure the **pipeline** from data scraping → JSON cleaning → web presentation.  
- Validate **environment setup**, ensuring `venv`, `pip install`, and encoding settings were correctly configured.  
- Translate complex programming terminology into **plain engineering logic**, reinforcing my learning instead of shortcutting it.  

This approach helped me **think like an engineer**, making every design choice intentional.  

---

### ⚡ Phase 2: Vibe Coding Implementation  
In the final stretch, I used what I call **vibe coding** — a balance between structured engineering and creative iteration.  
Instead of perfecting code line-by-line upfront, I explored solutions quickly, then refined them using AI feedback and testing.  

During this phase, I:
- Built a **Python web-scraper** to automatically collect item images from the [Arc Raiders Wiki](https://arcraiders.wiki).  
- Cleaned and standardized **image-to-item name relationships** for consistency.  
- Created a **missing-image report** to track incomplete assets for future updates.  

This hybrid style — guided structure plus fast iteration — allowed me to maintain ownership and understanding of the project while still leveraging AI for rapid prototyping and debugging.  

---

## 💡 Data Source Integrity  
All item, value, and image data originate from the **Arc Raiders Wiki**, the commun
