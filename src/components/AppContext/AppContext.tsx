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

export interface GameStateAction {
  type: string;
  payload?: GameStateEnum;
}

export const TOGGLE_PAUSE = "TOGGLE_PAUSE";
export const STOP_LOADING = "STOP_LOADING";
export const SET_MELODY = "SET_BASE";
export const SET_BEAT = "SET_PLAY";
export const SET_LISTEN = "SET_LISTEN";
export const SET_STATE_AFTER_TRANSITION = "SET_STATE_AFTER_TRANSITION";
export const SET_TRANSITION = "SET_TRANSITION";

export enum GameStateEnum {
  LOADING = "LOADING",
  PAUSE = "PAUSE",
  MELODY = "MELODY",
  BEAT = "BEAT",
  LISTEN = "LISTEN",
  TRANSITION = "TRANSITION",
}

export interface GameState {
  current: GameStateEnum;
  previous: GameStateEnum;
}

export interface BaseSampleAction {
  type: string;
  payload?: string;
}

export const ADD_SAMPLE = "ADD_SAMPLE";

export const BASE_SAMPLES_LENGTH = 6;

// Define the shape of the context data, including FFT data
interface AppContextInterface {
  fftData: Float32Array | undefined;
  setFftData: (fftArray: Float32Array) => void;
  handTrackingData: HandTrackingData;
  handTrackingDispatch: Dispatch<HandTrackingAction>;
  logs: string[];
  setLogs: (logs: string[]) => void;
  lineOut: React.MutableRefObject<ToneAudioNode>;
  gameState: GameState;
  gameStateDispatch: Dispatch<GameStateAction>;
  baseSamples: string[];
  baseSamplesDispatch: Dispatch<BaseSampleAction>;
  baseIndex: number;
  setBaseIndex: (baseIndex: number) => void;
  changeStateWithLoading: (newState: GameStateEnum) => void;
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
  lineOut: undefined,
  gameState: {
    current: GameStateEnum.LOADING,
    previous: GameStateEnum.LOADING,
  },
  gameStateDispatch: () => {},
  baseSamples: [],
  baseSamplesDispatch: () => {},
  baseIndex: 0,
  setBaseIndex: () => {},
  changeStateWithLoading: () => {},
});
