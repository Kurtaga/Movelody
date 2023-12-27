import React, { ReactNode, useReducer, useRef, useState } from "react";
import {
  AppContext,
  GameStateEnum,
  GameStateAction,
  HandTrackingAction,
  HandTrackingData,
  SET_HANDS,
  TOGGLE_PAUSE,
  STOP_LOADING,
  SET_MELODY,
  SET_BEAT,
  SET_LISTEN,
  SET_STATE_AFTER_TRANSITION,
  SET_TRANSITION,
  GameState,
  BaseSampleAction,
  ADD_SAMPLE,
} from "../AppContext/AppContext"; // Adjust the import path as needed
import { ToneAudioNode } from "tone";

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Reducer function to manage game state transitions
  function gameStateReducer(
    state: GameState,
    action: GameStateAction
  ): GameState {
    switch (action.type) {
      case TOGGLE_PAUSE:
        if (state.current === GameStateEnum.PAUSE) {
          // If the game is paused, unpause it and set the state back to previousState
          return { current: state.previous, previous: GameStateEnum.PAUSE };
        } else {
          // If the game is not paused, pause it and remember the current state
          return { current: GameStateEnum.PAUSE, previous: state.current };
        }
      case STOP_LOADING:
        return { current: GameStateEnum.MELODY, previous: state.current };
      case SET_MELODY:
        return { current: GameStateEnum.MELODY, previous: state.current };
      case SET_BEAT:
        return { current: GameStateEnum.BEAT, previous: state.current };
      case SET_LISTEN:
        return { current: GameStateEnum.LISTEN, previous: state.current };
      case SET_TRANSITION:
        return { current: GameStateEnum.TRANSITION, previous: state.current };
      case SET_STATE_AFTER_TRANSITION:
        return { current: action.payload, previous: state.current };
      default:
        return state;
    }
  }

  // Action to set loading state
  const setLoading = () => {
    return { type: SET_TRANSITION };
  };

  // Thunk action to handle state transition with loading
  const changeStateWithLoading = (newState: GameStateEnum) => {
    gameStateDispatch(setLoading());

    setTimeout(() => {
      gameStateDispatch({
        type: SET_STATE_AFTER_TRANSITION,
        payload: newState,
      });
    }, 1000); // 1 seconds loading delay
  };

  // Reducer function to manage hand tracking state transitions
  function handTrackingReducer(
    state: HandTrackingData,
    action: HandTrackingAction
  ): HandTrackingData {
    switch (action.type) {
      case SET_HANDS:
        return { hands: action.payload };
      default:
        return state;
    }
  }

  // Reducer function to manage hand tracking state transitions
  function baseSamplesReducer(
    state: string[],
    action: BaseSampleAction
  ): string[] {
    switch (action.type) {
      case ADD_SAMPLE:
        return [...state, action.payload];
      default:
        return state;
    }
  }

  // State for FFT data
  const [fftData, setFftData] = useState<Float32Array>();
  const [handTrackingData, handTrackingDispatch] = useReducer(
    handTrackingReducer,
    {
      hands: [],
    }
  );
  const [gameState, gameStateDispatch] = useReducer(gameStateReducer, {
    current: GameStateEnum.LOADING,
    previous: GameStateEnum.LOADING,
  });
  const [logs, setLogs] = useState<string[]>([]);
  const lineOut = useRef<ToneAudioNode>(undefined);
  const [baseSamples, baseSamplesDispatch] = useReducer(baseSamplesReducer, []);
  const [baseIndex, setBaseIndex] = useState<number>(0);

  // Provide both the FFT data and the updater function to the context
  return (
    <AppContext.Provider
      value={{
        fftData,
        setFftData,
        handTrackingData,
        handTrackingDispatch,
        logs,
        setLogs,
        lineOut,
        gameState,
        gameStateDispatch,
        baseSamples,
        baseSamplesDispatch,
        baseIndex,
        setBaseIndex,
        changeStateWithLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
