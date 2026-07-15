# GrowGlobal Pitch Deck Website

## 🚀 About
This is the **GrowGlobal Strategies** interactive AI pitch deck — a fully static, single-page website built with vanilla HTML, CSS, and JavaScript. It is designed for enterprise sales presentations and supports sector-specific slide sequences.

## 📁 Project Structure
```
pitch-deck-website/
├── index.html        # Main HTML — all slides
├── style.css         # Glassmorphism design system
├── script.js         # Navigation, sector filters, export logic
├── images/           # Numbered slide images (1.png – 7.png)
├── netlify.toml      # Netlify deployment configuration
├── _redirects        # Netlify URL redirect rules
└── README.md         # This file
```

## 🏗️ Technology Stack
- **HTML5** – Semantic markup, accessible structure
- **CSS3** – Glassmorphism design, CSS variables, responsive grid
- **Vanilla JavaScript** – No frameworks, zero build step
- **Bootstrap Icons** – Via CDN
- **html2pdf.js** – Client-side PDF export (CDN)
- **PptxGenJS** – Client-side PPTX export (CDN)

## 🎯 Features
- **Interactive Sector Selector** – Choose between Restaurant, Real Estate, Forestry, or Jewellery ERP
- **Dynamic Navigation** – Sidebar auto-updates based on selected sector
- **PDF Export** – Download all slides as a landscape PDF
- **PPTX Export** – Download slides as a branded PowerPoint deck
- **Keyboard Navigation** – Arrow keys / PageUp / PageDown to scroll slides
- **Glassmorphism UI** – Premium backdrop-blur visual design
- **Fully Responsive** – Mobile and tablet breakpoints

## 🚀 Deploy to Netlify

### Option 1: Drag & Drop
1. Go to [app.netlify.com](https://app.netlify.com)
2. Drag the entire `pitch deck website/` folder onto the Netlify dashboard
3. Done — your site is live!

### Option 2: GitHub + Netlify CI/CD
1. Push this repository to GitHub
2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import from Git**
3. Select your GitHub repo
4. Set **Publish directory** to: `.` (or leave blank)
5. Click **Deploy Site**

### Option 3: Netlify CLI
```bash
npm install -g netlify-cli
netlify deploy --dir . --prod
```

## 🌐 Local Development
```bash
# Using Python (no install needed)
python3 -m http.server 8000

# Using Node.js
npx serve .

# Then open:
# http://localhost:8000
```

## 📄 License
© 2025 GrowGlobal Strategies. All Rights Reserved.
