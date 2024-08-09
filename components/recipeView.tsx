//@ts-nocheck
import {motion} from "framer-motion";
import {Recipe, recipeSchema, PartialRecipe} from "@/app/api/chat/schema";

const isAnyFieldMissing = (recipe: any): boolean => {
  const requiredFields = [
    "name",
    "cuisine",
    "difficulty",
    "prepTime",
    "cookTime",
    "servings",
    "ingredients",
    "preppingInstructions",
    "instructions",
    "tags",
  ];

  for (const field of requiredFields) {
    if (recipe[field] === undefined || recipe[field] === null) {
      return true;
    }
  }

  // Check ingredients array
  if (Array.isArray(recipe.ingredients)) {
    for (const ingredient of recipe.ingredients) {
      if (!ingredient.name || !ingredient.amount || !ingredient.unit) {
        return true;
      }
    }
  } else {
    return true;
  }

  return false;
};

const RecipeView = ({recipe}: {recipe: Recipe | PartialRecipe}) => {
  //dont need this cuz we're streaming partial data too but just keeping it here if i need it for later
  // if (recipe === null || isAnyFieldMissing(recipe)) {
  //   return <h1>Putting it all together...</h1>;
  // }

  return (
    <motion.div
      className="flex flex-col gap-4 px-4 w-full md:w-[600px] h-fit md:px-0 dark:bg-zinc-800 bg-zinc-200 rounded-lg"
      initial={{opacity: 0.7}}
      animate={{opacity: 1}}
      transition={{
        duration: 0.4,
      }}
    >
      <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-200 p-2 items-start flex justify-center">
        {recipe?.name || "Untitled Recipe"}
      </h2>
      <div className="flex flex-row items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400 justify-center bg-zinc-300 dark:bg-zinc-700 font-semibold rounded-lg p-4">
        <span>{recipe.cuisine || "Unknown"} Cuisine</span>
        <span>Difficulty: {recipe.difficulty || "N/A"}</span>
        <span>Prep: {recipe.prepTime || "N/A"} min</span>
        <span>Cook: {recipe.cookTime || "N/A"} min</span>
        <span>Serves: {recipe.servings || "N/A"}</span>
      </div>
      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <div className="px-4">
          <h3 className="text-lg font-semibold mb-2 text-zinc-800 dark:text-zinc-200">
            Ingredients:
          </h3>
          <ul className="list-disc list-inside">
            {recipe.ingredients.map((ingredient, index) => (
              <li
                key={`ingredient-${index}-${ingredient.name}`}
                className="text-zinc-700 dark:text-zinc-300"
              >
                {ingredient?.amount} {ingredient?.unit} {ingredient?.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      {recipe.preppingInstructions &&
        recipe.preppingInstructions.length > 0 && (
          <div className="px-4">
            <h3 className="text-lg font-semibold mb-2 text-zinc-800 dark:text-zinc-200">
              Prep Instructions:
            </h3>
            <ol className="list-decimal list-inside">
              {recipe.preppingInstructions.map((prepInstruction, index) => (
                <li
                  key={`prep-${index}`}
                  className="text-zinc-700 dark:text-zinc-300 mb-2"
                >
                  {prepInstruction}
                </li>
              ))}
            </ol>
          </div>
        )}
      {recipe.instructions && recipe.instructions.length > 0 && (
        <div className="px-4">
          <h3 className="text-lg font-semibold mb-2 text-zinc-800 dark:text-zinc-200">
            Instructions:
          </h3>
          <ol className="list-decimal list-inside">
            {recipe.instructions.map((instruction, index) => (
              <li
                key={`instruction-${index}`}
                className="text-zinc-700 dark:text-zinc-300 mb-2"
              >
                {instruction}
              </li>
            ))}
          </ol>
        </div>
      )}
      {recipe.tags && recipe.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 p-4">
          {recipe.tags.map((tag, index) => (
            <span
              key={`tag-${index}-${tag}`}
              className="bg-zinc-300 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 px-2 py-1 rounded-md text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      {recipe.nutritionalInfo && (
        <div className="px-4">
          <h3 className="text-lg font-semibold mb-2 text-zinc-800 dark:text-zinc-200">
            Nutritional Info (per serving):
          </h3>
          <div className="flex flex-row gap-4 text-sm text-zinc-600 dark:text-zinc-400 pb-8">
            <span>Calories: {recipe.nutritionalInfo.calories || "N/A"}</span>
            <span>Protein: {recipe.nutritionalInfo.protein || "N/A"}g</span>
            <span>Carbs: {recipe.nutritionalInfo.carbs || "N/A"}g</span>
            <span>Fat: {recipe.nutritionalInfo.fat || "N/A"}g</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default RecipeView;
