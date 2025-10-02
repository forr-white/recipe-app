# Forrest's Recipe Index

A full-stack recipe application built with:

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Database**: MongoDB Atlas (or local MongoDB)

---

## 🚀 Features

- Browse recipes by category or search by name
- Add new recipes with ingredients, directions, and notes
- Auto-generates recipe cards with optional images
- Backend API built with Express and MongoDB
- Responsive design for desktop and mobile

---

## 📂 Project Structure

recipe-app/
│
├── frontend/ # Static frontend
│ ├── index.html
│ ├── style.css
│ └── recipes.js
│
├── backend/ # Node/Express backend
│ ├── models/
│ │ └── recipe.js
│ ├── server.js
│ ├── package.json
│ └── .env (not committed)
│
└── README.md


---

## ⚙️ Local Development

1. **Clone repo & install dependencies**
   ```bash
   cd backend
   npm install
2. **CCreate .env in /backend**
MONGODB_URI=mongodb://127.0.0.1:27017/recipes
PORT=5000
3. **Run backend**
npm start
4. **Open frontend**
Simply open frontend/index.html in your browser
Or serve with live-server / VS Code Live Server

🌐 **Deployment**
Backend (Render)
1. Push backend to GitHub.
2. Create new Render Web Service → Connect repo.
3. Set Environment Variables:
      MONGODB_URI = your MongoDB Atlas connection string
      PORT = 5000 (Render will override this with its own internal port, but our code handles it)
4. Deploy → get your backend URL (e.g. https://myapp.onrender.com).

Frontend (Netlify)
1. Drag & drop /frontend folder into Netlify, or connect repo.
2. Update recipes.js → baseURL logic will auto-detect whether you’re local or on Netlify.

🔑 API Endpoints
Method	   Endpoint	      Description
GET	      /recipes	      Get all recipes
POST	      /recipes	      Add new recipe
DELETE	   /recipes/:id	Delete a recipe

**Example request (POST):**
{
  "name": "Spaghetti Carbonara",
  "category": "dinner",
  "ingredients": ["Pasta", "Eggs", "Bacon", "Parmesan"],
  "directions": ["Boil pasta", "Cook bacon", "Mix with eggs & cheese"],
  "notes": ["Serve immediately"]
}

🛠️ **Troubleshooting**
MongoDB Issues
   Error: MongoDB connection failed
      Check that your .env has the correct MONGODB_URI.
      For local dev, ensure mongod service is running:
      
      brew services start mongodb-community  # macOS
      sudo systemctl start mongod            # Linux
      
      If using Atlas, make sure your IP is whitelisted.

**CORS Errors**
   If you see:
      Access to fetch at 'http://localhost:5000/recipes' 
      from origin 'http://127.0.0.1:5500' has been blocked by CORS policy
   Add your frontend origin in server.js:
      app.use(cors({
         origin: ["http://localhost:3000", "http://127.0.0.1:5500", "https://your-frontend.netlify.app"]
      }));

**Port Already in Use**
If PORT=5000 is busy, kill the process:
   lsof -i :5000
   kill -9 <PID>
Or set a new port in .env:
   PORT=5050

**Render Deployment Fails**
Ensure start script is in backend/package.json:
   "scripts": {
      "start": "node server.js"
   }
Check that MONGODB_URI is set in Render’s environment variables.

**Netlify Fetch Errors**
If frontend can’t load recipes:
   Confirm baseURL detection in recipes.js is correct.
   Check browser console for failed network requests.
   Make sure backend is deployed and not sleeping (Render free tier sleeps after inactivity).