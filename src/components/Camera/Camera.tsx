import { useContext, useEffect, useRef, useState } from "react";
import "@tensorflow/tfjs-backend-webgl";
import "@tensorflow/tfjs-converter";
import "@tensorflow/tfjs-core";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import { AppContext } from "../AppContext/AppContext";
import { drawHand } from "../../utils/drawHand";
import "./Camera.css";

const Camera = () => {
  const { setPalmPosition } = useContext(AppContext);

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [net, setNet] = useState<handpose.HandPose | null>(null);

  // Load the model once when the component mounts
  useEffect(() => {
    const loadModel = async () => {
      const model = await handpose.load();
      console.log("Handpose model loaded.");
      setNet(model);
    };
    loadModel();
  }, []);

  useEffect(() => {
    runHandpose();
  }, [net]); // Run handpose when the model is loaded

  const runHandpose = async () => {
    if (net) {
      // Loop and detect hands only if the model is loaded
      setInterval(() => {
        detect(net);
      }, 500);
    }
  };

  const detect = async (net: handpose.HandPose) => {
    // Check data is available
    if (
      webcamRef.current &&
      webcamRef.current.video &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      // webcamRef.current.video.width = videoWidth;
      // webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      if (canvasRef.current) {
        // const ratio = videoWidth / videoHeight;
        // console.log(videoWidth, videoHeight);
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        // Make Detections
        const hand = await net.estimateHands(video);
        if (hand.length > 0 && hand[0].handInViewConfidence > 0.95) {
          setPalmPosition(
            (videoHeight - hand[0].annotations.palmBase[0][1]) / videoHeight
          );
        }

        // Draw mesh
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          drawHand(hand, ctx);
        }
      }
    }
  };

  return (
    <div className="camera-container">
      <Webcam ref={webcamRef} className="webcam" mirrored={true} />
      <canvas ref={canvasRef} className="canvas"></canvas>
    </div>
  );
};

export default Camera;
