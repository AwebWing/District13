# WARZONE PLATFORMER - Game Landing Page

A stunning, production-grade landing page for a 2D action platformer game built with C and raylib.

## Stack

- **React** (Vite)
- **Tailwind CSS** (layout and utilities)
- **Framer Motion** (animations and scroll effects)
- **Three.js** via @react-three/fiber + @react-three/drei (3D hero background)
- **React Intersection Observer** (scroll-triggered reveals)
- **Lucide React** (icons)
- **Google Fonts**: Bebas Neue (headings) + Rajdhani (body)

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deployment

### GitHub Pages
```bash
npm run build
# Push dist/ to gh-pages branch
git push origin main:gh-pages
```

### Netlify
1. Run `npm run build`
2. Drag and drop the `dist/` folder at [netlify.com](https://netlify.com)

### Vercel
```bash
vercel deploy
```

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx       # Fixed nav with scroll effects
│   ├── Hero.jsx         # Three.js canvas + title overlay
│   ├── Features.jsx     # 2x2 feature cards
│   ├── Gameplay.jsx     # Two level showcase
│   ├── Download.jsx     # Terminal + download button
│   ├── Leaderboard.jsx  # Scoreboard table
│   └── Footer.jsx       # Minimal footer
├── App.jsx              # Main app with cursor + loader
├── main.jsx             # Entry point
└── index.css            # Global styles + CSS variables
```

## Color Palette

| Variable    | Value     | Usage              |
|-------------|-----------|--------------------|
| --bg        | #080808   | Background         |
| --surface   | #111111   | Card backgrounds   |
| --red       | #e81c1c   | Primary accent     |
| --red-glow  | #ff3333   | Glow effects       |
| --white     | #f2ede8   | Text (warm off-white) |
| --gray      | #2a2a2a   | Borders, dividers  |
| --gold      | #c9922a   | Leaderboard accent |

## Typography

- **Headings**: Bebas Neue - massive, tracked, aggressive
- **Body**: Rajdhani - clean, technical, condensed
- **Code**: JetBrains Mono

## Features

- Custom cursor with lag effect
- Film grain overlay
- Scroll progress bar
- Page load split animation
- Three.js floating shards in hero
- Scroll-triggered reveal animations
- Mobile responsive navigation

---

**Built with C · raylib · Ubuntu**
