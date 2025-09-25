// gradientUtils.ts

export const gradientColors: string[][] = [
  ['#4facfe', '#00f2fe'], // Blue → Teal
];

// 🔹 Returns a random gradient from the array
export const getRandomGradient = (): string[] => {
  const index = Math.floor(Math.random() * gradientColors.length);
  return gradientColors[index];
};

// 🔹 Returns gradient props for <LinearGradient />
export const getGradientProps = (
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
) => ({
  colors: getRandomGradient(),
  start,
  end,
});
