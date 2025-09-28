const listEl = document.getElementById('recipe-list');
const searchInput = document.getElementById('search');
const filterCategory = document.getElementById('filter-category');
const newCategory = document.getElementById('new-category');

// Load categories from config
SITE_CONFIG.categories.forEach(cat => {
  const option = document.createElement('option');
  option.value = cat;
  option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
  filterCategory.appendChild(option);
  newCategory.appendChild(option.cloneNode(true));
});

let recipes = [];

// Fetch recipes from backend
function loadRecipes() {
  fetch('/api/recipes')
    .then(res => res.json())
    .then(data => { recipes = data; renderList(); });
}

function renderList() {
  const term = searchInput.value.toLowerCase();
  const category = filterCategory.value;
  listEl.innerHTML = '';
  recipes
    .filter(r => (!category || r.category === category) && r.name.toLowerCase().includes(term))
    .forEach(r => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="${r.url}">${r.name} (${r.category})</a>`;
      listEl.appendChild(li);
    });
}

searchInput.oninput = renderList;
filterCategory.onchange = renderList;
loadRecipes();

// Recipe Builder: Send data to backend
document.getElementById('generate-btn').addEventListener('click', () => {
  const name = document.getElementById('new-name').value.trim();
  const category = document.getElementById('new-category').value.trim();
  const imageFile = document.getElementById('new-image-file').files[0];
  const ingredients = document.getElementById('new-ingredients').value.trim().split('\n').filter(l=>l);
  const directions = document.getElementById('new-directions').value.trim().split('\n').filter(l=>l);
  const notes = document.getElementById('new-notes').value.trim().split('\n').filter(l=>l);

  if(!name || !category || !ingredients.length || !directions.length){
    alert('Please fill all required fields');
    return;
  }

  const formData = new FormData();
  formData.append('name', name);
  formData.append('category', category);
  formData.append('ingredients', JSON.stringify(ingredients));
  formData.append('directions', JSON.stringify(directions));
  formData.append('notes', JSON.stringify(notes));
  if(imageFile) formData.append('image', imageFile);

  fetch('/api/recipes', { method: 'POST', body: formData })
    .then(res=>res.json())
    .then(res=> {
      if(res.success){ loadRecipes(); alert('Recipe added!'); }
    });
});
