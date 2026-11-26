// Hong Kong in Numbers — page renderers.
// Each route renders from the figures in data.js; nothing is hard-coded here
// except the page furniture (headings, "explore more" links, source lists).

import { HOME_CARDS, NAV, PAGES, SITE, SOURCE_ENTRIES } from "./data.js";
import { renderChart } from "./charts.js";

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function statCard(stat, withLink) {
  const link = withLink
    ? `<a class="card-link" href="#/${stat.link}">See more &rarr;</a>`
    : "";
  return `<article class="card">
    <p class="card-label">${esc(stat.label)}</p>
    <p class="card-value">${esc(stat.value)}</p>
    <p class="card-change ${esc(stat.changeKind)}">${esc(stat.change)}</p>
    <p class="card-year">${esc(stat.year)}</p>
    <p class="card-note">${esc(stat.note)}</p>
    ${link}
    <p class="card-source">Source: ${esc(stat.source)}</p>
  </article>`;
}

function chartCard(chart, wide) {
  return `<section class="chart-card${wide ? " wide" : ""}" aria-label="${esc(chart.title)}">
    <h3>${esc(chart.title)}</h3>
    <p class="chart-sub">${esc(chart.sub)}</p>
    ${renderChart(chart)}
    <p class="chart-source">Source: ${esc(chart.source)}</p>
  </section>`;
}

function exploreLinks(current) {
  const others = NAV.filter((n) => n.route !== "" && n.route !== current);
  return `<section class="explore" aria-label="Explore more">
    <h2>Explore the numbers</h2>
    <div class="explore-links">${others
      .map((n) => `<a href="#/${n.route}">${esc(n.label)}</a>`)
      .join("")}</div>
  </section>`;
}

function renderHome() {
  const gdpChart = PAGES.economy.charts[0];
  return `<section class="hero">
    <p class="kicker">Hong Kong · Official statistics</p>
    <h1>${esc(SITE.name)}</h1>
    <p class="lede">${esc(SITE.tagline)} Population, the economy, jobs, prices and housing — each figure traced to the release it came from.</p>
    <p class="meta-line">${esc(SITE.updated)} · Source: Census and Statistics Department, HKSAR.</p>
  </section>
  <h2 class="section-title">At a glance</h2>
  <div class="cards">${HOME_CARDS.map((c) => statCard(c, true)).join("")}</div>
  <div class="chart-grid">${chartCard(gdpChart, true)}</div>
  <aside class="note">
    <p><strong>How to read this site.</strong> Big numbers are the latest published figure; the line under each one says how it moved and when it was measured. Every card names its source — usually the Census and Statistics Department — so any figure can be checked in a minute.</p>
    <p>Figures marked provisional are the first estimate and are revised in a later release; this site uses the revised figure wherever one has been published.</p>
  </aside>
  ${exploreLinks("")}`;
}

function renderSection(route) {
  const page = PAGES[route];
  const charts = page.charts.map((c) => chartCard(c, false)).join("");
  const notes = page.notes
    .map((n) => `<aside class="note"><p>${esc(n)}</p></aside>`)
    .join("");
  return `<section class="page-head">
    <p class="kicker">${esc(page.kicker)}</p>
    <h1>${esc(page.title)}</h1>
    <p class="lede">${esc(page.lede)}</p>
    <p class="meta-line">${esc(page.meta)}</p>
  </section>
  <hr class="rule">
  <div class="cards">${page.stats.map((s) => statCard(s, false)).join("")}</div>
  <h2 class="section-title">Charts</h2>
  <div class="chart-grid">${charts}</div>
  ${notes}
  ${exploreLinks(route)}`;
}

function renderSources() {
  return `<section class="page-head">
    <p class="kicker">Hong Kong · Provenance</p>
    <h1>Sources</h1>
    <p class="lede">Every figure on this site comes from an official release. This page lists the releases behind the numbers, what each one covers, and when it was published — so any figure here can be traced back to its origin.</p>
    <p class="meta-line">No figure on this site is estimated by the site itself. Where a release labels a number provisional, the page carrying it says so.</p>
  </section>
  <hr class="rule">
  <ul class="source-list">
    ${SOURCE_ENTRIES.map(
      (s) => `<li><h3>${esc(s.name)}</h3><p>${esc(s.detail)}</p><p class="src-meta">${esc(s.meta)}</p></li>`
    ).join("")}
  </ul>
  <aside class="note">
    <p><strong>A note on revisions.</strong> The Census and Statistics Department revises its figures as more data arrives — the end-2024 population, first published as 7.53 million, was later revised to 7.50 million. This site uses the latest revised figure wherever one exists, and labels provisional estimates as provisional.</p>
  </aside>
  ${exploreLinks("sources")}`;
}

export function renderRoute(route) {
  if (route === "") return { title: SITE.name, html: renderHome() };
  if (route === "sources") return { title: `Sources · ${SITE.name}`, html: renderSources() };
  if (Object.hasOwn(PAGES, route)) {
    return { title: `${PAGES[route].title} · ${SITE.name}`, html: renderSection(route) };
  }
  return {
    title: `Not found · ${SITE.name}`,
    html: `<section class="page-head"><h1>Page not found</h1>
      <p class="lede">There is no section called “${esc(route)}”. Try one of the sections below.</p></section>
      ${exploreLinks("missing")}`,
  };
}
