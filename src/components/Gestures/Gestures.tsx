import { useContext } from "react";
import "./Gestures.css";
import { AppContext, Hand, HandTrackingData } from "../AppContext/AppContext";

interface GestureProps {
  filename: string;
  description: string;
}
const gestures: Map<string, GestureProps> = new Map([
  [
    "Open_Palm",
    {
      filename: "open_palm_transparent.png",
      description: "None",
    },
  ],
  [
    "Closed_Fist",
    {
      filename: "closed_fist_transparent.png",
      description: "Select",
    },
  ],
  [
    "Pointing_Up",
    {
      filename: "pointing_up_transparent.png",
      description: "Preview",
    },
  ],
  [
    "Victory",
    {
      filename: "victory_transparent.png",
      description: "Pause",
    },
  ],
  [
    "ILoveYou",
    {
      filename: "i_love_you_transparent.png",
      description: "None",
    },
  ],
  //   [
  // "Thumb_Up",
  // {
  //   filename: "thumb_up_transparent.png",
  //   description: "Confirm",
  // },
  //   ],
  //   [
  //     "Thumb_Down",
  //     {
  //       filename: "thumb_down_transparent.png",
  //       description: "None",
  //     },
  //   ],
]);

const checkIfGestureActive = (
  gestureName: string,
  handTracking: HandTrackingData
): boolean => {
  return handTracking.hands.some((hand: Hand) => {
    if (hand.gestureName == gestureName) {
      return true;
    }
    return false;
  });
};

const Gestures = ({ gesturesRef }) => {
  const { handTrackingData } = useContext(AppContext);
  return (
    <div className="gestures" ref={gesturesRef}>
      {Array.from(gestures.entries()).map(([gesture, props]) => {
        const isGestureActive = checkIfGestureActive(gesture, handTrackingData);
        return (
          <div
            key={gesture}
            className={
              `gesture shadow ${gesture} ` + (isGestureActive ? "active" : "")
            }
            style={{
              display: isGestureActive ? "flex" : "none",
            }}
          >
            <img
              src={`src/assets/gestures/${props.filename}`}
              //   style={{ opacity: isGestureActive ? 1 : 1 }}
            />
            <p>{props.description}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Gestures;
