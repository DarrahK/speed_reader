# Speed Reader — RSVP

**[Live Demo](https://darrahk.github.io/speed_reader/)**

A web-based speed reading app using Rapid Serial Visual Presentation (RSVP). Words are displayed one at a time with an Optimal Recognition Point (ORP) highlight, keeping your eyes fixed on a single point for faster reading.

## How It Works

Paste any text, hit Start, and words flash one at a time at your chosen speed. A key letter in each word is highlighted and pinned to a fixed position on screen — your eyes never need to move. This technique eliminates saccadic eye movements and lets you read significantly faster than normal.

## Features

- **ORP highlighting** — pivot letter highlighted in color, fixed to the same screen position for every word
- **Adjustable WPM** — 100 to 1000 words per minute, adjustable live during reading
- **Customizable colors** — background, text, and highlight colors via color pickers
- **Adjustable font size** — 24px to 72px
- **Interactive progress bar** — click or drag to scrub through the text
- **Smart timing** — punctuation and long words get a brief pause for natural pacing
- **Keyboard shortcuts** — space (play/pause), arrows (adjust WPM), R (restart), Escape (back)

## Usage

Open `index.html` in any modern browser. No build tools, no dependencies.

## Keyboard Shortcuts (Reader)

| Key | Action |
|-----|--------|
| Space | Play / Pause |
| Arrow Up / Right | Speed up (+10 WPM) |
| Arrow Down / Left | Slow down (-10 WPM) |
| R | Restart |
| Escape | Back to input |

## Tech Stack

Plain HTML, CSS, and JavaScript. No frameworks or dependencies.
