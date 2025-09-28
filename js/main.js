let recipes = [];

// Load site config
document.getElementById("site-title").textContent = SITE_CONFIG.title;
document.getElementById("header-title").textContent = SITE_CONFIG.title;

// Populate category filters
const filterCategory = document.getElementById("filter-category");
const newCategory = document.getElementById("new-category");
SITE_CONFIG.categories.forEach(cat => {
  const option = document.createElement("option");
  option.value = cat;
  option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
  filterCategory.appendChild(option);
  newCategory.appendChild(option.cloneNode(true));
});

// Load recipes.json
fetch("recipes.json")
  .then(res => res.json())
  .then(data => { recipes = data; renderList(); });

// Render recipe list
const listEl = document.getElementById("recipe-list");
const searchInput = document.getElementById("search");

function renderList() {
  const term = searchInput.value.toLowerCase();
  const category = filterCategory.value;
  listEl.innerHTML = "";
  recipes
    .filter(r => (!category || r.category === category) && r.name.toLowerCase().includes(term))
    .forEach(r => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="${r.url}">${r.name} (${r.category})</a>`;
      listEl.appendChild(li);
    });
}

searchInput.oninput = renderList;
filterCategory.onchange = renderList;

// Recipe Builder
document.getElementById("generate-btn").addEventListener("click", () => {
  const name = document.getElementById("new-name").value.trim();
  const category = document.getElementById("new-category").value.trim();
  const image = document.getElementById("new-image").value.trim() || SITE_CONFIG.defaultImagePath;
  const ingredients = document.getElementById("new-ingredients").value.trim().split("\n").filter(l => l);
  const directions = document.getElementById("new-directions").value.trim().split("\n").filter(l => l);
  const notes = document.getElementById("new-notes").value.trim().split("\n").filter(n => n);

  if (!name || !category || !ingredients.length || !directions.length) {
    alert("Please fill all required fields.");
    return;
  }

  const recipeHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${name}</title>
<link rel="stylesheet" href="../css/style.css">
</head>
<body>
<div class="container">
  <header>
    <h1>${name}</h1>
    <p>Author: ${SITE_CONFIG.author} | Category: ${category}</p>
  </header>
  <img src="${image}" alt="${name}">
  <h2>Ingredients</h2>
  <ul>${ingredients.map(i => `<li>${i}</li>`).join("")}</ul>
  <h2>Directions</h2>
  <ol>${directions.map(d => `<li>${d}</li>`).join("")}</ol>
  ${notes.length ? `<h2>Notes</h2><ul>${notes.map(n => `<li>${n}</li>`).join("")}</ul>` : ""}
</div>
</body>
</html>`;

  const blob = new Blob([recipeHTML], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name.toLowerCase().replace(/\s+/g,"-") + ".html";
  a.click();
  URL.revokeObjectURL(url);

  recipes.push({name, category, url: "recipes/" + name.toLowerCase().replace(/\s+/g,"-") + ".html"});
  renderList();
});
