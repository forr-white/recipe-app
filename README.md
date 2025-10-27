# 🍳 Odin Recipes  
A static recipe website powered by **GitHub Pages** and **Google Sheets + Apps Script** — no servers or databases required.  
This project lets you create, store, and publish recipes automatically from a Google Sheet directly into your GitHub repository.
---
## 🚀 Getting Started

### 1️⃣ Clone the Repository
You’ll need a **GitHub account**.

Open your terminal or Git Bash and run:
```bash
git clone https://github.com/forr-white/recipe-app.git
Or fork it directly on GitHub to your own account.

2️⃣ Enable GitHub Pages
To make your site viewable online:
    Go to your GitHub repository.
    Navigate to Settings → Pages.
    Under Build and Deployment, set:
        Source: Deploy from a branch
        Branch: main (root /)
    Click Save.
After a minute or two, your site will be live at:
https://your-username.github.io/recipe-app/

3️⃣ (Optional) Connect a Custom Domain
If you have your own domain name (e.g., myrecipes.com):
    In your domain’s DNS, create a CNAME record pointing to:
        your-username.github.io
    In GitHub → Settings → Pages, add your custom domain.
    GitHub will automatically configure HTTPS (SSL).

🗂️ Project Structure
File	Description
index.html	Main landing page
style.css	Global styling
recipe-builder.html	Build new recipes and send them to Google Sheets & GitHub
Nutrition-Card-Builder.html	Create nutrition cards for recipes
config-check.js	Enables/disables demo mode
config.json	Controls demo mode only
recipes.js	Loads and displays recipes dynamically
/images/	Site and recipe images
/recipes/	Auto-generated recipe HTML files
google-script.txt	Copy-paste Apps Script for connecting Google Sheets to GitHub

📊 Google Sheets Setup
    Create a new Google Sheet.
    Add this header row (exactly in this order):
        date | name | category | image | link | cuisine | tags
Each subsequent row represents a recipe.

⚙️ Setting Up Google Apps Script
1️⃣ Add the Script
In your Google Sheet:
    Go to Extensions → Apps Script.
    Delete any existing code.
    Copy all contents from this repository’s google-script.txt file into the editor.
    Replace all instances of 'SHEET_ID' in the code with your actual Google Sheet ID (see below).

2️⃣ Find Your Sheet ID
Your Google Sheet URL will look like this:
    https://docs.google.com/spreadsheets/d/1AbCDEfgHIjKlMNopQRstUVWXyz1234567/edit#gid=0
Your Sheet ID is the long string between /d/ and /edit:
    1AbCDEfgHIjKlMNopQRstUVWXyz1234567
Paste it into the script wherever it says:
    SpreadsheetApp.openById('SHEET_ID')
→ becomes:
    SpreadsheetApp.openById('1AbCDEfgHIjKlMNopQRstUVWXyz1234567')

3️⃣ Deploy the Script as a Web App
    In the Apps Script editor, click Deploy → New deployment.
    Under Select type, choose Web app.
    Configure it as:
        Execute as: Me (your account)
        Who has access: Anyone with the link
    Click Deploy.
You’ll receive a Web App URL like this:
    https://script.google.com/macros/s/AKfycbxExample1234567/exec
⚠️ You must use the full URL (not just the ID) when configuring your recipe pages.
Copy this URL — you’ll plug it into both your recipe-builder.html and recipes.js files where the placeholder says “Sheet Deployment Here”.

🔑 GitHub Token Setup
The Apps Script needs access to post new recipe files to your GitHub repository.
    Go to your GitHub account → Settings → Developer settings → Personal access tokens → Tokens (classic).
    Click Generate new token.
    Give it a name (e.g., GoogleScriptRecipeUploader).
    Enable the repo permission.
    Generate the token and copy it.

Store Token and Repo Info in Apps Script:
In the Apps Script editor:
    Go to Project Settings (⚙️ icon) → Script Properties.
    Add these key-value pairs:
Property	Value
GITHUB_TOKEN	your personal access token
GITHUB_USER	    your GitHub username
GITHUB_REPO	    odin-recipes
The Google script will use these properties automatically when uploading recipe HTML files to your GitHub repository’s /recipes/ folder.

🔗 Connecting the Website to Your Script
Once deployed, copy your full Web App URL:
    https://script.google.com/macros/s/AKfycbxExample1234567/exec
Insert it into:
    recipe-builder.html
    recipes.js
Find the input labeled “Sheet Deployment Here” and replace it with your full URL, like:
    const sheetDeployment = "https://script.google.com/macros/s/AKfycbxExample1234567/exec";
This allows both files to read and write to your Google Sheet.

⚙️ Demo Mode
The config.json file only toggles demo mode:
{
  "demoMode": true
}
true → loads demo recipe data
false → connects to your live Google Sheet via your full web app URL
You can toggle this anytime for testing.

🧠 How It Works
    Recipe Builder → Posts form data to your Google Script URL
    Google Script →
        Saves recipe metadata to your Google Sheet
        Builds the recipe’s HTML file
        Pushes that file into your GitHub repo’s /recipes/ folder
    Recipes.js → Fetches recipes from your Google Sheet (via the same URL) and displays them on your site

🧰 Troubleshooting
Problem	                        Possible Fix
Recipes not showing	            Make sure you entered the full web app URL (not just the ID)
“Permission denied” error	    Deploy the script with access set to “Anyone with the link”
Recipe not added to GitHub	    Verify your GitHub token and repo name in script properties
Demo mode stuck on	            Ensure "demoMode": false and refresh your cache
Blank results	                Check that your sheet headers match exactly: date, name, category, image, link, cuisine, tags

💬 Tips
    Updating your Google Sheet updates your website automatically.
    New recipes created via the builder generate new .html files in /recipes/.
    Keep your Apps Script deployed — every new submission uses the same endpoint.
    You can enable demo mode anytime to preview without writing to GitHub.

🧾 License & Attribution
Author: Forrest White
Project: Cook Anything Kitchen
Built with: GitHub Pages, Google Sheets, and Google Apps Script.