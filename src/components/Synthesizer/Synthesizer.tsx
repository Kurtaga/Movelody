import { useContext, useEffect, useRef } from "react";
import * as Tone from "tone";
import { AppContext } from "../AppContext/AppContext";
import { FeedbackDelay } from "tone";
import { calculateHandMidpoint } from "../../utils/handUtils";

export const scale = [
  "C2",
  "D2",
  "E2",
  "F2",
  "G2",
  "A2",
  "B2",
  "C3",
  "D3",
  "E3",
  "F3",
  "G3",
  "A3",
  "B3",
  "C4",
  "D4",
  "E4",
  "F4",
  "G4",
  "A4",
  "B4",
  "C5",
  "D5",
  "E5",
  "F5",
  "G5",
  "A5",
  "B5",
  "C6",
];

const TEMPO = 500;

const Synthesizer = () => {
  const { setFftData, handTrackingData, logs, setLogs, paused, setPaused } =
    useContext(AppContext);
  const bassSynthRef = useRef(null);
  const trebleSynthRef = useRef(null);
  const fftRef = useRef(null);
  const handTrackingDataRef = useRef(handTrackingData);
  const pausedRef = useRef(paused);

  // Function to handle drum clicks
  const handleBass = (note) => {
    if (bassSynthRef.current) {
      bassSynthRef.current.triggerAttackRelease(note, "8n", Tone.now());
    }
  };
  const handleTreble = (note) => {
    if (trebleSynthRef.current) {
      trebleSynthRef.current.triggerAttackRelease(note, "8n", Tone.now());
    }
  };

  // Update the ref whenever palmPosition changes
  useEffect(() => {
    handTrackingDataRef.current = handTrackingData;
  }, [handTrackingData]);

  // Update the ref whenever paused changes
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    // Initialize the synthesizer
    const bassSynth = new Tone.MembraneSynth();
    const trebleSynth = new Tone.Synth();

    const feedbackDelay = new FeedbackDelay({
      delayTime: 0.01,
      feedback: 0.01,
      wet: 0.95,
    });
    bassSynth.connect(feedbackDelay);
    trebleSynth.connect(feedbackDelay);
    feedbackDelay.toDestination();

    bassSynthRef.current = bassSynth;
    trebleSynthRef.current = trebleSynth;

    // Initialize FFT analyzer
    const fft = new Tone.Analyser("fft", 64);
    feedbackDelay.connect(fft);
    fftRef.current = fft;
    // Set an interval to play a note and update FFT data every 500 ms
    const intervalId = setInterval(() => {
      for (const hand of handTrackingDataRef.current.hands) {
        if (!hand) return;
        const { y } = calculateHandMidpoint(hand.landmarks);
        const index = Math.max(
          0,
          Math.min(Math.round(y * (scale.length - 1)), scale.length - 1)
        );
        if (hand.gestureName == "Victory") {
          setPaused(!pausedRef.current);
        }
        if (!pausedRef.current) {
          if (hand.gestureName == "ILoveYou") {
            handleTreble(scale[index]);
            setLogs([...logs, scale[index]]);
          } else if (hand.gestureName == "Closed_Fist") {
            handleBass(scale[index]);
            setLogs([...logs, scale[index]]);
          }
        }
      }
    }, TEMPO);
    // Update FFT data
    const fftIntervalId = setInterval(() => {
      if (fftRef.current) {
        const fftValues = fftRef.current.getValue();
        setFftData(new Float32Array(fftValues));
      }
    }, 1000 / 30);
    // Clean up on unmount
    return () => {
      clearInterval(intervalId);
      clearInterval(fftIntervalId);
      if (bassSynthRef.current) {
        bassSynthRef.current.dispose();
      }
      if (fftRef.current) {
        fftRef.current.dispose();
      }
    };
  }, []);

  return null;
};

export default Synthesizer;
