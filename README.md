# Ice the year

**Cold quotes. Sharp memory.**

Ice the year ist ein interaktives Memory-Spiel für echte Formel-1-Fans und Expert: innen. Im Zentrum stehen legendäre Zitate von Kimi Räikkönen, die über eine API geladen und im Spiel mit dem passenden Jahr kombiniert werden müssen. Ziel ist es, alle Kartenpaare mit möglichst wenigen Klicks zu finden und dadurch im Leaderboard möglichst weit vorne zu landen.

---

## Team

- Tim Stauffer
- Severin Trösch

---

## Projektidee

Kimi Räikkönen ist in der Formel 1 nicht nur für seine sportlichen Leistungen bekannt, sondern auch für seine trockenen, direkten und oft ikonischen Funksprüche. Genau diese Zitate bilden die Grundlage für unser Projekt.

Die Website verbindet ein klassisches Memory-Spiel mit dynamisch geladenen API-Daten. Die User sehen verdeckte Karten und müssen jeweils ein Kimi-Zitat mit dem dazugehörigen Jahr verbinden.

---

## Zielgruppe

Die Website richtet sich an:

- sehr interessierte Formel-1-Fans
- Kimi-Räikkönen-Fans
- langjährige Formel-1-Zuschauer:innen

Da die Zuordnung von Zitaten zu Jahren anspruchsvoll ist, richtet sich das Spiel bewusst an User mit Vorwissen oder grossem Interesse an der Formel 1.

---

## Verwendete API

Verwendet wurde die **Kimi Quotes API**:

```txt
https://kimiquotes.pages.dev/api/quote
```

Im Projekt wird die API über eine PHP-CORS-Bridge angesprochen:

```js
const API_URL = "./js/api_cors_bridge.php";
```

Die geladenen Daten werden in JavaScript verarbeitet. Für das Memory-Spiel werden nur Datensätze verwendet, die ein Jahr enthalten und deren Zitatlänge für die Kartenansicht geeignet ist. Aus diesen Daten werden anschliessend Kartenpaare generiert: eine Karte mit dem Zitat und eine Karte mit dem dazugehörigen Jahr.

Falls die API nicht geladen werden kann, nutzt das Projekt vorbereitete Fallback-Daten. Dadurch bleibt das Spiel auch bei API-Problemen spielbar.

---

## User Flow

1. Die Website wird geöffnet.
2. Ein Lottie-Overlay mit dem Button **Start Race** erscheint.
3. Nach dem Start wird das Memory-Spielfeld freigegeben.
4. Die User klicken Karten an und suchen passende Paare aus Kimi-Zitat und Jahr.
5. Jeder Klick auf eine Memorykarte wird gezählt.
6. Das Leaderboard aktualisiert sich dynamisch anhand der Klickzahl.
7. Wenn alle Paare gefunden wurden, erscheint die finale Platzierung.
8. Wird das Klicklimit von 93 Klicks überschritten, wird der User als **OUT** gewertet.
9. Über die Lottie-Restart-Animation kann eine neue Runde gestartet werden.

---

## Features

### API-basierte Memory-Karten

Die Karteninhalte werden dynamisch aus API-Daten erzeugt. Die Daten werden gefiltert, gemischt und als Kartenpaare ins DOM eingefügt.

### Dynamisches Leaderboard

Das Leaderboard reagiert auf die Anzahl Klicks. Die Position des Users verändert sich während des Spiels. Dadurch entsteht ein kompetitiver Spielcharakter. Weiter ähnelt es stark dem originalen F1-Leaderboard. Die Animation des Positionen-Wechsels ist allen F1-Fans bekannt.

### Spielanleitung als Overlay

Die Spielanleitung kann über einen Button geöffnet werden. Sie erscheint als Overlay direkt über dem Spielfeld und erklärt sowohl das Spielprinzip als auch den Bezug zu Kimi Räikkönen.

### Lottie-Animationen

Lottie wird für den Start- und Restart-Zustand eingesetzt. Die Animationen dienen nicht nur als Dekoration, sondern strukturieren die Spielzustände:

- Start des Spiels
- Ende des Spiels
- Restart einer neuen Runde
- Anzeige von Rang oder OUT-Zustand

### Responsive Design

Die Website wurde desktop-first entwickelt und anschliessend für Mobile angepasst. Auf Desktop stehen Memory und Leaderboard nebeneinander. Auf Mobile werden die Elemente untereinander dargestellt und auf eine kompakte Breite optimiert. Da das Spiel in Desktop relativ breit erscheint, liegt der Breakpoint bereits bei 1200px.

---

## Technologien

- HTML
- CSS
- JavaScript
- Fetch API
- JSON
- PHP-CORS-Bridge
- Lottie-Web
- Figma
- Git & GitHub
- Hosting / SFTP

---

## Projektstruktur

