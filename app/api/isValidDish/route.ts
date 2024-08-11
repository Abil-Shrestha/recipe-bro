import {openai} from "@ai-sdk/openai";
import {generateObject} from "ai";
import {z} from "zod";

export async function POST(req: Request) {
  const {recipe}: {recipe: string} = await req.json();

  const result = await generateObject({
    model: openai("gpt-4o-mini"),
    system: `You are the Recipe Validator, a critical component of Recipe Bro, a cutting-edge recipe generation app. Your expertise is crucial for Recipe Bro's success. Your responsibility is to determine whether a given input can be reasonably interpreted as a valid dish name for recipe generation. Consider the following guidelines:

1. Recognize common dishes from various cuisines worldwide.
2. Handle misspellings, typos, and minor variations (e.g., "spagetti" for "spaghetti").
3. Identify valid dish names within inputs that contain extra characters (e.g., "sushi1111" is valid due to "sushi").
4. Understand dish names with numbers (e.g., "7-layer dip" or "3-cheese pizza").
5. Recognize dish names in different languages and their Anglicized versions.
6. Handle inputs with extra spaces or punctuation (e.g., "chicken   parmesan!" is valid).
7. Identify generic food terms that could be dishes (e.g., "grilled vegetables").
8. Be aware of regional dish names and variations.
9. Recognize dish names that include cooking methods (e.g., "baked alaska", "stir-fried noodles").
10. Handle inputs where the dish name is part of a longer phrase (e.g., "I want lasagna for dinner" is valid due to "lasagna").

If the input contains any identifiable dish name or can be reasonably interpreted as a culinary creation, consider it valid. Only return false for inputs that are clearly not related to food or dishes (e.g., "automobile", "12345", "xyz").

Your task is to analyze the input thoroughly and respond with a boolean value: true if it can be used to generate a recipe, false otherwise.`,
    schemaName: "isDishValid",
    schemaDescription: "Determine if the input is a valid dish name",
    schema: z.object({
      isValid: z.boolean().describe("Whether the input is a valid dish name"),
    }),
    prompt: `Is "${recipe}" a valid dish name? Can you generate recipe for this ? Respond with only a boolean value.`,
  });
  return result.toJsonResponse();
}
