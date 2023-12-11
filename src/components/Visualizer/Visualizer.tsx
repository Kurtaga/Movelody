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

export const VISUALIZER_CONFIG = {
  cameraFov: 5,
  cameraY: 30,
  cameraZ: 260,
  numberOfBars: 26,
  spaceBetweenBars: 0.75,
  initialBarHeight: 2,
  barColor: 0xc3f0ca,
  updateInterval: 1000 / 30, // Approximately 30 updates per second
};

const Visualizer = () => {
  const visualizerRef = useRef(null);
  const { fftData } = useContext(AppContext); // Access the FFT data from the context
  const fftDataRef = useRef(fftData);
  const barsRef = useRef([]); // A ref to store the bar mesh objects

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

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      VISUALIZER_CONFIG.cameraFov,
      aspectRatio,
      0.1,
      1000
    );
    camera.position.z = VISUALIZER_CONFIG.cameraZ;
    camera.position.y = VISUALIZER_CONFIG.cameraY;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Create bars
    barsRef.current = createBars(scene, aspectRatio, VISUALIZER_CONFIG);
    const startColor = new THREE.Color("#c3f0ca"); // Leftmost color
    const endColor = new THREE.Color("#B8C1EC"); // Rightmost color
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

  return <div className="visualizer" ref={visualizerRef}></div>;
};

export default Visualizer;
