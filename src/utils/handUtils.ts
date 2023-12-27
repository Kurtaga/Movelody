import { Landmark } from "src/components/AppContext/AppContext";

export const calculateHandMidpoint = (landmarks: Landmark[]): Landmark => {
  if (landmarks.length === 0) {
    return { x: 0, y: 0, z: 0 }; // Return a default value if there are no landmarks
  }

  let sumX = 0;
  let sumY = 0;
  let sumZ = 0;

  for (const landmark of landmarks) {
    sumX += landmark.x;
    sumY += landmark.y;
    sumZ += landmark.z;
  }

  return {
    x: 1 - sumX / landmarks.length,
    y: 1 - sumY / landmarks.length,
    z: sumZ / landmarks.length,
  };
};

export const calculatePadIndex = (midpoint: Landmark): number => {
  // Determine the grid size (1/3 of the view for both x and y)
  const gridSize = 1 / 3;

  // Calculate the index of the grid based on the midpoint
  // Floor the result to get the index in a 0-indexed system
  const xIndex = Math.floor(midpoint.x / gridSize);
  const yIndex = Math.floor((1 - midpoint.y) / gridSize);

  // Return the pad index from 0 to 8 (9 pads in total)
  // Row-major order calculation (y * number_of_columns + x)
  return yIndex * 3 + xIndex;
};
