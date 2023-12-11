import { Dispatch, createContext } from "react";
import { ToneAudioNode } from "tone";

export interface Landmark {
  x: number;
  y: number;
  z: number;
}

export interface Hand {
  gestureName: string;
  confidence: number;
  landmarks: Landmark[];
}

export interface HandTrackingData {
  hands: (Hand | undefined)[];
}

// Define action types for hand tracking
export const SET_HANDS = "SET_HANDS";

// Define the shape of the action for hand tracking
export type HandTrackingAction = {
  type: typeof SET_HANDS;
  payload: Hand[];
};

// Define the shape of the context data, including FFT data
interface AppContextInterface {
  fftData: Float32Array | undefined;
  setFftData: (fftArray: Float32Array) => void;
  handTrackingData: HandTrackingData;
  handTrackingDispatch: Dispatch<HandTrackingAction>;
  logs: string[];
  setLogs: (logs: string[]) => void;
  paused: boolean;
  setPaused: (loading: boolean) => void;
  lineOut: React.MutableRefObject<ToneAudioNode>;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

// Create the context with default values
export const AppContext = createContext<AppContextInterface>({
  fftData: undefined,
  setFftData: () => {},
  handTrackingData: {
    hands: [],
  },
  handTrackingDispatch: () => {},
  logs: [],
  setLogs: () => {},
  paused: false,
  setPaused: () => {},
  lineOut: undefined,
  loading: true,
  setLoading: () => {},
});
