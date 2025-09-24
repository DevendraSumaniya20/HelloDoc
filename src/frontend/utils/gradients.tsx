// gradientUtils.ts

import Colors from "../constants/color";


// Define gradient combinations using theme colors
export const gradientColors: string[][] = [
  [Colors.primary, Colors.link],
  
];

// Returns a random gradient from the array
export const getRandomGradient = (): string[] => {
  const index = Math.floor(Math.random() * gradientColors.length);
  return gradientColors[index];
};

// Returns gradient props for use in components
export const getGradientProps = (
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 }
) => ({
  colors: getRandomGradient(),
  start,
  end,
});
