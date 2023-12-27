import { useRef, useEffect, useContext } from "react";
import * as THREE from "three";
import "./Visualizer.css";
import { AppContext } from "../AppContext/AppContext";
import {
  createBars,
  updateBars,
  onResize,
  updateBarColors,
} from "../../utils/visualizationUtils";
import cassete from "../../assets/images/cassete.png";
import { useAudioAmplitude } from "../..//hooks/useAudioAmplitude";
import { beatSampler, melodySampler } from "../../utils/synthesizerUtils";

export const VISUALIZER_CONFIG = {
  cameraFov: 5,
  cameraY: 0,
  cameraZ: 160,
  numberOfBars: 10,
  spaceBetweenBars: 1,
  initialBarHeight: 2,
  barColor: 0xc3f0ca,
  updateInterval: 1000 / 30, // Approximately 30 updates per second
};

const Visualizer = () => {
  const visualizerRef = useRef(null);
  const { fftData } = useContext(AppContext); // Access the FFT data from the context
  const fftDataRef = useRef(fftData);
  const barsRef = useRef([]); // A ref to store the bar mesh objects

  const melodyAmplitude = useAudioAmplitude(melodySampler.analyser);
  const beatAmplitude = useAudioAmplitude(beatSampler.analyser);

  // Update the ref whenever fftData changes
  useEffect(() => {
    fftDataRef.current = fftData;
  }, [fftData]);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const width = visualizerRef.current.clientWidth;
    const height = visualizerRef.current.clientHeight;
    const aspectRatio = width / height;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    visualizerRef.current.appendChild(renderer.domElement);
    console.log(width, height, aspectRatio);
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      VISUALIZER_CONFIG.cameraFov,
      aspectRatio,
      100,
      1000
    );
    camera.position.z = VISUALIZER_CONFIG.cameraZ;
    camera.position.y = VISUALIZER_CONFIG.cameraY;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Create bars
    barsRef.current = createBars(scene, aspectRatio, VISUALIZER_CONFIG);
    const startColor = new THREE.Color("#B4DBFE"); // Leftmost color
    const endColor = new THREE.Color("#EAF9FA"); // Rightmost color
    updateBarColors(barsRef.current, startColor, endColor);

    // Update bars
    const intervalId = setInterval(() => {
      updateBars(barsRef.current, fftDataRef.current, VISUALIZER_CONFIG);
    }, VISUALIZER_CONFIG.updateInterval);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const onWindowResize = () =>
      onResize(camera, renderer, visualizerRef.current);

    window.addEventListener("resize", onWindowResize, false);

    // Cleanup on unmount
    return () => {
      if (visualizerRef.current) {
        const currentRef = visualizerRef.current;
        currentRef.removeChild(renderer.domElement);
      }
      window.removeEventListener("resize", onWindowResize);
      clearInterval(intervalId);
    };
  }, []); // Empty dependency array to run only once

  return (
    <div
      className={
        "visualizer "
        // + (gameState.current == GameStateEnum.LISTEN ? "dance" : "")
      }
      style={{
        transform: `scale(${(melodyAmplitude + beatAmplitude) / 20 + 1})`,
      }}
    >
      <div className="waveforms" ref={visualizerRef}></div>
      <img src={cassete}></img>
    </div>
  );
};

export default Visualizer;
