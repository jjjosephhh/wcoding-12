import { useEffect, useState } from "react";
import "./App.css";

const serverUrl = "https://ea73-211-200-12-206.ngrok.io";
const App = () => {
  const [recipeName, setRecipeName] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState({});

  const [ingredient, setIngredient] = useState("");

  const [selectedRecipe, setSelectedRecipe] = useState("");

  const addIngredient = (event) => {
    event.preventDefault();
    if (!ingredient) return alert("Please type in an ingredient");
    const currentIngredients = ingredients[selectedRecipe] ?? [];
    currentIngredients.push(ingredient);
    setIngredients({
      ...ingredients,
      [selectedRecipe]: currentIngredients,
    });
  };

  const getRecipes = async () => {
    const response = await fetch(`${serverUrl}/recipes`);
    const { recipes: _recipes } = await response.json();
    setRecipes(_recipes);
  };

  useEffect(() => {
    getRecipes();
  }, []);

  const createRecipe = async (event) => {
    event.preventDefault();
    if (!recipeName) return alert("Please input a recipe name");
    // Send a HTTP POST request containing
    // the recipe data to the server
    const data = { name: recipeName };
    const response = await fetch(`${serverUrl}/recipes`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    const responseJson = await response.json();
    setRecipes(responseJson.recipes);
  };

  const deleteRecipe = async (id) => {
    const response = await fetch(`${serverUrl}/recipes/${id}`, {
      method: "DELETE",
    });
    const responseJson = await response.json();
    setRecipes(responseJson.recipes);
  };

  return (
    <div className="pure-g">
      <div className="pure-u-1-2">
        <div className="recipe-section">
          <h1>Recipes</h1>

          <form onSubmit={createRecipe} className="pure-form pure-form-stacked">
            <fieldset>
              <legend>My Recipe Management System</legend>
              <label htmlFor="recipe-name">Recipe Name</label>
              <input
                value={recipeName}
                onChange={(event) => {
                  const value = event.target.value;
                  setRecipeName(value);
                }}
                type="text"
                id="recipe-name"
                placeholder="Enter a recipe name"
              />
              <br />
              <button type="submit" className="pure-button pure-button-primary">
                Create Recipe
              </button>
            </fieldset>
          </form>

          {recipes.map((recipe) => {
            return (
              <table
                className="pure-table my-table"
                key={`list-item-${recipe.id}`}
              >
                <thead>
                  <tr>
                    <th>Recipe Name</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      onClick={() => {
                        setSelectedRecipe(recipe.id);
                      }}
                    >
                      {recipe.name}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <button
                        onClick={() => {
                          deleteRecipe(recipe.id);
                        }}
                        className="button-error pure-button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            );
          })}
        </div>
      </div>

      {selectedRecipe && (
        <div className="pure-u-1-2">
          <div className="recipe-section">
            <h1>Ingredients</h1>
            <form
              onSubmit={addIngredient}
              className="pure-form pure-form-stacked"
            >
              <fieldset>
                <legend>Ingredient Manager</legend>
                <label htmlFor="ingredient-name">Ingredient Name</label>
                <input
                  value={ingredient}
                  onChange={(event) => {
                    const value = event.target.value;
                    setIngredient(value);
                  }}
                  type="text"
                  id="ingredient-name"
                  placeholder="Enter a ingredient name"
                />
                <br />
                <button
                  type="submit"
                  className="pure-button pure-button-primary"
                >
                  Add Ingredient
                </button>
              </fieldset>
            </form>

            <ul>
              {ingredients[selectedRecipe]?.map((ingr, index) => {
                return <li key={`${ingr}-${index}`}>{ingr}</li>;
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
