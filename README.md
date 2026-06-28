# Compass — Where to Live & Where to Work 🧭

A personal, single-file decision app that scores **where you should live** and **where you should work**, seeded from your *own* data — not generic city rankings.

## How it was built
Five subagents ran in parallel, each mining one source and returning only **signals** (places, work clues, lifestyle), never raw private content:

| Source | What it surfaced |
|---|---|
| **Gmail** | Job-alert config, remittances, PMI PH, AI-PM cohorts, one Manila booking — no decided move |
| **Google Drive / Docs** | Goal roadmaps: BGC QA-Automation-Lead pipeline, Luzon property, Makati 2027 facility, commute planning |
| **Calendar + Slack** | UTC+8 only; Accenture deep-work blocks; weekly INC worship + family; BGC walks |
| **Photos / trips** | Beach/island pattern (Cebu, Moalboal, Zambales, **Palawan land**); Tagaytay highland; SG/Japan affinity |
| **Notes + memory** | SQE Assoc. Manager; prolific app builder; Anthropic TPM application; "open to relocation"; 2026–28 goals |

## What it does
- Ranks **8 places to live** and **6 career paths** against your priorities, with a 0–100 *fit* score each.
- Every score has a **why** tied to your real signals; tap any card for the criterion breakdown.
- **Priorities** tab: drag weights or apply presets (Stay rooted / Maximize career / Balanced / Lifestyle first) → everything re-ranks live.
- **Profile** tab shows the mined signals + an editable note to correct the data (e.g. partner's city).
- Surfaces the **open questions** the data couldn't answer.

## Run it
Open `index.html` in any browser, or:
```bash
python3 -m http.server 4321 --directory .
```
Then visit http://localhost:4321

## Privacy
100% local. State lives in `localStorage` — no server, no account. Export/reset from the **Data & method** tab.

## Reusable as a skill
The pattern is packaged as the `life-location-advisor` Claude Code skill (`~/.claude/skills/life-location-advisor`) — gather signals → synthesize profile → seed scoring model → render → verify.
