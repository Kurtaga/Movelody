import React, { useContext, useEffect, useState } from "react";
import "./Footer.css";
import pauseIcon from "../../assets/icons/pause.svg";
import playIcon from "../../assets/icons/play.svg";
import retryIcon from "../../assets/icons/retry.svg";
import {
  AppContext,
  GameStateEnum,
  SET_MELODY,
  TOGGLE_PAUSE,
} from "../AppContext/AppContext";
import { beatSampler, melodySampler } from "../../utils/synthesizerUtils";
import Loading from "../Loading/Loading";

const Footer = () => {
  const { gameState, gameStateDispatch } = useContext(AppContext);

  const [gameStateName, setGameStateName] = useState("");
  const [gameStateDescription, setGameStateDescription] = useState("");
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [transition, setTransition] = useState<boolean>(false);

  const handlePauseClick = () => {
    gameStateDispatch({ type: TOGGLE_PAUSE });
  };

  const handleRetryClick = () => {
    console.log("restarting");
    gameStateDispatch({ type: SET_MELODY });
    melodySampler.stopAllMelodies();
    melodySampler.selectMelody("");
    beatSampler.samples = [];
    beatSampler.stopAllBeats();
  };
  useEffect(() => {
    switch (gameState.current) {
      case GameStateEnum.PAUSE:
        setGameStateName("Paused");
        setGameStateDescription("Take a break");
        setProgressPercentage(0);
        setTransition(false);
        break;
      case GameStateEnum.MELODY:
        setGameStateName("Melody");
        setGameStateDescription("Choose a melody");
        setProgressPercentage(calculateProgress(GameStateEnum.MELODY));
        setTransition(false);
        break;
      case GameStateEnum.BEAT:
        setGameStateName("Beat");
        setGameStateDescription("Compose a beat");
        setProgressPercentage(calculateProgress(GameStateEnum.BEAT));
        setTransition(false);
        break;
      case GameStateEnum.LISTEN:
        setGameStateName("Dance");
        setGameStateDescription("To your creation");
        setProgressPercentage(calculateProgress(GameStateEnum.MELODY));
        setTransition(false);
        break;
      case GameStateEnum.TRANSITION:
        setTransition(true);
        setProgressPercentage(100);
        break;
      // Add cases for BEAT and LISTEN
      default:
        setGameStateName("");
        setGameStateDescription("");
        setProgressPercentage(0);
        setTransition(false);
    }
  }, [gameState, beatSampler.samples.length]);

  const calculateProgress = (state) => {
    // Calculate progress based on samples and game state
    if (state === GameStateEnum.MELODY) {
      // To do
    } else if (state === GameStateEnum.BEAT) {
      console.log(beatSampler.samples.length / beatSampler.samplesLength);
      return beatSampler.samples.length / beatSampler.samplesLength;
    }
    return 0; // Placeholder, implement your logic
  };

  return (
    <div className="footer">
      <span>
        <p className="title">{gameStateName}</p>
        <p className="description">{gameStateDescription}</p>
      </span>
      <span>
        {transition ? (
          <Loading type={GameStateEnum.TRANSITION} />
        ) : (
          <img
            src={
              gameState.current === GameStateEnum.PAUSE ? playIcon : pauseIcon
            }
            onClick={handlePauseClick}
          />
        )}
        <img src={retryIcon} onClick={handleRetryClick} className="retry" />
      </span>
      <div
        className="progress-bar"
        style={{
          width: `${progressPercentage * 100}%`,
        }}
      ></div>
    </div>
  );
};

export default Footer;
