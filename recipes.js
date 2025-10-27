// =========================================================
// Cook Anything Kitchen - Enhanced & Accessible recipes.js
// =========================================================

const SHEET_URL = "Sheet Deployment Here"; // Replace with actual URL
const CACHE_KEY = "cookanything_recipes";
const CACHE_TTL = 0; // 30 minutes

let allRecipes = [];
const recipesPerPage = 24;
let currentPage = parseInt(new URLSearchParams(window.location.search).get("page")) || 1;

// Cache Helpers
function setCache(data) {
  localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }));
}
function getCache() {
 // const cached = localStorage.getItem(CACHE_KEY);
 // if (!cached) return null;
 // const parsed = JSON.parse(cached);
 // if (Date.now() - parsed.timestamp > CACHE_TTL) {
  //  localStorage.removeItem(CACHE_KEY);
    return null;
  }
//  return parsed.data;
//}

// Fetch Recipes
async function fetchRecipes() {
  const spinner = document.getElementById("loadingSpinner");
  if (spinner) spinner.style.display = "block";

  try {
    const cached = getCache();
    if (cached) {
      if (spinner) spinner.style.display = "none";
      return cached;
    }

    const response = await fetch(SHEET_URL);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const data = await response.json();

    const recipes = data.map(r => ({
      name: r.name?.trim() || "",
      category: r.category?.trim().toLowerCase() || "",
      cuisine: r.cuisine?.trim().toLowerCase() || "",
      tags: r.tags ? r.tags.split(",").map(t => t.trim().toLowerCase()) : [],
      image: r["image url"] || r.image || "",
      link: r.link || "#",
      date: r.date || ""
    }));

    // ✅ Normalize relative URLs so all recipes display correctly
recipes.forEach(r => {
  if (r.image && !r.image.startsWith("http")) {
    r.image = `https://cookanythingkitchen.com/${r.image.replace(/^\/+/, "")}`;
  }
  if (r.link && !r.link.startsWith("http")) {
    r.link = `https://cookanythingkitchen.com/${r.link.replace(/^\/+/, "")}`;
  }
});


    setCache(recipes);
    if (spinner) spinner.style.display = "none";
    return recipes;
  } catch (err) {
    console.error("Error fetching recipes:", err);
    if (spinner) spinner.style.display = "none";
    const container = document.getElementById("recipesContainer");
    container.innerHTML = "<p>⚠️ Could not load recipes. Please refresh or try again later.</p>";
    return [];
  }
}

// Display Recipes
function displayRecipes(recipes) {
  const container = document.getElementById("recipesContainer");
  container.innerHTML = "";

  if (!recipes.length) {
    container.innerHTML = "<p>No recipes found.</p>";
    return;
  }

  recipes.forEach(r => {
    const div = document.createElement("div");
    div.className = "recipe-card";
    div.innerHTML = `
      <a href="${r.link}" class="btn">
        <img src="${r.image}" alt="${r.name}" loading="lazy" onerror="this.src='images/placeholder.jpg';">
      </a>
      <a href="${r.link}" class="btn"><h3>${r.name}</h3></a>
      <p>${r.category} | ${r.cuisine}</p>
    `;
    container.appendChild(div);
  });
}

// Filtering, Sorting, and Pagination
function filterRecipes(recipes) {
  const category = document.getElementById("filter-category").value.toLowerCase();
  const search = document.getElementById("searchCombined").value.toLowerCase();

  return recipes.filter(r => {
    const matchesCategory = !category || r.category === category;
    const matchesSearch =
      !search ||
      r.name.toLowerCase().includes(search) ||
      r.cuisine.toLowerCase().includes(search) ||
      r.tags.some(tag => tag.includes(search));
    return matchesCategory && matchesSearch;
  });
}

function sortRecipes(recipes, criteria) {
  const sorted = [...recipes];
  switch (criteria) {
    case "name":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "cuisine":
      sorted.sort((a, b) => a.cuisine.localeCompare(b.cuisine));
      break;
    case "category":
      sorted.sort((a, b) => a.category.localeCompare(b.category));
      break;
    case "recent":
    default:
      sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
  }
  return sorted;
}

