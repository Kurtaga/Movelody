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
