import React, { useContext, useEffect, useRef, useState } from "react";
import "./Grid.css";
import { AppContext, GameStateEnum } from "../AppContext/AppContext";

const Grid = ({ canvasRef }) => {
  const { gameState } = useContext(AppContext);

  const [numberOfPads, setNumberOfPads] = useState<number>(undefined);
  const gridRef = useRef(null);

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
      <div className="grid-item" style={{ backgroundColor: "#FAFAFA" }}></div>,
      <div className="grid-item" style={{ backgroundColor: "#BABABA" }}></div>,
      <div className="grid-item" style={{ backgroundColor: "#757373" }}></div>,
      <div className="grid-item" style={{ backgroundColor: "#D9D9D9" }}></div>,
      <div className="grid-item" style={{ backgroundColor: "#939393" }}></div>,
      <div className="grid-item" style={{ backgroundColor: "#464646" }}></div>,
      <div className="grid-item" style={{ backgroundColor: "#8E8B8B" }}></div>,
      <div className="grid-item" style={{ backgroundColor: "#6E6D6D" }}></div>,
      <div className="grid-item" style={{ backgroundColor: "#262626" }}></div>,
    ];
  } else if (numberOfPads === 3) {
    gridItems = [
      <div className="grid-item" style={{ backgroundColor: "#D9D9D9" }}></div>,
      <div className="grid-item" style={{ backgroundColor: "#939393" }}></div>,
      <div className="grid-item" style={{ backgroundColor: "#464646" }}></div>,
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
