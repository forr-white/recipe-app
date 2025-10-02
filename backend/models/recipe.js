const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: String,
  category: String,
  ingredients: [String],
  directions: [String],
  notes: [String]
});

module.exports = mongoose.model('Recipe', RecipeSchema);
