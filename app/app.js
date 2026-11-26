// Hong Kong in Numbers — router and boot.
// Hash routes: #/ (home), #/population, #/economy, #/labour, #/prices,
// #/housing, #/sources. Rendering a route swaps #view, marks the matching
// nav link active, sets the document title and returns to the top.

import { NAV, SITE } from "./data.js";
import { renderRoute } from "./views.js";

const view = document.getElementById("view");
const navLinks = Array.from(document.querySelectorAll(".site-nav a"));

function currentRoute() {
  const hash = window.location.hash || "#/";
  const path = hash.replace(/^#\/?/, "").replace(/\/$/, "");
  return decodeURIComponent(path);
}

let lastRoute = null;

function render() {
  const route = currentRoute();
  try {
    const page = renderRoute(route);
    view.innerHTML = page.html;
    document.title = page.title;
    for (const link of navLinks) {
      link.classList.toggle("active", link.dataset.route === route);
      if (link.dataset.route === route) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    }
  } catch (err) {
    view.innerHTML =
      `<div class="error-note" role="alert"><p><strong>Something went wrong rendering this page.</strong></p>` +
      `<p>Try another section from the navigation above. (${String(err.message || err)})</p></div>`;
    document.title = SITE.name;
  }
  // Return to the top when the route changes, but leave the scroll alone on
  // the first load so a refreshed page keeps its place.
  if (lastRoute !== null && lastRoute !== route) window.scrollTo(0, 0);
  lastRoute = route;
}

window.addEventListener("hashchange", render);
render();
