import { useContext } from "react";
import { AppContext, GameStateEnum } from "../AppContext/AppContext";
import "./Loading.css";

const Loading = ({ type }: { type: GameStateEnum }) => {
  const { gameState } = useContext(AppContext);

  return (
    gameState.current == type && (
      <div className={type == GameStateEnum.LOADING && "loading"}>
        <div
          className="loader"
          style={{
            border:
              type == GameStateEnum.LOADING
                ? "7px solid var(--primary)"
                : "7px solid var(--fourth)",
            borderTop:
              type == GameStateEnum.LOADING
                ? "7px solid transparent"
                : "7px solid transparent",
            borderLeft:
              type == GameStateEnum.LOADING
                ? "7px solid transparent"
                : "7px solid transparent",
          }}
        ></div>
      </div>
    )
  );
};

export default Loading;
