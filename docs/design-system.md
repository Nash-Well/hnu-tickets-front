# Design system

Dense, quiet, utilitarian. Colour is reserved for meaning; spacing and type weight organise the page.

## Where tokens live

| Layer | File |
| --- | --- |
| Colour ramps | `src/app/providers/palette.ts` |
| Mantine theme: type scale, spacing, radius, shadows, component defaults | `src/app/providers/theme.ts` |
| Semantic CSS variables, light and dark | `src/app/providers/css-variables.ts` |
| Tone names and variable helpers for components | `src/shared/config/tokens.ts` |

Pages and features never reference hues directly. They use a `Tone` (`neutral`, `accent`, `positive`, `warning`, `danger`) or a semantic variable (`--app-surface-*`, `--app-border-*`, `--app-tone-*`, `--app-chart-*`).

## Colour roles

| Role | Ramp | Used for | Never used for |
| --- | --- | --- | --- |
| Neutral | `slate` / `slateDark` | Text, borders, surfaces, most badges | — |
| Accent | `petrol` | Primary buttons, active navigation, focus, links, the "in work" lifecycle phase | Decoration, icons, secondary actions |
| Positive | `positive` | The resolved state and success notifications | Anything else |
| Warning | `warning` | High severity, metrics that need the viewer's action | Decoration |
| Danger | `danger` | Critical severity, destructive actions, errors | Decoration |

## Severity scale (ticket priority)

Severity never rests on colour alone: each step also changes weight and container.

| Priority | Treatment | Weight | Chart colour |
| --- | --- | --- | --- |
| Low | Plain muted text | Regular | `--app-chart-neutral-weak` |
| Medium | Plain text | Medium | `--app-chart-neutral` |
| High | Amber outline pill | Semibold | `warning-5` |
| Critical | Filled red pill, white text | Bold | `--app-tone-danger-solid` |

## Lifecycle scale (ticket status)

Grouped by phase. The label always carries the exact status.

| Phase | Statuses | Treatment |
| --- | --- | --- |
| Waiting to start | New | Neutral outline |
| | Assigned | Neutral soft fill |
| In work | In progress | Accent soft fill |
| | Waiting for user | Accent dashed outline |
| Done | Resolved | Positive soft fill |
| Finished | Closed | Muted text |
| | Cancelled | Muted italic text |

The same maps (`statusAppearance`, `statusChartColor`, `priorityAppearance`, `priorityChartColor` in `src/entities/ticket/model/labels.ts`) drive every table, badge, chart and card.

## Surfaces

| Surface | Treatment | Used for |
| --- | --- | --- |
| Canvas | `--app-surface-canvas` | Page background and sidebar |
| Primary | White or dark-7 panel, subtle 1px border, 24px padding | Main content: tables, descriptions, conversation, charts |
| Secondary | No panel, strong top rule, muted heading | Metadata and supporting information, e.g. ticket properties |
| Elevated | Shadow `md`/`lg` | Only modals, menus, popovers |

## Typography

- UI text: Inter Variable, 14px base, 13px secondary.
- Headings and numerals: IBM Plex Sans Variable. Page title 26px, section 16px, subsection 14px, all weight 600.
- Tabular figures (`tnum`) on all tables, dates (`<time>`), metrics (`.app-numeral`) and distribution counts (`.app-tabular`).
- Both faces cover Ukrainian Cyrillic in full, including Ґ Є І Ї.

## Charts

- One series colour (`--app-chart-series`), token grid and axis text.
- Zero-value categories and specialists are hidden and summarised in a footnote.
- Fewer than 3 non-empty periods in the creation trend show a short text summary instead of a chart.
- An all-zero workload shows one sentence instead of empty axes.

## Contrast

All text and badge pairs meet WCAG AA (4.5:1) in both themes. The lowest pair is dark-mode danger text on dark tint at 5.06:1.
