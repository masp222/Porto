# WebShell Portfolio

A single-page portfolio that behaves like a retro terminal. Visitors type commands, watch ASCII banners render in real time, and pop open themed windows that showcase projects, contact info, and education highlights. Each section is rendered with custom chrome, idle animations, and accent palettes such as the Indonesian red/white treatment for the Prabowonomics research entry.

## Features

- **Interactive terminal** with a live typewriter effect, command history echoes, and animated ASCII banner redraws that keep the landing view dynamic.
- **Window compositor** that spawns photo cards, contact sheets, CV embeds, and terminal replicas with stacked shells and shimmering outputs.
- **Project lab view** that converts every project entry into a mini terminal feed, complete with icon-tagged links, modal galleries, rich descriptions, and structured tech stacks.
- **Accent system** (`accent-teal`, `accent-amber`, `accent-violet`, `accent-forensic`, `accent-education`, `accent-indonesia`) so research entries can inherit nation-themed palettes across chrome, text, and modal buttons.
- **Embedded CV** that streams straight from Google Drive plus static contact routes for email, phone, LinkedIn, GitHub, and Linktree.
- **Idle ASCII FX** (cursor wander, ember sparks, shimmer flickers) to make every terminal pane feel alive even when no commands are running.

## Commands exposed inside the terminal

| Command | Description |
| --- | --- |
| `help` | Reprints the list of available commands. |
| `about` | Opens the portrait, contact list, and profile shell windows. |
| `projects` | Launches the project terminal stack plus modal triggers. |
| `cv` | Loads the embedded Drive preview with a fallback link. |
| `education` | Streams the ASCII banner for the education window plus coursework lines. |
| `banner` | Forces an immediate ASCII banner repaint. |
| `clear` | Clears the terminal output and closes any open windows. |

## Tech stack

- Vite + TypeScript (vanilla template) for bundling.
- Hand-tuned CSS for terminal visuals, accent gradients, and modal layouts.
- Lightweight SVG + emoji glyphs for project link badges.
- No runtime frameworks; every interaction is vanilla DOM logic in [src/main.ts](src/main.ts).

## Getting started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the dev server**

   ```bash
   npm run dev
   ```

   Vite prints a localhost URL; open it in your browser to interact with the terminal.

3. **Create a production build** (already validated via `npm run build`).

   ```bash
   npm run build
   ```

4. **Preview the production bundle**

   ```bash
   npm run preview
   ```

## Customization notes

- **Project entries** live inside the `projectEntries` array in [src/commands.ts](src/commands.ts). Each entry controls the terminal preview, modal copy, galleries, and link badges.
- **Accent palettes** are defined in [src/layout.css](src/layout.css). Add a new `.accent-yourtheme` block plus optional `.mini-line` overrides to propagate colors across titles, body text, stacks, and modal buttons.
- **ASCII assets** such as `banner.txt`, `edubanner.txt`, and `projects/defakenet/projbanner.txt` are imported with Vite's `?raw` loader, so dropping a new `.txt` file alongside the TypeScript import is enough to ship fresh art.
- **Contact information** for the `about` command is stored in `windowBlueprints` to keep the logic declarative.

## Troubleshooting

- If VS Code tasks fail with an execution-policy error, use the `npm: build` task that shells through `cmd /c npm run build` (predefined under `.vscode/tasks.json`).
- When editing ASCII text files, stick to ASCII characters so the jitter and shimmer logic stays consistent.

Happy hacking!
