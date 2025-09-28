const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// File upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/images/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Middleware
app.use(express.json());
app.use(express.static('public'));

// API to get recipes
app.get('/api/recipes', (req, res) => {
  const data = JSON.parse(fs.readFileSync('data/recipes.json'));
  res.json(data);
});

// API to add a new recipe
app.post('/api/recipes', upload.single('image'), (req, res) => {
  const { name, category, ingredients, directions, notes } = req.body;
  let recipes = JSON.parse(fs.readFileSync('data/recipes.json'));

  const fileName = name.toLowerCase().replace(/\s+/g, '-') + '.html';
  const imagePath = req.file ? 'images/' + req.file.filename : SITE_CONFIG.defaultImagePath;

  const newRecipe = { name, category, url: 'recipes/' + fileName, image: imagePath, ingredients, directions, notes };
  recipes.push(newRecipe);

  fs.writeFileSync('data/recipes.json', JSON.stringify(recipes, null, 2));

  // Generate recipe HTML
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
    <img src="../${imagePath}" alt="${name}">
    <h2>Ingredients</h2>
    <ul>${ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
    <h2>Directions</h2>
    <ol>${directions.map(d => `<li>${d}</li>`).join('')}</ol>
    ${notes.length ? `<h2>Notes</h2><ul>${notes.map(n => `<li>${n}</li>`).join('')}</ul>` : ''}
  </div>
  </body>
  </html>
  `;

  fs.writeFileSync('public/recipes/' + fileName, recipeHTML);

  res.json({ success: true, recipe: newRecipe });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