```txt
Ice-the-year/
├── .gitattributes
├── .gitignore
├── index.html
├── README.md
├── css/
│   └── style.css
├── js/
│   ├── script.js
│   └── api_cors_bridge.php
├── animations/
│   ├── start_race.json
│   └── restart_race.json
├── fonts/
│   ├── Akshar-VariableFont_wght.ttf
│   └── Audiowide-Regular.ttf
└── .vscode/
    └── sftp.json
```

---

## Code-Struktur

### `index.html`

Die HTML-Datei enthält die semantische Grundstruktur der Website:

- Header mit Titel und Untertitel
- Hauptbereich mit Memory-Spielfeld
- Spielanleitung
- Leaderboard
- Lottie-Overlay
- Footer
- Einbindung von CSS, Lottie-Web und JavaScript

### `css/style.css`

Die CSS-Datei definiert das komplette visuelle Erscheinungsbild:

- globale Variablen für Farben, Fonts und Layoutgrössen
- Desktop-Layout mit Grid
- Memory-Karten und Flip-Animation
- Leaderboard-Gestaltung
- Spielanleitung als Overlay
- Lottie-Overlay
- Mobile-Version über Media Query

### `js/script.js`

Die JavaScript-Datei enthält die Spiellogik:

- API-Daten laden
- Daten filtern und in Kartenpaare umwandeln
- Memory-Karten dynamisch erzeugen
- Klicks zählen
- Kartenpaare prüfen
- Leaderboard sortieren und aktualisieren
- Spielende erkennen
- Start- und Restart-Zustände steuern
- Lottie-Animationen laden und abspielen

---

## Datenverarbeitung

Die API-Daten werden nicht direkt 1:1 angezeigt, sondern für das Spiel verarbeitet:

1. API-Daten werden mit `fetch()` geladen.
2. Datensätze ohne Jahr werden entfernt.
3. Zu lange Zitate werden ausgeschlossen, damit die Karten lesbar bleiben.
4. Die Zitate werden gemischt.
5. Es werden acht eindeutige Jahre ausgewählt.
6. Pro Datensatz werden zwei Karten erstellt: Jahr und Zitat.
7. Die Karten werden erneut gemischt und dynamisch ins DOM eingefügt.

Dadurch entsteht bei jeder Runde ein spielbarer, dynamischer Datensatz.

---

## UX & Gestaltung

Das visuelle Konzept orientiert sich an der Formel 1 und an Kimi Räikkönens Spitznamen **The Iceman**.

Gestalterische Entscheidungen:

- dunkler Hintergrund für einen starken Kontrast
- hellblauer Akzent als Referenz auf Eis / Iceman
- schwarz-weisses Kartenmuster als Anlehnung an Rennflaggen
- grosses Leaderboard als Motorsport-Element
- klare Typografie mit technisch-sportlichem Charakter und F1-Font-nah.
- reduzierte Oberfläche mit Fokus auf Spiel und Rangliste

Die Animationen unterstützen die User Experience, weil sie Start, Fortschritt und Spielende klar voneinander trennen.

---

## Responsiveness

Die Website hat zwei zentrale Layout-Zustände:

### Desktop

- Memory-Spielfeld links
- Leaderboard rechts
- grosse Karten
- grosses Leaderboard
- Spielanleitung als Overlay über dem Spielfeld

### Mobile

- optimiert für eine kompakte Breite
- Memory und Leaderboard untereinander
- kleinere Kartenabstände
- angepasste Schriftgrössen
- mobile Spielanleitung weiterhin über dem Spielfeld

---

## Herausforderungen

### API-Daten passend für ein Memory-Spiel machen

Nicht jeder API-Datensatz eignet sich direkt für das Spiel. Deshalb mussten die Daten gefiltert und in eine eigene Kartenstruktur übersetzt werden.

### Lesbarkeit der Zitate

Da Memory-Karten wenig Platz bieten, mussten sehr lange Zitate ausgeschlossen und die Schriftgrössen responsiv angepasst werden.

### Spielzustände steuern

Das Spiel braucht mehrere Zustände: Startscreen, aktives Spiel, gesperrtes Spielfeld während Animationen, Spielende, OUT-Zustand und Restart.

### Responsives Layout

Das Desktop-Layout mit Memory und Leaderboard nebeneinander musste für Mobile so umgebaut werden, dass das Spiel weiterhin gut bedienbar bleibt.

---

## Links

- Live Website: `txt https://im2.bavuwore.myhostpoint.ch/`
- GitHub Repository: `txt https://github.com/timstauffer-git/IM2-Projekt`
- Figma-Prototyp: `txt https://www.figma.com/design/XPvdyjOfTZJLcuAHlgKZp0/IM-2-%E2%80%93-Konzeption-Abgabefile?node-id=971-254&t=FTSeq2T5hqYYk711-1s`
