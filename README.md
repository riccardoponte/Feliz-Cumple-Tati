🌐 **Lingua / Language:** [🇮🇹 Italiano](#italiano) · [🇬🇧 English](#english)

---

<a id="italiano"></a>

# 🎁 Feliz Cumple Tati

Web app/PWA personale di compleanno per Tati. Stile retrò–polaroid, sezioni interattive (album, mappa, musica, mini-Netflix, paperelle).

> ✨ **Tutto il codice è in un unico file**: [index.html](index.html). HTML + CSS + JavaScript convivono dentro le sue ~9000 righe. Per modificare qualsiasi cosa (testi, film, posti, foto…) basta aprire quel file.

---

## 📂 Struttura del progetto

```
Feliz-Cumple-Tati-main/
├── index.html              ← TUTTA l'app (HTML + CSS + JS)
├── manifest.json           ← Configurazione PWA (nome, colori, icone)
├── sw.js                   ← Service Worker (funzionamento offline)
├── README.md               ← Questo file
├── .github/workflows/
│   └── static.yml          ← Deploy automatico su GitHub Pages
└── assets/
    ├── icon-192.png / icon-512.png   ← icone PWA
    ├── welcome.jpg                   ← immagine schermata iniziale
    ├── album/lei/                    ← foto solo di lei (1.jpg, 2.jpg, …)
    ├── album/noi/                    ← foto di voi due (1.jpg, 2.jpg, …)
    ├── cinema/poster/                ← copertine film TATIFLIX (id.jpg)
    ├── musica/                       ← MP3 della playlist
    ├── papere/                       ← 6 paperelle illustrazioni
    ├── posti/                        ← foto dei luoghi sulla mappa
    ├── profilo/                      ← foto del feed "profilo"
    └── TATIFLIX-README.md            ← guida estesa alla sezione cinema
```

---

## 🚀 Come lanciare l'app

### In locale
Apri `index.html` con il browser. Per il pieno funzionamento PWA serve un server: il modo più rapido è la **Live Server** extension di VS Code (tasto destro sul file → "Open with Live Server").

### Online (GitHub Pages)
Il workflow in `.github/workflows/static.yml` pubblica automaticamente l'app ad ogni `git push` sul branch principale. L'URL sarà del tipo `https://<tuo-utente>.github.io/Feliz-Cumple-Tati/`.

### Forzare l'aggiornamento dopo una modifica
Quando cambi qualcosa, ricarica con **Ctrl+Shift+R** (Windows) o **Cmd+Shift+R** (Mac): forza il service worker a rileggere i file.

---

## ✏️ Come aggiungere cose — guida sezione per sezione

> 💡 **Tutte le modifiche si fanno in `index.html`**. Usa `Ctrl+F` per cercare le parole chiave indicate qui sotto.

### 🎬 1) Aggiungere un FILM (TATIFLIX)

**Step 1 — Poster**: salva l'immagine in `assets/cinema/poster/<id>.jpg`. Il nome deve essere identico all'`id` che userai (lettere minuscole, trattini).
Fonte consigliata: [themoviedb.org](https://www.themoviedb.org).

**Step 2 — Catalogo**: in `index.html` cerca `const tatiflixCatalog`. Aggiungi una riga prima di `]`, mettendo la virgola dopo l'entry precedente:

```js
            { id: 'inside-out', type: 'film', titolo: 'Inside Out', anno: 2015, generi: ['Animazione', 'Famiglia'], durata: '1h 35min', regista: 'Pete Docter', cast: ['Amy Poehler'], trama: "Le 5 emozioni di Riley alle prese con un trasloco.", ricordo: "Vista quella sera di pioggia.", categoria: ['insieme', 'preferito-tati'], rating: 8.5, videoUrl: 'https://drive.google.com/file/d/ID_QUI/view?usp=sharing' }
```

**Campi disponibili**:

| Campo | Obblig. | Note |
|---|---|---|
| `id` | ✅ | Univoco, identico al nome del poster |
| `type` | ✅ | Sempre `'film'` |
| `titolo` `anno` `generi` `durata` `regista` `cast` | ✅ | Vedi modello |
| `trama` | ✅ | Stringa breve |
| `ricordo` | ✅ | Frase personale che appare nel dettaglio |
| `categoria` | ✅ | Array. Valori: `'insieme'`, `'preferito-tati'` |
| `rating` | ✅ | 0–10 con decimale (`8.5`) |
| `videoUrl` | facolt. | URL Drive/Dropbox/R2 al file video |
| `driveId` | facolt. | Solo ID Drive (alternativa a `videoUrl`) |
| `top` | facolt. | 1–10 → entra nella riga "🔥 Top 10" |
| `hero` | facolt. | `true` solo su UN film → diventa il banner gigante |

**Per il video (Google Drive)**: file su Drive → tasto destro → Condividi → "Chiunque abbia il link" → Visualizzatore → copi il link → incollalo in `videoUrl`.

📘 Approfondimento completo: [assets/TATIFLIX-README.md](assets/TATIFLIX-README.md).

---

### 📍 2) Aggiungere un POSTO (mappa)

In `index.html` cerca `const posti = [`. Aggiungi un'entry prima di `];`:

```js
            {
                id: 'caraibi', numero: 15, titolo: 'Punta Cana', dove: 'Repubblica Dominicana',
                coord: [18.5601, -68.3725], emoji: '🌴', categoria: 'mare',
                foto: 'assets/posti/15.jpg',
                frase: 'Spiagge bianche e cocktail al tramonto.',
                songUrl: 'assets/musica/cafe_con_ron.mp3'
            },
```

**Campi**:

| Campo | Cosa metterci |
|---|---|
| `id` | Univoco (lettere/trattini) |
| `numero` | Numero progressivo, ordina il pin sulla mappa |
| `titolo` `dove` | Mostrati nella scheda |
| `coord` | `[latitudine, longitudine]` — prendile da [Google Maps](https://maps.google.com) (tasto destro su un punto → clic sulle coordinate per copiarle) |
| `emoji` | Una sola, appare sul pin |
| `categoria` | Filtra i pin: `'studio'`, `'sport'`, `'mare'`, `'viaggio'`, `'juve'`, `'shop'` |
| `foto` | Path a `assets/posti/<numero>.jpg` (caricalo prima) |
| `frase` | Didascalia romantica/ironica |
| `songUrl` | Canzone associata (path a un mp3 in `assets/musica/`) |

**Step extra**: carica la foto del posto in `assets/posti/<numero>.jpg`.

---

### 🎵 3) Aggiungere una CANZONE alla playlist

**Step 1**: copia il file `.mp3` in `assets/musica/`. Nome semplice (no spazi, no caratteri strani): es. `nuova_canzone.mp3`.

**Step 2**: in `index.html` cerca `const songs = [`. Aggiungi:

```js
            {
                title: "Nome canzone",
                artist: "Nome artista",
                url: "assets/musica/nuova_canzone.mp3",
                img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300",
                mood: "Festa",
                explanation: "Perché è speciale per noi."
            },
```

**Campi**:

| Campo | Note |
|---|---|
| `title` `artist` | Stringa libera |
| `url` | Path locale all'mp3 |
| `img` | URL immagine cover (può essere link esterno o asset locale) |
| `mood` | Categoria per filtrare: `"Festa"`, `"Chill"`, `"Romantica"`, ecc. — riusa quelli esistenti per coerenza |
| `explanation` | Riga di commento personale |

---

### 📷 4) Aggiungere FOTO all'ALBUM

L'album ha **due gallerie**: "noi" e "lei".

**Step 1**: copia le foto in:
- `assets/album/noi/` per le foto di voi due
- `assets/album/lei/` per le foto solo di lei

Usa nomi numerici progressivi: `23.jpg`, `24.jpeg`, `25.png`…

**Step 2**: in `index.html` cerca `const noiFiles = [` (per "noi") oppure `const leiFiles = [` (per "lei"). Aggiungi i nomi file all'array:

```js
const noiFiles = ['1.jpg', ..., '22.jpeg', '23.jpg', '24.jpeg'];
```

⚠️ Mantieni l'estensione corretta (`.jpg`, `.jpeg`, `.png`) e l'ordine numerico.

---

### 🦆 5) Aggiungere una PAPERA

**Step 1**: copia il PNG in `assets/papere/` con il prossimo numero progressivo (`7.png`).

**Step 2**: in `index.html` cerca `assets/papere/1.png`. Vedrai 6 blocchi HTML identici (uno per ogni papera). Duplicane uno e incrementa il numero:

```html
<div class="duck-card" onclick="openPhoto('assets/papere/7.png', 'Papera 7')">
    <img src="assets/papere/7.png" class="duck-thumb">
    <div class="duck-title">Papera 7</div>
</div>
```

(Cerca il blocco esatto adiacente per copiare lo stile vero usato nel file.)

**Step 3** (opzionale): cerca anche `{ src: 'assets/papere/1.png'` — c'è un secondo elenco usato dalla galleria fotografica. Aggiungi `{ src: 'assets/papere/7.png', desc: 'Papera 7' }`.

---

### 👤 6) Aggiungere foto al PROFILO (feed stile Instagram)

**Step 1**: copia la foto in `assets/profilo/` come `12.jpg` (prossimo numero).

**Step 2**: in `index.html` cerca `for (let i = 1; i <= 11; i++)` (dentro `renderProfileFeed`) e cambia `11` con il nuovo totale (`12`).

**Step 3**: cerca anche `assets/profilo/${i + 1}.jpg` — c'è un secondo loop simile per la galleria. Cambia il limite anche lì se necessario.

> Se aggiungi tante foto, è meglio convertire i due `for` in un unico array di file (come l'album), così aggiungi solo nomi senza toccare numeri.

---

## 🛠️ Note tecniche utili

### Service Worker
Il file `sw.js` decide cosa pre-cachare per l'uso offline. **Non cacha i video** (sarebbero troppo pesanti) né i `videoUrl` esterni. Se aggiungi una nuova sezione con asset grossi e vuoi che funzionino offline, aggiungi i path nel suo array.

### PWA Manifest
`manifest.json` definisce nome, icona e colori della "app installata". Per cambiare l'icona sostituisci `assets/icon-192.png` e `assets/icon-512.png` mantenendo le stesse dimensioni.

### Errori comuni
- **Pagina bianca** → quasi sempre virgola dimenticata o apostrofo non escapato dentro una stringa. Apri la console del browser (F12) e leggi l'errore.
- **Foto/video non appare** → controlla il nome esatto del file (maiuscole/minuscole contano, soprattutto su GitHub Pages).
- **Modifica non si vede** → service worker che serve la cache vecchia. **Ctrl+Shift+R** per forzare.

### Buone pratiche
- **Nomi file**: sempre minuscoli, niente spazi, niente accenti (`tedua_wasabi.mp3` ✅, `Tedua Wasabì.mp3` ❌).
- **Immagini**: comprimile prima di caricarle (es. con [squoosh.app](https://squoosh.app)) per non appesantire il sito.
- **Backup**: prima di una modifica grossa, fai `git commit` o copia `index.html` da qualche parte.

---

## 📞 Riferimenti rapidi

| Vuoi modificare… | Cerca in `index.html` |
|---|---|
| Catalogo film TATIFLIX | `const tatiflixCatalog` |
| Posti sulla mappa | `const posti = [` |
| Playlist musicale | `const songs = [` |
| Foto album "noi" | `const noiFiles = [` |
| Foto album "lei" | `const leiFiles = [` |
| Feed profilo | `renderProfileFeed` |
| Paperelle | `assets/papere/1.png` |
| Schermata di benvenuto | cerca `welcome.jpg` |

Buone feste a Tati 💙

---

<a id="english"></a>

# 🎁 Feliz Cumple Tati

Personal birthday web app / PWA for Tati. Retro-polaroid style, interactive sections (album, map, music, mini-Netflix, ducks).

> ✨ **All code is in a single file**: [index.html](index.html). HTML + CSS + JavaScript live together within its ~9000 lines. To edit anything (texts, movies, places, photos…) simply open that file.

---

## 📂 Project Structure

```
Feliz-Cumple-Tati-main/
├── index.html              ← ENTIRE app (HTML + CSS + JS)
├── manifest.json           ← PWA configuration (name, colors, icons)
├── sw.js                   ← Service Worker (offline functionality)
├── README.md               ← This file
├── .github/workflows/
│   └── static.yml          ← Automatic deployment to GitHub Pages
└── assets/
    ├── icon-192.png / icon-512.png   ← PWA icons
    ├── welcome.jpg                   ← welcome screen image
    ├── album/lei/                    ← photos of her alone (1.jpg, 2.jpg, …)
    ├── album/noi/                    ← photos of the two of you (1.jpg, 2.jpg, …)
    ├── cinema/poster/                ← TATIFLIX movie posters (id.jpg)
    ├── musica/                       ← playlist MP3s
    ├── papere/                       ← 6 duck illustrations
    ├── posti/                        ← photos of places on the map
    ├── profilo/                      ← "profile" feed photos
    └── TATIFLIX-README.md            ← extended cinema section guide
```

---

## 🚀 How to Run the App

### Locally
Open `index.html` with your browser. For full PWA functionality a server is required: the quickest way is the VS Code **Live Server** extension (right-click on the file → "Open with Live Server").

### Online (GitHub Pages)
The workflow in `.github/workflows/static.yml` automatically publishes the app on every `git push` to the main branch. The URL will be formatted as `https://<your-username>.github.io/Feliz-Cumple-Tati/`.

### Forcing updates after a change
When you change something, reload with **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac): this forces the service worker to re-fetch the files.

---

## ✏️ How to Add Content — Section-by-Section Guide

> 💡 **All changes are made in `index.html`**. Use `Ctrl+F` to search for the keywords listed below.

### 🎬 1) Adding a MOVIE (TATIFLIX)

**Step 1 — Poster**: save the image to `assets/cinema/poster/<id>.jpg`. The filename must match the `id` you will use exactly (lowercase letters, hyphens).
Recommended source: [themoviedb.org](https://www.themoviedb.org).

**Step 2 — Catalog**: in `index.html`, search for `const tatiflixCatalog`. Add a line before `]`, placing a comma after the preceding entry:

```js
            { id: 'inside-out', type: 'film', titolo: 'Inside Out', anno: 2015, generi: ['Animazione', 'Famiglia'], durata: '1h 35min', regista: 'Pete Docter', cast: ['Amy Poehler'], trama: "Le 5 emozioni di Riley alle prese con un trasloco.", ricordo: "Vista quella sera di pioggia.", categoria: ['insieme', 'preferito-tati'], rating: 8.5, videoUrl: 'https://drive.google.com/file/d/ID_QUI/view?usp=sharing' }
```

**Available fields**:

| Field | Req. | Notes |
|---|---|---|
| `id` | ✅ | Unique, identical to poster filename |
| `type` | ✅ | Always `'film'` |
| `titolo` `anno` `generi` `durata` `regista` `cast` | ✅ | See template |
| `trama` | ✅ | Short synopsis |
| `ricordo` | ✅ | Personal memory/sentence shown in details |
| `categoria` | ✅ | Array. Values: `'insieme'`, `'preferito-tati'` |
| `rating` | ✅ | 0–10 with decimal (`8.5`) |
| `videoUrl` | opt. | Drive/Dropbox/R2 URL to video file |
| `driveId` | opt. | Drive ID only (alternative to `videoUrl`) |
| `top` | opt. | 1–10 → enters the "🔥 Top 10" row |
| `hero` | opt. | `true` on only ONE movie → becomes the giant banner |

**For video (Google Drive)**: file on Drive → right-click → Share → "Anyone with the link" → Viewer → copy link → paste into `videoUrl`.

📘 Complete in-depth guide: [assets/TATIFLIX-README.md](assets/TATIFLIX-README.md).

---

### 📍 2) Adding a PLACE (map)

In `index.html`, search for `const posti = [`. Add an entry before `];`:

```js
            {
                id: 'caraibi', numero: 15, titolo: 'Punta Cana', dove: 'Repubblica Dominicana',
                coord: [18.5601, -68.3725], emoji: '🌴', categoria: 'mare',
                foto: 'assets/posti/15.jpg',
                frase: 'Spiagge bianche e cocktail al tramonto.',
                songUrl: 'assets/musica/cafe_con_ron.mp3'
            },
```

**Fields**:

| Field | What to put |
|---|---|
| `id` | Unique (letters/hyphens) |
| `numero` | Progressive number, orders pin on map |
| `titolo` `dove` | Displayed on the card |
| `coord` | `[latitude, longitude]` — get them from [Google Maps](https://maps.google.com) (right-click on a point → click coordinates to copy) |
| `emoji` | A single emoji, displayed on the pin |
| `categoria` | Filter pins: `'studio'`, `'sport'`, `'mare'`, `'viaggio'`, `'juve'`, `'shop'` |
| `foto` | Path to `assets/posti/<numero>.jpg` (upload it first) |
| `frase` | Romantic/funny caption |
| `songUrl` | Associated song (path to an mp3 in `assets/musica/`) |

**Extra step**: upload the place photo to `assets/posti/<numero>.jpg`.

---

### 🎵 3) Adding a SONG to the playlist

**Step 1**: copy the `.mp3` file to `assets/musica/`. Use a simple filename (no spaces, no special characters): e.g. `nuova_canzone.mp3`.

**Step 2**: in `index.html`, search for `const songs = [`. Add:

```js
            {
                title: "Nome canzone",
                artist: "Nome artista",
                url: "assets/musica/nuova_canzone.mp3",
                img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300",
                mood: "Festa",
                explanation: "Perché è speciale per noi."
            },
```

**Fields**:

| Field | Notes |
|---|---|
| `title` `artist` | Free string |
| `url` | Local path to the mp3 |
| `img` | Cover image URL (can be external link or local asset) |
| `mood` | Category for filtering: `"Festa"`, `"Chill"`, `"Romantica"`, etc. — reuse existing ones for consistency |
| `explanation` | Personal comment line |

---

### 📷 4) Adding PHOTOS to the ALBUM

The album has **two galleries**: "noi" (us) and "lei" (her).

**Step 1**: copy photos to:
- `assets/album/noi/` for photos of the two of you
- `assets/album/lei/` for photos of her alone

Use progressive numeric filenames: `23.jpg`, `24.jpeg`, `25.png`…

**Step 2**: in `index.html`, search for `const noiFiles = [` (for "noi") or `const leiFiles = [` (for "lei"). Add filenames to the array:

```js
const noiFiles = ['1.jpg', ..., '22.jpeg', '23.jpg', '24.jpeg'];
```

⚠️ Keep the correct file extension (`.jpg`, `.jpeg`, `.png`) and numeric order.

---

### 🦆 5) Adding a DUCK

**Step 1**: copy the PNG into `assets/papere/` with the next progressive number (`7.png`).

**Step 2**: in `index.html`, search for `assets/papere/1.png`. You will see 6 identical HTML blocks (one for each duck). Duplicate one and increment the number:

```html
<div class="duck-card" onclick="openPhoto('assets/papere/7.png', 'Papera 7')">
    <img src="assets/papere/7.png" class="duck-thumb">
    <div class="duck-title">Papera 7</div>
</div>
```

(Check the adjacent exact block to copy the real style used in the file.)

**Step 3** (optional): also search for `{ src: 'assets/papere/1.png'` — there is a second list used by the photo gallery. Add `{ src: 'assets/papere/7.png', desc: 'Papera 7' }`.

---

### 👤 6) Adding photos to the PROFILE (Instagram-style feed)

**Step 1**: copy the photo to `assets/profilo/` as `12.jpg` (next number).

**Step 2**: in `index.html`, search for `for (let i = 1; i <= 11; i++)` (inside `renderProfileFeed`) and change `11` to the new total (`12`).

**Step 3**: also search for `assets/profilo/${i + 1}.jpg` — there is a second similar loop for the gallery. Change the limit there as well if necessary.

> If you add many photos, it is better to convert the two `for` loops into a single file array (like the album), so you only add filenames without touching numbers.

---

## 🛠️ Useful Technical Notes

### Service Worker
The file `sw.js` determines what to pre-cache for offline use. **It does not cache videos** (they would be too heavy) nor external `videoUrl`s. If you add a new section with large assets and want them to work offline, add their paths to its array.

### PWA Manifest
`manifest.json` defines the name, icon, and colors of the "installed app". To change the icon, replace `assets/icon-192.png` and `assets/icon-512.png` while keeping the same dimensions.

### Common Errors
- **Blank page** → almost always a missing comma or an unescaped apostrophe inside a string. Open browser console (F12) and inspect the error.
- **Photo/video not showing** → check the exact filename (case-sensitivity matters, especially on GitHub Pages).
- **Changes not visible** → service worker serving the old cache. **Ctrl+Shift+R** to force reload.

### Best Practices
- **Filenames**: always lowercase, no spaces, no accents (`tedua_wasabi.mp3` ✅, `Tedua Wasabì.mp3` ❌).
- **Images**: compress them before uploading (e.g. with [squoosh.app](https://squoosh.app)) to keep the site lightweight.
- **Backup**: before making a large change, run `git commit` or make a copy of `index.html`.

---

## 📞 Quick Reference

| Want to edit… | Search in `index.html` |
|---|---|
| TATIFLIX movie catalog | `const tatiflixCatalog` |
| Places on map | `const posti = [` |
| Music playlist | `const songs = [` |
| Album photos "noi" | `const noiFiles = [` |
| Album photos "lei" | `const leiFiles = [` |
| Profile feed | `renderProfileFeed` |
| Ducks | `assets/papere/1.png` |
| Welcome screen | search `welcome.jpg` |

Happy Birthday to Tati 💙
