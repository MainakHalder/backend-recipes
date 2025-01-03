const { initializeDatabase } = require("./db/db.connect");
const Recipe = require("./models/recipe");
initializeDatabase();

const express = require("express");
const app = express();
app.use(express.json());

const createMovie = async (newRecipe) => {
  try {
    const recipe = new Recipe(newRecipe);
    const saveRecipe = await recipe.save();
    return saveRecipe;
  } catch (error) {
    throw error;
  }
};

app.get("/", (req, res) => {
  res.send("Server is working");
});

app.post("/recipes", async (req, res) => {
  try {
    const newRecipe = await createMovie(req.body);
    res
      .status(201)
      .json({ message: "Recipe addes successfully", recipe: newRecipe });
  } catch (error) {
    res.status(500).json({ error: "Failed to add recipe" });
  }
});

const readAllRecipes = async () => {
  try {
    const readRecipes = await Recipe.find();
    return readRecipes;
  } catch (error) {
    throw error;
  }
};

app.get("/recipes", async (req, res) => {
  try {
    const recipe = await readAllRecipes();
    if (recipe.length) {
      res.json(recipe);
    } else {
      res.status(404).json({ error: "Recipes not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipes." });
  }
});

const readRecipesByTitle = async (recipeTitle) => {
  try {
    const recipeByTitle = await Recipe.findOne({ title: recipeTitle });
    return recipeByTitle;
  } catch (error) {
    throw error;
  }
};

app.get("/recipes/:recipeName", async (req, res) => {
  try {
    const recipesByTitle = await readRecipesByTitle(req.params.recipeName);
    if (recipesByTitle) {
      res.json(recipesByTitle);
    } else {
      res.status(404).json({ message: "Recipe not found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch recipes." });
  }
});

const readRecipesByAuthor = async (authorName) => {
  try {
    const getRecipes = await Recipe.find({ author: authorName });
    return getRecipes;
  } catch (error) {
    throw error;
  }
};

app.get("/recipes/author/:authorName", async (req, res) => {
  try {
    const recipes = await readRecipesByAuthor(req.params.authorName);
    if (recipes.length) {
      res.json(recipes);
    } else {
      res.status(404).json({ message: "Recipe not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch recipes." });
  }
});

const readRecipesByDifficulty = async (level) => {
  try {
    const recipesByDifficulty = await Recipe.find({ difficulty: level });
    return recipesByDifficulty;
  } catch (error) {
    throw error;
  }
};

app.get("/recipes/difficulty/:levels", async (req, res) => {
  try {
    const recipes = await readRecipesByDifficulty(req.params.levels);
    if (recipes.length) {
      res.json(recipes);
    } else {
      res.status(404).json({ message: "Recipe not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch recipes." });
  }
});

const updateDifficulty = async (recipeId, dataToUpdate) => {
  try {
    const updatedData = await Recipe.findByIdAndUpdate(recipeId, dataToUpdate, {
      new: true,
    });
    return updatedData;
  } catch (error) {
    throw error;
  }
};

app.post("/recipes/:recipeId", async (req, res) => {
  try {
    const updatedRecipe = await updateDifficulty(req.params.recipeId, req.body);
    if (updatedRecipe) {
      res.status(200).json({
        message: "Recipe updated successfully",
        recipe: updatedRecipe,
      });
    } else {
      res.status(404).json({ message: "Recipe not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to update recipes." });
  }
});

const updateByTitle = async (recipeTitle, dataToUpdate) => {
  try {
    const updateTitle = await Recipe.findOneAndUpdate(
      { title: recipeTitle },
      dataToUpdate,
      { new: true }
    );
    return updateTitle;
  } catch (error) {
    throw error;
  }
};

app.post("/recipes/title/:recipeTitle", async (req, res) => {
  try {
    const updatedRecipes = await updateByTitle(
      req.params.recipeTitle,
      req.body
    );
    if (updatedRecipes) {
      res.status(201).json({
        message: "Recipes updated successfully",
        recipe: updatedRecipes,
      });
    } else {
      res.status(404).json({ message: "Recipe not found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to update recipes." });
  }
});

const deleteRecipe = async (recipeId) => {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(recipeId);
    return deletedRecipe;
  } catch (error) {
    throw error;
  }
};

app.delete("/recipes/:recipeId", async (req, res) => {
  try {
    const deletedData = await deleteRecipe(req.params.recipeId);
    if (deletedData) {
      res
        .status(200)
        .json({ message: "Recipe deleted successfully", recipe: deletedData });
    } else {
      res.status(404).json({ message: "Recipe not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete Recipe" });
  }
});

const PORT = process.env.PORT || 5500;

app.listen(PORT, () => {
  console.log("The server is running on port: ", PORT);
});