function updatePaginationControls(totalRecipes) {
  const totalPages = Math.ceil(totalRecipes / recipesPerPage);
  const pageNumbers = document.getElementById("pageNumbers");
  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");
  const pageStatus = document.getElementById("pageStatus");

  pageNumbers.innerHTML = "";
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages || totalPages === 0;
  if (pageStatus) pageStatus.textContent = `Page ${currentPage} of ${totalPages}`;

  if (totalPages <= 1) return;

  const maxVisible = 5;
  let startPage = Math.max(2, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages - 1, startPage + maxVisible - 1);
  if (endPage - startPage < maxVisible - 1)
    startPage = Math.max(2, endPage - maxVisible + 1);

  // Always show page 1
  const firstBtn = document.createElement("button");
  firstBtn.textContent = "1";
  firstBtn.className = "page-btn";
  firstBtn.setAttribute("aria-label", "Page 1");
  firstBtn.setAttribute("aria-current", currentPage === 1 ? "page" : "false");
  if (currentPage === 1) firstBtn.classList.add("active");
  firstBtn.addEventListener("click", () => { currentPage = 1; updateDisplay(true); });
  pageNumbers.appendChild(firstBtn);

  if (startPage > 2) {
    const ellipsis = document.createElement("span");
    ellipsis.textContent = "…";
    ellipsis.setAttribute("aria-hidden", "true");
    pageNumbers.appendChild(ellipsis);
  }

  for (let i = startPage; i <= endPage; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = "page-btn";
    btn.setAttribute("aria-label", `Page ${i}`);
    btn.setAttribute("aria-current", currentPage === i ? "page" : "false");
    if (i === currentPage) btn.classList.add("active");
    btn.addEventListener("click", () => { currentPage = i; updateDisplay(true); });
    pageNumbers.appendChild(btn);
  }

  if (endPage < totalPages - 1) {
    const ellipsis = document.createElement("span");
    ellipsis.textContent = "…";
    ellipsis.setAttribute("aria-hidden", "true");
    pageNumbers.appendChild(ellipsis);
  }

  const lastBtn = document.createElement("button");
  lastBtn.textContent = totalPages;
  lastBtn.className = "page-btn";
  lastBtn.setAttribute("aria-label", `Page ${totalPages}`);
  lastBtn.setAttribute("aria-current", currentPage === totalPages ? "page" : "false");
  if (currentPage === totalPages) lastBtn.classList.add("active");
  lastBtn.addEventListener("click", () => { currentPage = totalPages; updateDisplay(true); });
  pageNumbers.appendChild(lastBtn);
}

function updateDisplay(pushState = false) {
  const filtered = filterRecipes(allRecipes);
  const sorted = sortRecipes(filtered, document.getElementById("sortSelect").value);

  const start = (currentPage - 1) * recipesPerPage;
  const paginated = sorted.slice(start, start + recipesPerPage);

  displayRecipes(paginated);
  updatePaginationControls(filtered.length);
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (pushState) {
    const url = new URL(window.location);
    url.searchParams.set("page", currentPage);
    window.history.pushState({}, "", url);
  }
}

// Pagination & Keyboard Setup
function setupPagination() {
  const prev = document.getElementById("prevPage");
  const next = document.getElementById("nextPage");
  prev.addEventListener("click", () => { if (currentPage > 1) { currentPage--; updateDisplay(true); } });
  next.addEventListener("click", () => {
    const total = Math.ceil(filterRecipes(allRecipes).length / recipesPerPage);
    if (currentPage < total) { currentPage++; updateDisplay(true); }
  });
}

function setupKeyboardPagination() {
  document.addEventListener("keydown", e => {
    const active = document.activeElement.tagName;
    if (active === "INPUT" || active === "TEXTAREA") return;
    const total = Math.ceil(filterRecipes(allRecipes).length / recipesPerPage);
    switch (e.key) {
      case "ArrowLeft":
        if (currentPage > 1) { currentPage--; updateDisplay(true); }
        break;
      case "ArrowRight":
        if (currentPage < total) { currentPage++; updateDisplay(true); }
        break;
      case "Home":
        if (currentPage !== 1) { currentPage = 1; updateDisplay(true); }
        break;
      case "End":
        if (currentPage !== total) { currentPage = total; updateDisplay(true); }
        break;
    }
  });
}

// Filters, Scrolling, and Debounce
function populateFilters(recipes) {
  const categorySet = new Set(recipes.map(r => r.category).filter(Boolean));
  const select = document.getElementById("filter-category");
  select.innerHTML = '<option value="">All Categories</option>';
  categorySet.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    select.appendChild(opt);
  });
}

const backToTopBtn = document.getElementById("backToTopBtn");
function handleScroll() {
  backToTopBtn.style.display = window.scrollY > 200 ? "block" : "none";
}
backToTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

function debounce(fn, delay = 300) {
  let timeout;
  return (...args) => { clearTimeout(timeout); timeout = setTimeout(() => fn(...args), delay); };
}

// Initialize
async function init() {
  allRecipes = await fetchRecipes();
  populateFilters(allRecipes);
  updateDisplay();
  setupPagination();
  setupKeyboardPagination();

  const debouncedUpdate = debounce(() => { currentPage = 1; updateDisplay(true); }, 300);
  document.querySelectorAll("#filter-category, #searchCombined, #sortSelect")
    .forEach(el => el.addEventListener("input", debouncedUpdate));

  window.addEventListener("scroll", handleScroll);
  window.dispatchEvent(new Event("recipesLoaded"));
}

document.addEventListener("DOMContentLoaded", init);
