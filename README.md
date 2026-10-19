# From Impression to Abstraction — a 3D virtual museum

A walkable 3D museum of modern painting, from Manet and the Impressionists to Cubism and the first abstract paintings (about 1860–1930). It runs in any modern browser, on a computer or a phone.

The visit is organised around one question: **how does one movement become another?**

- **One room per artist** (20 artists), each with its own wall colour, floor, lighting and objects: Monet's water-lily pond, Cézanne's apples next to a cylinder, a sphere and a cone, Van Gogh's chair and sunflowers, Kandinsky's floating shapes, Malevich's floating squares, and more.
- **Paintings hang in chronological order**: numbered labels, alternating left and right as you walk forward.
- **Doors show how art changed**:
  - doors **behind you** (the entrance wall) lead to the artist's **roots**;
  - doors **ahead** lead to the painters who **followed**;
  - **side doors** in the middle of the long walls lead to **contemporaries** of the same period and movement.

  Every door has a sign. Tap or click it to read how the two artists are connected before you go through.
- **Series wings**: notable series have their own wing off the artist's room — Monet's *Haystacks*, *Rouen Cathedral*, *Japanese Bridge* and *Water Lilies*, Cézanne's *Mont Sainte-Victoire* and *Card Players*, Pissarro's *Boulevard Montmartre*, Van Gogh's *Sunflowers*. In the main room, the series takes the place of its first painting as a doorway, with that painting visible at the end of the passage. Inside, the canvases hang in order, with a wall text on the series and on how to compare the canvases.
- **Wall texts** explain each artist's sources, where their movement came from and what it became.
- **Timeline** (button or `T`): movements as lanes, artists as bars, influences as arrows. Tap an artist to see roots, legacy and contemporaries, then jump straight to their room.
- **Painting viewer**: click or tap any painting to see it large, with its date, collection, a short explanation, and the image's source and licence on Wikimedia Commons.

## Artists

| Movement | Artists |
| --- | --- |
| Realism / roots | Édouard Manet |
| Impressionism | Claude Monet, Pierre-Auguste Renoir, Edgar Degas, Camille Pissarro, Berthe Morisot |
| Neo-Impressionism | Georges Seurat, Paul Signac |
| Post-Impressionism | Paul Cézanne, Vincent van Gogh, Paul Gauguin |
| Symbolism & Expressionism | Edvard Munch, Franz Marc |
| Fauvism | Henri Matisse, André Derain |
| Cubism & Orphism | Juan Gris, Robert Delaunay |
| Abstraction | Wassily Kandinsky, Piet Mondrian, Kazimir Malevich |

Picasso and Braque are mentioned in the texts, but their paintings are still under copyright and have no free images, so none are shown.

## Images: free Wikimedia Commons files only

Every painting is checked against the [Wikimedia Commons](https://commons.wikimedia.org) API before it is shown. Commons only hosts public-domain and freely licensed files. A painting is shown if one of these checks succeeds:

1. one of the exact Commons file names listed in `js/data/artists.js` exists;
2. or the lead image of its English Wikipedia article is a free file hosted on Commons;
3. or a Commons search finds a file whose name matches strict patterns. Details, studies, copies and gallery photos are rejected.

**A painting that cannot be confirmed is left out entirely**: it gets no frame, no label and no mention. The source page and licence of each image appear in the viewer.

The check runs in one of two places:

- **at build time** (recommended): `npm run verify-images` writes the confirmed list to `data/images.json`, and the GitHub Pages workflow does this on every deploy;
- **in the browser**: if `data/images.json` doesn't list a painting, the page asks Commons directly and caches the answer for 14 days.

## Running it

It is a static site with no build step. Three.js is vendored in `vendor/`.

```bash
npm start                 # serves the folder on http://localhost:8080
npm test                  # data checks + resolver tests (no network needed)
npm run verify-images     # check every painting on Commons, write data/images.json
```

Opening `index.html` straight from disk won't work, because ES modules need a web server.

Useful URL options:

- `#monet`, `#cezanne`… opens directly in an artist's room;
- `?placeholders=1` is developer mode: it draws labelled placeholders instead of loading images, to work on the 3D layout offline.

### Publishing on GitHub Pages

The workflow `.github/workflows/pages.yml` publishes the site whenever `main` changes. Enable it once: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Controls

| | Computer | Phone / tablet |
| --- | --- | --- |
| Look around | drag with the mouse | drag with a finger |
| Walk | `W A S D` or arrow keys (`Shift` = faster), or click the floor | joystick (bottom left), or tap the floor |
| Look at a painting | click it | tap it |
| See where a door leads | click the door or its sign | tap it |
| Timeline / room info | `T` / `I` | buttons at the top |

## Project structure

```
index.html              page shell and overlays
css/style.css           interface styles
js/main.js              app: renderer, room changes, picking, UI wiring
js/images.js            Wikimedia Commons resolver (browser + Node)
js/data/artists.js      artists, paintings (chronological), influences, contemporaries
js/data/movements.js    movements: where each came from, what it became
js/museum/room.js       builds a room: walls, doors, paintings, lights, wall texts
js/museum/props.js      the objects that give each room its character
js/museum/textures.js   procedural floors, walls, labels and signs (canvas)
js/museum/controls.js   mouse / keyboard / touch controls
js/ui/                  painting viewer, timeline
scripts/verify-images.mjs  builds data/images.json
tests/                  node:test checks
```

### Adding an artist

1. Add an entry to `ARTISTS` in `js/data/artists.js`: biography, roots, room style, and paintings in chronological order, each with `files`, `article` and/or `search`.
2. To give a series its own wing, add it to the artist's `series` list (title, date, `intro`, `look`, extra `works`) and mark the main painting(s) with `series: '<id>'`. A wing appears when at least two of its canvases are confirmed on Commons. `scripts/discover-series.mjs` lists candidate Commons files for a series.
3. Connect it with entries in `INFLUENCES` (`from` → `to`, with a sentence explaining the link) and, if relevant, `CONTEMPORARIES`.
4. Run `npm test` and `npm run verify-images`.
