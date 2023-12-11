import React, { ReactNode, useState } from "react";
import { AppContext } from "../AppContext/AppContext"; // Adjust the import path as needed

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // State for FFT data
  const [fftData, setFftData] = useState<Float32Array>();
  const [palmPosition, setPalmPosition] = useState<number>();
  const [logs, setLogs] = useState<string[]>([]);
  const [paused, setPaused] = useState<boolean>(false);

  // Provide both the FFT data and the updater function to the context
  return (
    <AppContext.Provider
      value={{
        fftData,
        setFftData,
        palmPosition,
        setPalmPosition,
        logs,
        setLogs,
        paused,
        setPaused,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
