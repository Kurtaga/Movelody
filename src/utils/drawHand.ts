// Points for fingers
const fingerJoints = {
  thumb: [0, 1, 2, 3, 4],
  indexFinger: [0, 5, 6, 7, 8],
  middleFinger: [0, 9, 10, 11, 12],
  ringFinger: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20],
};

// Infinity Gauntlet Style
const style = {
  0: { color: "#C96565", size: 18 },
  1: { color: "#C96565", size: 8 },
  2: { color: "#C96565", size: 12 },
  3: { color: "#C96565", size: 8 },
  4: { color: "#C96565", size: 8 },
  5: { color: "#C96565", size: 12 },
  6: { color: "#C96565", size: 8 },
  7: { color: "#C96565", size: 8 },
  8: { color: "#C96565", size: 8 },
  9: { color: "#C96565", size: 12 },
  10: { color: "#C96565", size: 10 },
  11: { color: "#C96565", size: 10 },
  12: { color: "#C96565", size: 10 },
  13: { color: "#C96565", size: 12 },
  14: { color: "#C96565", size: 10 },
  15: { color: "#C96565", size: 10 },
  16: { color: "#C96565", size: 10 },
  17: { color: "#C96565", size: 12 },
  18: { color: "#C96565", size: 8 },
  19: { color: "#C96565", size: 8 },
  20: { color: "#C96565", size: 8 },
};

// Drawing function
export const drawHand = (predictions, ctx) => {
  // Check if we have predictions
  if (predictions.length > 0) {
    // Loop through each prediction
    predictions.forEach((prediction) => {
      // Grab landmarks
      const landmarks = prediction.landmarks;

      // Loop through fingers
      for (let j = 0; j < Object.keys(fingerJoints).length; j++) {
        const finger = Object.keys(fingerJoints)[j];
        //  Loop through pairs of joints
        for (let k = 0; k < fingerJoints[finger].length - 1; k++) {
          // Get pairs of joints
          const firstJointIndex = fingerJoints[finger][k];
          const secondJointIndex = fingerJoints[finger][k + 1];

          // Draw path
          ctx.beginPath();
          ctx.moveTo(
            landmarks[firstJointIndex][0],
            landmarks[firstJointIndex][1]
          );
          ctx.lineTo(
            landmarks[secondJointIndex][0],
            landmarks[secondJointIndex][1]
          );
          ctx.strokeStyle = "#C96565";
          ctx.lineWidth = 10;
          // ctx.stroke();
        }
      }

      // Loop through landmarks and draw em
      for (let i = 0; i < landmarks.length; i++) {
        // Get x point
        const x = landmarks[i][0];
        // Get y point
        const y = landmarks[i][1];
        // Start drawing
        ctx.beginPath();
        ctx.arc(x, y, style[i]["size"], 0, 3 * Math.PI);

        // Set line color
        ctx.fillStyle = style[i]["color"];
        ctx.fill();
      }
    });
  }
};
