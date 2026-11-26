// Hong Kong in Numbers — hand-rolled SVG charts.
// No chart library: every chart below is drawn from the numbers in data.js
// with plain arithmetic. All charts are inline SVG (no xmlns attribute is
// needed inside an HTML page), so the site stays free of external references.

const CHART_W = 640;
const CHART_H = 300;
const PAD = { top: 34, right: 14, bottom: 34, left: 52 };

// Format a number the way a reader expects: 36,700 not 36700; keep one
// decimal for values that carry one.
export function fmtNum(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return String(v);
  const text = Math.abs(n) >= 1000 ? n.toLocaleString("en-US") : String(n);
  return text;
}

function fmtLabel(v, unit) {
  // A leading "+" reads as a change only for percentage units; counts and
  // index levels never take one ("+36,700 births" would be nonsense).
  const sign = v > 0 && unit === "%" ? "+" : "";
  const core = Number.isInteger(v) ? fmtNum(v) : v.toFixed(1);
  return `${sign}${core}${unit}`;
}

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Nice round grid steps: 1, 2, 2.5, 5 or 10 times a power of ten.
function niceStep(span, want) {
  const raw = span / want;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const pick = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10;
  return pick * mag;
}

function gridLines(min, max) {
  const step = niceStep(max - min, 4);
  const lines = [];
  let v = Math.ceil(min / step) * step;
  if (Math.abs(v) < step * 0.001) v = 0;
  while (v <= max + step * 0.001) {
    lines.push(v);
    v += step;
  }
  return lines;
}

function openSvg(title) {
  return (
    `<svg viewBox="0 0 ${CHART_W} ${CHART_H}" role="img" aria-label="${esc(title)}">` +
    `<title>${esc(title)}</title>`
  );
}

// Vertical bars, with a zero line when the series crosses it. Every bar is
// labelled with its value, and the axis with its gridlines.
export function barChart(chart) {
  const { series, unit } = chart;
  const values = series.map((d) => d.value);
  let min = Math.min(0, ...values);
  let max = Math.max(0, ...values);
  if (max === min) max = min + 1;
  const padSpan = (max - min) * 0.08;
  min -= padSpan;
  max += padSpan;
  const plotW = CHART_W - PAD.left - PAD.right;
  const plotH = CHART_H - PAD.top - PAD.bottom;
  const y = (v) => PAD.top + ((max - v) / (max - min)) * plotH;
  const slot = plotW / series.length;
  const barW = Math.min(72, slot * 0.55);
  const zeroY = y(0);

  let s = openSvg(chart.title);
  for (const g of gridLines(min, max)) {
    const gy = y(g);
    s += `<line x1="${PAD.left}" y1="${gy.toFixed(1)}" x2="${CHART_W - PAD.right}" y2="${gy.toFixed(1)}" stroke="#e3ddd0" stroke-width="1"/>`;
    s += `<text x="${PAD.left - 8}" y="${(gy + 4).toFixed(1)}" text-anchor="end" font-size="12" fill="#6b7a80">${esc(fmtLabel(g, unit))}</text>`;
  }
  s += `<line x1="${PAD.left}" y1="${zeroY.toFixed(1)}" x2="${CHART_W - PAD.right}" y2="${zeroY.toFixed(1)}" stroke="#14232b" stroke-width="1.5"/>`;
  series.forEach((d, i) => {
    const cx = PAD.left + slot * (i + 0.5);
    const top = y(Math.max(d.value, 0));
    const bottom = y(Math.min(d.value, 0));
    const fill = d.value < 0 ? "#c95a1e" : "#1f7a6d";
    s += `<rect x="${(cx - barW / 2).toFixed(1)}" y="${top.toFixed(1)}" width="${barW.toFixed(1)}" height="${Math.max(1, bottom - top).toFixed(1)}" rx="3" fill="${fill}"/>`;
    const labelY = d.value >= 0 ? top - 8 : bottom + 16;
    s += `<text x="${cx.toFixed(1)}" y="${labelY.toFixed(1)}" text-anchor="middle" font-size="13" font-weight="700" fill="#14232b">${esc(fmtLabel(d.value, unit))}</text>`;
    s += `<text x="${cx.toFixed(1)}" y="${CHART_H - 10}" text-anchor="middle" font-size="13" fill="#3d4f57">${esc(d.label)}</text>`;
  });
  s += "</svg>";
  return s;
}

