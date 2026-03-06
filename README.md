# Aardrijkskunde Apocalyps

A geography quiz game where you blow up locations on a map. Built for Dutch elementary school homework practice (Tegel 7 & 8: Northern Europe / Scandinavia).

## Play

Visit the live version on GitHub Pages or open `index.html` locally.

## Features

- **Homework sets** matching textbook maps (Tegel 7: Noord-Europa, Tegel 8: Zweden & Finland)
- **Extra sets** (European capitals)
- **Custom set editor** with JSON import
- **Sound effects** with toggle (Web Audio API, no external files)
- **English / Dutch** language switch
- **Highscore table** per set (localStorage)
- **Massive missile explosion** when you get an answer right
- **Retry mode** — wrong answers highlight the correct location so you learn

## Map icons

Matching the textbook legend:

| Icon | Type | Description |
|------|------|-------------|
| ● | Plaats / hoofdstad | City or capital |
| ■ | Land | Country |
| ≈ | Water | Sea or ocean |
| ⚑ | Gebied | Region / area |
| ★ | Bijzonderheid | Point of interest |

## File structure

```
index.html          Main HTML
css/style.css       All styles
js/i18n.js          Dutch/English translations
js/sound.js         Sound effects (Web Audio API)
js/data.js          Location data & homework sets
js/questions.js     Question generation engine
js/particles.js     Explosion particle system
js/highscores.js    Highscore system (localStorage)
js/game.js          Core game logic & missile animation
js/editor.js        Custom set editor
js/app.js           App init, menu, screen management
```

## Tech

Pure HTML/CSS/JS, no build step. Only external dependencies:
- [Leaflet](https://leafletjs.com/) for the map
- [CARTO](https://carto.com/) dark basemap tiles
- Google Fonts (Orbitron, Share Tech Mono)
