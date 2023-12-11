import { useContext, useEffect, useRef } from "react";
import * as Tone from "tone";
import { AppContext } from "../AppContext/AppContext";

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

const TEMPO = 250;

const Synthesizer = () => {
  const { setFftData, palmPosition, logs, setLogs, paused } =
    useContext(AppContext);
  const drumSynthRef = useRef(null);
  const fftRef = useRef(null);
  const palmPositionRef = useRef(palmPosition);
  const pausedRef = useRef(paused);

  // Function to handle drum clicks
  const handleDrumClick = (note) => {
    if (drumSynthRef.current) {
      drumSynthRef.current.triggerAttackRelease(note, "8n", Tone.now());
    }
  };

  // Update the ref whenever palmPosition changes
  useEffect(() => {
    palmPositionRef.current = palmPosition;
  }, [palmPosition]);

  // Update the ref whenever paused changes
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    // Initialize the synthesizer
    const drumSynth = new Tone.Synth().toDestination();
    drumSynthRef.current = drumSynth;

    // Initialize FFT analyzer
    const fft = new Tone.Analyser("fft", 64);
    drumSynth.connect(fft);
    fftRef.current = fft;

    // Set an interval to play a note and update FFT data every 500 ms
    const intervalId = setInterval(() => {
      // Play the note based on current palmPosition
      const currentPalmPosition = palmPositionRef.current;
      const currentPaused = pausedRef.current;
      if (!currentPalmPosition || currentPaused) return; // Don't start playing if palm hasn't been detected at the start
      const index = Math.max(
        0,
        Math.min(
          Math.round(currentPalmPosition * (scale.length - 1)),
          scale.length - 1
        )
      );
      const note = scale[index];
      handleDrumClick(note);

      // Update FFT data
      if (fftRef.current) {
        const fftValues = fftRef.current.getValue();
        setFftData(new Float32Array(fftValues));
      }

      // Update logs
      setLogs([...logs, note]);
    }, TEMPO);

    // Clean up on unmount
    return () => {
      clearInterval(intervalId);
      if (drumSynthRef.current) {
        drumSynthRef.current.dispose();
      }
      if (fftRef.current) {
        fftRef.current.dispose();
      }
    };
  }, []);

  return null;
};

export default Synthesizer;
