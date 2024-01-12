import React, { useContext, useEffect, useRef, useState } from "react";
import "./Grid.css";
import { AppContext, GameStateEnum } from "../AppContext/AppContext";
import {
  calculateHandMidpoint,
  calculatePadIndex,
} from "../../utils/handUtils";

const Grid = ({ canvasRef }) => {
  const { gameState, handTrackingData } = useContext(AppContext);

  const [numberOfPads, setNumberOfPads] = useState<number>(undefined);

  const [activePads, setActivePads] = useState<number[]>([]);

  const gridRef = useRef(null);

  useEffect(() => {
    if (gameState.current !== GameStateEnum.TRANSITION) {
      processHandData();
    }
  }, [gameState, handTrackingData]);

  const processHandData = () => {
    const padIndexes = [];
    for (const hand of handTrackingData.hands) {
      if (!hand) continue;

      const handLandmark = calculateHandMidpoint(hand.landmarks);
      const padIndex = calculatePadIndex(handLandmark);
      padIndexes.push(padIndex);
    }
    setActivePads(padIndexes);
  };

  const handleSize = () => {
    // Set the canvas size to match the video element size
    const canvasElement = canvasRef.current;
    console.log(canvasElement);
    const gridElement = gridRef.current;
    if (canvasElement && gridElement) {
      console.log(canvasElement.clientWidth, canvasElement.clientHeight);
      // Now set the size of the grid element to match the displayed size of the canvas
      gridElement.style.width = canvasElement.clientWidth + "px";
      gridElement.style.height = canvasElement.clientHeight + "px";
    }
  };

  useEffect(() => {
    handleSize();
    switch (gameState.current) {
      case GameStateEnum.MELODY:
        setNumberOfPads(3);
        break;
      case GameStateEnum.BEAT:
        setNumberOfPads(9);
        break;
      case GameStateEnum.LISTEN:
        setNumberOfPads(0);
        break;
      default:
        setNumberOfPads(0);
    }
  }, [gameState, canvasRef]);

  let gridItems = [];
  if (numberOfPads === 9) {
    gridItems = [
      <div className="grid-item" style={{ backgroundColor: "#FAFAFA50" }}>
        <span
          style={{
            display: activePads.includes(0) ? "block" : "none",
          }}
        >
          {/* 👌 */}
          {/* 🔊 */}
          💨
        </span>
      </div>,
      <div className="grid-item" style={{ backgroundColor: "#BABABA50" }}>
        <span
          style={{
            display: activePads.includes(1) ? "block" : "none",
          }}
        >
          🫰
        </span>
      </div>,
      <div className="grid-item" style={{ backgroundColor: "#75737350" }}>
        <span
          style={{
            display: activePads.includes(2) ? "block" : "none",
          }}
        >
          {/* 🚪 */}
          🐋
        </span>
      </div>,
      <div className="grid-item" style={{ backgroundColor: "#D9D9D950" }}>
        <span
          style={{
            display: activePads.includes(3) ? "block" : "none",
          }}
        >
          🥁
        </span>
      </div>,
      <div className="grid-item" style={{ backgroundColor: "#93939350" }}>
        <span
          style={{
            display: activePads.includes(4) ? "block" : "none",
          }}
        >
          👏
        </span>
      </div>,
      <div className="grid-item" style={{ backgroundColor: "#46464650" }}>
        <span
          style={{
            display: activePads.includes(5) ? "block" : "none",
          }}
        >
          🔔
        </span>
      </div>,
      <div className="grid-item" style={{ backgroundColor: "#8E8B8B50" }}>
        <span
          style={{
            display: activePads.includes(6) ? "block" : "none",
          }}
        >
          {/* 🎸 */}
          💥
        </span>
      </div>,
      <div className="grid-item" style={{ backgroundColor: "#6E6D6D50" }}>
        <span
          style={{
            display: activePads.includes(7) ? "block" : "none",
          }}
        >
          🐘
        </span>
      </div>,
      <div className="grid-item" style={{ backgroundColor: "#26262650" }}>
        <span
          style={{
            display: activePads.includes(8) ? "block" : "none",
          }}
        >
          👺
        </span>
      </div>,
    ];
  } else if (numberOfPads === 3) {
    gridItems = [
      <div
        className="grid-item"
        style={{
          backgroundColor: "#D9D9D950",
        }}
      >
        <span
          style={{
            display:
              activePads.includes(0) ||
              activePads.includes(3) ||
              activePads.includes(6)
                ? "block"
                : "none",
          }}
        >
          🎈
        </span>
      </div>,
      <div className="grid-item" style={{ backgroundColor: "#93939350" }}>
        <span
          style={{
            display:
              activePads.includes(1) ||
              activePads.includes(4) ||
              activePads.includes(7)
                ? "block"
                : "none",
          }}
        >
          {/* 🕶️ */}
          {/* 🏎️ */}
          {/* 🚗 */}
          🗿
        </span>
      </div>,
      <div className="grid-item" style={{ backgroundColor: "#46464650" }}>
        <span
          style={{
            display:
              activePads.includes(2) ||
              activePads.includes(5) ||
              activePads.includes(8)
                ? "block"
                : "none",
          }}
        >
          🎉
        </span>
      </div>,
    ];
  }
  return (
    <div
      className={
        "grid " +
        (numberOfPads == 9 ? "grid9 " : "grid3 ") +
        (gameState.current !== GameStateEnum.TRANSITION ? "beat" : "")
      }
      ref={gridRef}
    >
      {gridItems}
    </div>
  );
};

export default Grid;
