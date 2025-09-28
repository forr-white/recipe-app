Recipe App - Plug & Play Version

A professional, easy-to-use recipe index and builder. Add, manage, and generate recipes automatically with minimal setup.

Folder Structure
recipe-app/
├─ public/
│   ├─ index.html            <-- Main recipe index page
│   ├─ css/
│   │   └─ style.css         <-- App styling
│   ├─ js/
│   │   └─ main.js           <-- App functionality
│   ├─ images/               <-- Default & uploaded images
│   └─ recipes/              <-- Generated recipe HTML files
├─ data/
│   └─ recipes.json          <-- Stored recipe data
├─ config.js                 <-- Site settings (editable)
├─ server.js                 <-- Node.js backend
├─ package.json
├─ README.md

1. Requirements
Node.js v18+
NPM

2. Setup Instructions
Install Dependencies
npm install

Start the Server
node server.js

Open your browser at http://localhost:3000
Your recipe index will load automatically

3. Configuration

Edit config.js to customize the site:

const SITE_CONFIG = {
  title: "Your Recipe Index",
  author: "Your Name",
  defaultImagePath: "images/default.jpg",
  categories: [
    "appetizers", "bread", "breakfast", "desserts",
    "dinner", "drinks", "sauce", "sides", "soups"
  ]
};

title: The site title displayed at the top
author: Your name or brand
defaultImagePath: Used if a recipe has no image
categories: Recipe categories for dropdowns

4. Adding Recipes
Option 1: Use the Recipe Builder (Recommended)
    Open http://localhost:3000
    Scroll to Create a New Recipe
    Fill out:
        Recipe Name
        Category
        Ingredients (one per line)
        Directions (one step per line)
        Notes (optional, one per line)
        Upload an image (optional)
    Click Generate Recipe File
The recipe will automatically:
    Generate an HTML file in public/recipes/
    Add itself to data/recipes.json
    Immediately appear in the recipe index
Option 2: Manually Edit recipes.json
[
  {
    "name": "5 Layer Dip",
    "category": "appetizers",
    "url": "recipes/five-layer-dip.html",
    "image": "images/five-layer-dip.jpg",
    "ingredients": ["1 can refried beans", "1 cup sour cream"],
    "directions": ["Layer ingredients", "Chill before serving"],
    "notes": ["Can be made ahead of time"]
  }
]

    Update recipes.json and add the corresponding HTML file in public/recipes/
    Refresh the page to see changes

5. Images
Default images go in public/images/
Uploaded images from the builder are automatically stored in public/images/

6. Commercial Use Tips
Include branding by editing config.js
Add additional categories to suit your market
Users only need Node.js to run — no manual editing required
Fully plug-and-play for non-technical users

7. Optional Enhancement
Drag-and-drop image uploader in frontend
Theme options in config.js (colors, fonts)
Backend deployment for multiple users

8. Running in Production
Use a Node.js hosting service (Heroku, Render, Railway, etc.)
Ensure public/, data/, and config.js are included
Recipes will remain persistent and fully functional