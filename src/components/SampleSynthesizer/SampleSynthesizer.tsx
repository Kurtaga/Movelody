import { useContext, useEffect, useRef, useState } from "react";
import {
  AppContext,
  GameStateEnum,
  SET_MELODY,
  TOGGLE_PAUSE,
  // SET_BEAT,
  // SET_LISTEN,
} from "../AppContext/AppContext.tsx";
import {
  calculateHandMidpoint,
  calculatePadIndex,
} from "../../utils/handUtils.ts";
import * as Tone from "tone";
import { beatSampler, melodySampler } from "../../utils/synthesizerUtils.ts";

const TEMPO = 1000;
const FFT_UPDATE_RATE = 1000 / 30; // Update 16 times per second
const PAD_TO_MELODY = {
  0: "C2",
  1: "D2",
  2: "E2",
  3: "C2",
  4: "D2",
  5: "E2",
  6: "C2",
  7: "D2",
  8: "E2",
};

const PAD_TO_BEAT = {
  0: "C2",
  1: "D2",
  2: "E2",
  3: "F2",
  4: "G2",
  5: "A2",
  6: "B2",
  7: "C3",
  8: "D3",
};

const triggerHeartbeatAnimation = () => {
  // Add class to element to start animation and then remove it
  const element = document.querySelector(".grid");
  element.classList.remove("beat");
  element.classList.add("beat");
  // setTimeout(() => element.classList.remove("beat"), 1000);
};

const useInterval = (callback: () => void, delay: number | null) => {
  // Explicitly type the ref as a function or null
  const savedCallback = useRef<(() => void) | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

const useFFT = (melodySampler, beatSampler, setFftData, areSamplersReady) => {
  const fftRef = useRef(new Tone.Analyser("fft", 64));

  useEffect(() => {
    if (areSamplersReady) {
      melodySampler.sampler.connect(fftRef.current);
      beatSampler.sampler.connect(fftRef.current);

      const intervalId = setInterval(() => {
        if (fftRef.current) {
          const fftValues = fftRef.current.getValue();
          setFftData(fftValues);
        }
      }, FFT_UPDATE_RATE);

      return () => {
        clearInterval(intervalId);
        fftRef.current.dispose();
        melodySampler.sampler.disconnect(fftRef.current);
        beatSampler.sampler.disconnect(fftRef.current);
      };
    }
  }, [setFftData, melodySampler, beatSampler, areSamplersReady]);

  return fftRef;
};
const SampleSynthesizer = () => {
  const {
    setFftData,
    handTrackingData,
    gameState,
    gameStateDispatch,
    baseSamples,
    changeStateWithLoading,
    // baseSamplesDispatch,
  } = useContext(AppContext);

  const gameStateRef = useRef(gameState);
  const baseSamplesRef = useRef(baseSamples);
  const [areSamplersReady, setAreSamplersReady] = useState(false);

  useEffect(() => {
    // Set up the interval for heartbeat animation and gesture recognition
    const intervalId = setInterval(() => {
      // Trigger the CSS animation
    }, 1000); // every 1 second

    triggerHeartbeatAnimation();

    return () => {
      clearInterval(intervalId); // Clear interval on component unmount
    };
  }, []);

  // Assume that the sampler has a 'loaded' property which is a boolean
  useEffect(() => {
    // This effect will run whenever the 'loaded' property changes
    if (melodySampler.loaded && beatSampler.loaded) {
      setAreSamplersReady(true);
    }
  }, [melodySampler.loaded, beatSampler.loaded]); // Dependency on the 'loaded' property of the sampler

  useEffect(() => {
    if (beatSampler.samples.length >= beatSampler.samplesLength) {
      changeStateWithLoading(GameStateEnum.LISTEN);
      // gameStateDispatch({ type: SET_LISTEN });
      beatSampler.startSelectedBeats();
    }
  }, [beatSampler.samples.length]);

  useFFT(melodySampler, beatSampler, setFftData, areSamplersReady);

  useEffect(() => {
    gameStateRef.current = gameState;

    console.log(gameState);

    if (gameState.current === GameStateEnum.PAUSE) {
      melodySampler.pauseMelody();
      beatSampler.pauseBeats();
    } else if (gameState.previous === GameStateEnum.PAUSE) {
      console.log("resuming");
      melodySampler.resumeMelody();
      beatSampler.resumeBeats();
    }

    if (gameState.current != GameStateEnum.TRANSITION) {
      const element = document.querySelector(".grid");
      if (!element.classList.contains("beat")) {
        element.classList.add("beat");
      }
    }
  }, [gameState]);

  useEffect(() => {
    baseSamplesRef.current = baseSamples;
  }, [baseSamples]);

  const processHandData = () => {
    if (handTrackingData.hands.length == 0) {
      if (gameStateRef.current.current === GameStateEnum.MELODY) {
        melodySampler.stopAllMelodies();
      }
    }

    for (const hand of handTrackingData.hands) {
      console.log(hand);
      if (!hand) continue;

      const handLandmark = calculateHandMidpoint(hand.landmarks);
      const padIndex = calculatePadIndex(handLandmark);
      handleGesture(hand.gestureName, padIndex);
    }
  };

  const handleGesture = (gesture, padIndex) => {
    const melodySample = PAD_TO_MELODY[padIndex];
    const beatSample = PAD_TO_BEAT[padIndex];

    switch (gesture) {
      case "Victory":
        gameStateDispatch({ type: TOGGLE_PAUSE });
        break;
      case "Pointing_Up":
        if (gameStateRef.current.current === GameStateEnum.MELODY) {
          melodySampler.playOnce(melodySample);
        } else if (gameStateRef.current.current === GameStateEnum.BEAT) {
          beatSampler.playOnce(beatSample);
        }
        break;
      case "Closed_Fist":
        if (gameStateRef.current.current === GameStateEnum.MELODY) {
          melodySampler.selectMelody(melodySample);
          melodySampler.startSelectedMelody();
          changeStateWithLoading(GameStateEnum.BEAT);
          // gameStateDispatch({ type: SET_BEAT });
        } else if (gameStateRef.current.current === GameStateEnum.BEAT) {
          beatSampler.playOnce(beatSample);
          beatSampler.selectBeat(beatSample);
        }
        break;
      case "ILoveYou":
        console.log("restarting");
        gameStateDispatch({ type: SET_MELODY });
        melodySampler.stopAllMelodies();
        melodySampler.selectMelody("");
        beatSampler.samples = [];
        beatSampler.stopAllBeats();
        break;
      default:
        break;
    }
  };

  useInterval(() => {
    // if (gameStateRef.current.current !== GameStateEnum.PAUSE) {
    processHandData();
    // }
  }, TEMPO);

  return null;
};

export default SampleSynthesizer;
