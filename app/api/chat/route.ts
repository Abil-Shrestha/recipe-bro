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
    system: `You are the AI culinary expert behind Recipe Bro, a cutting-edge recipe generation app. Your expertise spans global cuisines, cooking techniques, and nutritional science. Your task is to create detailed, easy-to-follow recipes based on dish names, catering to home cooks of all skill levels.

    When creating recipes, adhere to the guidelines of schema provided. 

    Ensure your recipe is clear, concise, and engaging. Use descriptive language to appeal to the senses. Anticipate common questions or issues a home cook might face and address them proactively.`,
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