// Grouped bars: each group (e.g. Exports) holds one bar per year.
export function groupedBarChart(chart) {
  const { groups, years, unit } = chart;
  const all = groups.flatMap((g) => g.values);
  let min = 0;
  let max = Math.max(...all);
  const padSpan = max * 0.08;
  max += padSpan;
  const plotW = CHART_W - PAD.left - PAD.right;
  const plotH = CHART_H - PAD.top - PAD.bottom;
  const y = (v) => PAD.top + ((max - v) / (max - min)) * plotH;
  const slot = plotW / groups.length;
  const barW = Math.min(56, (slot * 0.6) / years.length);
  const fills = ["#1f7a6d", "#c95a1e"];

  let s = openSvg(chart.title);
  for (const g of gridLines(min, max)) {
    const gy = y(g);
    s += `<line x1="${PAD.left}" y1="${gy.toFixed(1)}" x2="${CHART_W - PAD.right}" y2="${gy.toFixed(1)}" stroke="#e3ddd0" stroke-width="1"/>`;
    s += `<text x="${PAD.left - 8}" y="${(gy + 4).toFixed(1)}" text-anchor="end" font-size="12" fill="#6b7a80">${esc(fmtNum(g))}</text>`;
  }
  s += `<line x1="${PAD.left}" y1="${y(0).toFixed(1)}" x2="${CHART_W - PAD.right}" y2="${y(0).toFixed(1)}" stroke="#14232b" stroke-width="1.5"/>`;
  groups.forEach((g, gi) => {
    const cx = PAD.left + slot * (gi + 0.5);
    const groupW = barW * years.length + 8 * (years.length - 1);
    g.values.forEach((v, yi) => {
      const bx = cx - groupW / 2 + yi * (barW + 8);
      s += `<rect x="${bx.toFixed(1)}" y="${y(v).toFixed(1)}" width="${barW.toFixed(1)}" height="${Math.max(1, y(0) - y(v)).toFixed(1)}" rx="3" fill="${fills[yi % fills.length]}"/>`;
      s += `<text x="${(bx + barW / 2).toFixed(1)}" y="${(y(v) - 8).toFixed(1)}" text-anchor="middle" font-size="12" font-weight="700" fill="#14232b">${esc(fmtNum(v))}</text>`;
    });
    s += `<text x="${cx.toFixed(1)}" y="${CHART_H - 10}" text-anchor="middle" font-size="13" fill="#3d4f57">${esc(g.label)}</text>`;
  });
  // Legend, top right.
  years.forEach((yr, yi) => {
    const lx = CHART_W - PAD.right - (years.length - yi) * 78;
    s += `<rect x="${lx}" y="8" width="12" height="12" rx="2" fill="${fills[yi % fills.length]}"/>`;
    s += `<text x="${lx + 17}" y="19" font-size="12.5" fill="#3d4f57">${esc(yr)}</text>`;
  });
  s += "</svg>";
  return s;
}

// Simple line chart with dots and value labels.
export function lineChart(chart) {
  const { series, unit } = chart;
  const values = series.map((d) => d.value);
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (max === min) max = min + 1;
  const padSpan = (max - min) * 0.18;
  min -= padSpan;
  max += padSpan;
  const plotW = CHART_W - PAD.left - PAD.right;
  const plotH = CHART_H - PAD.top - PAD.bottom;
  const x = (i) => PAD.left + (series.length === 1 ? plotW / 2 : (i / (series.length - 1)) * plotW);
  const y = (v) => PAD.top + ((max - v) / (max - min)) * plotH;

  let s = openSvg(chart.title);
  for (const g of gridLines(min, max)) {
    const gy = y(g);
    s += `<line x1="${PAD.left}" y1="${gy.toFixed(1)}" x2="${CHART_W - PAD.right}" y2="${gy.toFixed(1)}" stroke="#e3ddd0" stroke-width="1"/>`;
    s += `<text x="${PAD.left - 8}" y="${(gy + 4).toFixed(1)}" text-anchor="end" font-size="12" fill="#6b7a80">${esc(fmtLabel(g, unit))}</text>`;
  }
  const points = series.map((d, i) => `${x(i).toFixed(1)},${y(d.value).toFixed(1)}`).join(" ");
  s += `<polyline points="${points}" fill="none" stroke="#1f7a6d" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`;
  series.forEach((d, i) => {
    s += `<circle cx="${x(i).toFixed(1)}" cy="${y(d.value).toFixed(1)}" r="5" fill="#fffdf8" stroke="#1f7a6d" stroke-width="3"/>`;
    s += `<text x="${x(i).toFixed(1)}" y="${(y(d.value) - 12).toFixed(1)}" text-anchor="middle" font-size="13" font-weight="700" fill="#14232b">${esc(fmtLabel(d.value, unit))}</text>`;
    s += `<text x="${x(i).toFixed(1)}" y="${CHART_H - 10}" text-anchor="middle" font-size="13" fill="#3d4f57">${esc(d.label)}</text>`;
  });
  s += "</svg>";
  return s;
}

// Dispatch on a chart object from data.js.
export function renderChart(chart) {
  if (chart.kind === "grouped") return groupedBarChart(chart);
  if (chart.kind === "line") return lineChart(chart);
  return barChart(chart);
}
