import {DeepPartial} from "ai";
import {z} from "zod";

export const recipeSchema = z.object({
  recipe: z.object({
    name: z.string().describe("Name of the recipe that the user inputted."),
    cuisine: z.string().describe("Cuisine type of the recipe."),
    difficulty: z
      .enum(["Easy", "Medium", "Hard"])
      .describe("Difficulty level of the recipe."),
    prepTime: z.number().describe("Preparation time in minutes."),
    cookTime: z.number().describe("Cooking time in minutes."),
    servings: z.number().describe("Number of servings the recipe yields."),
    ingredients: z
      .array(
        z.object({
          name: z.string().describe("Name of the ingredient."),
          amount: z.number().describe("Amount of the ingredient."),
          unit: z.string().describe("Unit of measurement for the ingredient."),
        })
      )
      .describe("List of ingredients required for the recipe."),
    preppingInstructions: z
      .array(z.string())
      .describe(
        "Detailed Step-by-step instructions for preparing ingredients before cooking."
      ),
    instructions: z
      .array(z.string())
      .describe("Detailed Step-by-step instructions for cooking the recipe."),
    tags: z
      .array(z.string())
      .describe(
        "Tags associated with the recipe (e.g., 'vegetarian', 'gluten-free')."
      ),
    nutritionalInfo: z
      .object({
        calories: z.number().describe("Calories per serving."),
        protein: z.number().describe("Protein content in grams per serving."),
        carbs: z
          .number()
          .describe("Carbohydrate content in grams per serving."),
        fat: z.number().describe("Fat content in grams per serving."),
      })
  }),
});

// Define a type for the partial notifications during generation
export type PartialRecipe = DeepPartial<typeof recipeSchema>["recipe"];

// Define a type for the complete recipe
export type Recipe = z.infer<typeof recipeSchema>["recipe"];
