import React, { ReactNode, useReducer, useRef, useState } from "react";
import {
  AppContext,
  HandTrackingAction,
  HandTrackingData,
  SET_HANDS,
} from "../AppContext/AppContext"; // Adjust the import path as needed
import { ToneAudioNode } from "tone";

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
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

  // State for FFT data
  const [fftData, setFftData] = useState<Float32Array>();
  const [handTrackingData, handTrackingDispatch] = useReducer(
    handTrackingReducer,
    {
      hands: [],
    }
  );
  const [logs, setLogs] = useState<string[]>([]);
  const [paused, setPaused] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const lineOut = useRef<ToneAudioNode>(undefined);

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
        paused,
        setPaused,
        lineOut,
        loading,
        setLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
