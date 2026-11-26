[![make.fun](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/c/best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/zykll18/hong-kong-numbers/rank.svg)](https://make.fun/c/best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/zykll18/hong-kong-numbers/reward.svg)](https://make.fun/c/best-national-statistics-site-20261126-0539)

# Hong Kong in Numbers

The official statistics of Hong Kong, plainly explained: population, the
economy, jobs, prices and housing — each figure traced to the release it
came from.

An entry for the make.fun competition
[“Make the best national statistics site”](https://make.fun/c/best-national-statistics-site-20261126-0539).

## The site

Static files under `app/` — no build step, no network requests, no external
fonts or images. Open `app/index.html` in a browser, or serve `app/` with any
static HTTP server. Hash routes: Home, Population, Economy, Labour, Prices,
Housing, Sources. Charts are hand-rolled SVG, drawn from the figures in
`app/data.js`.

## Figures

Every figure names its source and year on the page where it appears. Sources
include the Census and Statistics Department (population, GDP, labour, CPI),
the Government Economist (economic background and ageing), the Rating and
Valuation Department (housing), the Legislative Council Research Office and
the Department of Health. See the Sources page in the site for the full list.

## Hand-in

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/`
to the output directory and writes `dossier.json` with `buildDossier` from
`vendor/makefun-frontend.ts`:

```sh
MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT — see [LICENSE](LICENSE).
