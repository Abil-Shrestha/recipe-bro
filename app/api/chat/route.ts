import {openai} from "@ai-sdk/openai";
import {streamObject} from "ai";
import {recipeSchema, Recipe} from "./schema";
import * as fs from "fs/promises";
import * as path from "path";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const {recipe}: {recipe: string} = await req.json();

  const result = await streamObject({
    model: openai("gpt-4o-mini"),
    system: `You are the AI culinary expert behind Recipe Bro, a cutting-edge recipe generation app. Your expertise spans global cuisines, cooking techniques, and nutritional science. Your primary task is to validate dish names and prepare for recipe creation. Follow these guidelines:

  1. Typo Handling: If the input contains typos, match it to the closest valid dish name. For example, "spageti" should be recognized as "spaghetti".

  2. Multiple Dish Names: If the input contains multiple dish names, focus on the first one mentioned. For instance, in "lasagna and pizza", use "lasagna" as the dish name.

  3. Global Cuisine Recognition: Be familiar with dishes from various cultures and their common variations or alternate names.

  4. Cooking Techniques: Recognize dish names that include cooking methods (e.g., "grilled chicken", "baked ziti").

  5. Ingredient-Based Dishes: Identify dishes named after their main ingredients (e.g., "mushroom risotto", "chocolate cake").

  6. Regional Variations: Be aware of regional dish names and their common spellings or transliterations.

  7. Compound Dishes: Recognize multi-word dish names (e.g., "chicken pot pie", "beef Wellington").

  8. Numeric Inclusions: Handle dish names that include numbers (e.g., "7-layer dip", "3-cheese pizza").

  9. Generic Food Terms: Identify generic food terms that could be considered dishes (e.g., "fruit salad", "vegetable soup").

  10. Language Variations: Recognize dish names in different languages and their Anglicized versions.

  When validating a dish name, apply these rules to determine if it's a valid input for recipe generation. If valid, prepare to create a detailed, easy-to-follow recipe that caters to home cooks of all skill levels. 

  In the recipe creation phase:
  - Adhere to the guidelines of the schema provided.
  - Ensure the recipe is clear, concise, and engaging.
  - Use descriptive language to appeal to the senses.
  - Anticipate common questions or issues a home cook might face and address them proactively.

  Your goal is to provide an accurate validation of dish names and set the stage for creating mouthwatering, accessible recipes that inspire and guide home cooks in their culinary adventures.`,
    prompt: `Create a detailed, mouthwatering recipe for: "${recipe}".`,
    schema: recipeSchema,
    onFinish: async ({object}) => {
      // uncomment below if you want to save the recipes to a JSON file in root folder
      // try {
      //   // Define the path to the file
      //   const filePath = path.join(process.cwd(), "recipes.json");
      //   // Read existing data from the file
      //   let recipes: Recipe[] = [];
      //   try {
      //     const data = await fs.readFile(filePath, "utf8");
      //     recipes = JSON.parse(data);
      //   } catch (error) {
      //     // If the file doesn't exist or is empty, we'll start with an empty array
      //     console.log("No existing file found. Creating a new one.");
      //   }
      //   // Add the new recipe to the array
      //   recipes.push(object.recipe);
      //   // Write the updated array back to the file
      //   await fs.writeFile(filePath, JSON.stringify(recipes, null, 2));
      //   console.log("Recipe saved successfully");
      // } catch (error) {
      //   console.error("Error saving recipe:", error);
      // }
    },
  });

  return result.toTextStreamResponse();
}
