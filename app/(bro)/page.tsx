/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
// @ts-nocheck

"use client";

import {ObjectIcon, VercelIcon} from "@/components/icons";
import {experimental_useObject} from "ai/react";
import {useRef, useState} from "react";
import {motion} from "framer-motion";
import {toast} from "sonner";
import Link from "next/link";
import {Recipe, recipeSchema, PartialRecipe} from "@/app/api/chat/schema";
import {sarcasticResponses} from "./responses.js";

import RecipeView from "@/components/recipeView";

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  async function validateDish(recipe) {
    try {
      const response = await fetch("/api/isValidDish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({recipe: recipe}),
      });
      const data = await response.json();
      // console.log(data.isValid);
      return data.isValid;
    } catch (error) {
      console.error("Error validating dish:", error);
      return false;
    }
  }

  const {submit, isLoading, object} = experimental_useObject({
    api: "/api/chat",
    schema: recipeSchema,
    onFinish({object}) {
      // console.log("onFinish called with object:", object);
      if (object) {
        setRecipes((prev) => [object.recipe, ...prev]);
        setInput("");
        inputRef.current?.focus();
      } else {
        console.error("Object is null or undefined");
      }
    },
    onError: (error) => {
      console.error("Error in useObject:", error);
      toast.error("An error occurred. Please try again later.");
    },
  });

  return (
    <div className="flex flex-col justify-center items-center min-h-screen h-fit bg-white dark:bg-zinc-900">
      <h1 className="text-4xl text-zinc-700 dark:text-zinc-300 py-4 font-semibold">
        Recipe Bro
      </h1>
      <div className="flex flex-col justify-between gap-4">
        <form
          className="flex flex-col gap-2 relative items-center"
          onSubmit={async (event) => {
            event.preventDefault();
            const form = event.target as HTMLFormElement;
            const input = form.elements.namedItem("recipe") as HTMLInputElement;
            if (input.value.trim()) {
              setIsValidating(true);
              const isValid = await validateDish(input.value);
              setIsValidating(false);

              if (isValid) {
                submit({recipe: input.value});
              } else {
                setInput("");
                const randomResponse =
                  sarcasticResponses[
                    Math.floor(Math.random() * sarcasticResponses.length)
                  ];
                toast.error(randomResponse);
              }
            }
          }}
        >
          <input
            name="recipe"
            className="bg-zinc-100 rounded-md px-2 py-2 w-full outline-none dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300 md:max-w-[600px] max-w-[calc(100dvw-32px)] disabled:text-zinc-400 disabled:cursor-not-allowed placeholder:text-zinc-400 mt-4"
            placeholder="Enter a recipe idea..."
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
            }}
            disabled={isLoading || isValidating}
            ref={inputRef}
          />
        </form>

        {recipes.length > 0 || isLoading ? (
          <div className="flex flex-col gap-8 min-h-screen h-full w-dvw items-center">
            {isLoading && object?.recipe && (
              <div className="opacity-75">
                <RecipeView recipe={object.recipe as PartialRecipe} />
              </div>
            )}

            {recipes.map((recipe, index) => (
              <RecipeView
                key={`recipe-${index}-${recipe.name}`}
                recipe={recipe}
              />
            ))}
          </div>
        ) : (
          <motion.div className="h-full px-4 w-full md:w-[600px] md:px-0 pt-20">
            <div className="border rounded-lg p-6 flex flex-col gap-4 text-zinc-500 dark:text-zinc-400 dark:border-zinc-700  text-lg justify-center items-center">
              <p>Enter a recipe idea and recipe bro will generate it.</p>
              <p>
                Learn more about the{" "}
                <Link
                  className="text-blue-500 dark:text-blue-400"
                  href="https://sdk.vercel.ai/docs/ai-sdk-ui/object-generation"
                  target="_blank"
                >
                  useObject{" "}
                </Link>
                hook from Vercel AI SDK.
              </p>{" "}
              <p>
                Check out the{" "}
                <Link
                  className="text-blue-500 dark:text-blue-400"
                  href="https://github.com/Abil-Shrestha/recipe-bro"
                  target="_blank"
                >
                  Source Code
                </Link>
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
