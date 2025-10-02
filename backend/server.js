require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Recipe = require('./models/recipe'); // import your schema

const app = express(); // ✅ create the app first

// Enable CORS for specific origins
app.use(cors({
  origin: ["http://localhost:3000", "https://your-frontend.netlify.app"]
}));

// Middleware
app.use(bodyParser.json());

// MongoDB connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/recipes';

mongoose.connect(mongoURI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true
})
.then(() => console.log(`MongoDB connected: ${mongoURI}`))
.catch(err => console.log("MongoDB connection error:", err));

// API Endpoints
app.get('/recipes', async (req, res) => {
  const recipes = await Recipe.find();
  res.json(recipes);
});

app.post('/recipes', async (req, res) => {
  try {
    const recipe = new Recipe(req.body);
    await recipe.save();
    res.status(201).json(recipe);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/recipes/:id', async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: 'Recipe deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
