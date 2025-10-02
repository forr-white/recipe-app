const listEl = document.getElementById("recipe-list");
const searchInput = document.getElementById("search");
const filterCategory = document.getElementById("filter-category");
const backToTopBtn = document.getElementById("back-to-top");
const generateBtn = document.getElementById("generate-btn");

let recipes = [];

// Fetch recipes from server
async function loadRecipes() {
  const res = await fetch('http://localhost:5000/recipes');
  recipes = await res.json();
  renderList();
}

// Render list
function renderList() {
  const term = searchInput.value.toLowerCase();
  const category = filterCategory.value;
  listEl.innerHTML = '';

  recipes
    .filter(r => (!category || r.category === category) &&
                (r.name.toLowerCase().includes(term)))
    .forEach(r => {
      const card = document.createElement('div');
      card.className = 'info-item';
      card.innerHTML = `
        <div class="card" style="overflow:hidden;">
          ${r.image ? `<img src="${r.image}" alt="${r.name}" style="width:100%; height:150px; object-fit:cover; border-radius:8px;">` : ``}
        </div>
        <p>${r.name}</p>
        <small style="color:#6b7280; font-size:14px;">${r.category}</small>
      `;
      listEl.appendChild(card);
    });
}

// Submit new recipe
generateBtn.addEventListener("click", async () => {
  const name = document.getElementById("new-name").value.trim();
  const image = document.getElementById("new-image").value.trim();
  const category = document.getElementById("new-category").value;
  const ingredients = document.getElementById("new-ingredients").value.trim().split("\n").filter(Boolean);
  const directions = document.getElementById("new-directions").value.trim().split("\n").filter(Boolean);
  const notes = document.getElementById("new-notes").value.trim().split("\n").filter(Boolean);

  if (!name) return alert("Please enter a recipe name.");

  const recipe = { name, image, category, ingredients, directions, notes };

  // Save to backend
  const res = await fetch('http://localhost:5000/recipes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(recipe)
  });
  const data = await res.json();
  recipes.push(data);
  renderList();
});

// Filter and search
searchInput.addEventListener("input", renderList);
filterCategory.addEventListener("change", renderList);

// Back to top
window.addEventListener("scroll", () => backToTopBtn.style.display = window.scrollY > 200 ? "flex" : "none");
backToTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// Load recipes on page load
loadRecipes();
