import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

let gradientCount = 0;

export const getRandomGradient = () => {
  const colors = [
    ["#99f2c8", "#1f4037"],
    ["#fc4a1a", "#f7b733"],
    ["#ff4b1f", "#1fddff"],
    ["#7F00FF", "#E100FF"],
    ["#ee0979", "#ff6a00"],
  ];

  return colors[gradientCount++ % colors.length];
};
