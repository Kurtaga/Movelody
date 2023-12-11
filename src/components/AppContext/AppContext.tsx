import { createContext } from "react";

// Define the shape of the context data, including FFT data
interface AppContextInterface {
  fftData: Float32Array | undefined;
  setFftData: (fftArray: Float32Array) => void;
  palmPosition: number;
  setPalmPosition: (palmPosition: number) => void;
  logs: string[];
  setLogs: (logs: string[]) => void;
  paused: boolean;
  setPaused: (loading: boolean) => void;
}

// Create the context with default values
export const AppContext = createContext<AppContextInterface>({
  fftData: undefined,
  setFftData: () => {},
  palmPosition: 0,
  setPalmPosition: () => {},
  logs: [],
  setLogs: () => {},
  paused: false,
  setPaused: () => {},
});
