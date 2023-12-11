import React, { useState, useRef, useEffect, useContext } from "react";
import {
  GestureRecognizer,
  FilesetResolver,
  DrawingUtils,
} from "@mediapipe/tasks-vision";
import "./HandTracking.css";
import { AppContext, SET_HANDS, Hand } from "../AppContext/AppContext";

const HandTracking = () => {
  const { setLoading, handTrackingDispatch } = useContext(AppContext);
  const [gestureOutput] = useState("");
  const [webcamRunning, setWebcamRunning] = useState(true);
  const gestureRecognizerRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const createGestureRecognizer = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
      );
      gestureRecognizerRef.current = await GestureRecognizer.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
            delegate: "GPU",
          },
          numHands: 2,
          runningMode: "IMAGE",
        }
      );
      enableCam();
    };

    createGestureRecognizer();
  }, []);

  const handleLoadedMetadata = () => {
    // Set the canvas size to match the video element size
    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    if (videoElement && canvasElement) {
      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;
    }
    console.log("making loading false");
    setLoading(false);
    // Additional code to handle when the video metadata is loaded
    predictWebcam();
  };

  const enableCam = () => {
    if (!gestureRecognizerRef.current) {
      return;
    }
    setWebcamRunning((current) => !current);
    const constraints = {
      video: true,
    };

    if (webcamRunning) {
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          const video = videoRef.current;
          if (video) {
            video.srcObject = stream;
            video.play().catch((error) => {
              console.error("Error trying to play the video stream", error);
            });
            predictWebcam();
          }
        })
        .catch((error) => {
          console.error("Error accessing the webcam", error);
        });
    }
  };

  const updateHands = (newHands: Hand[]) => {
    handTrackingDispatch({ type: SET_HANDS, payload: newHands });
  };

  const predictWebcam = () => {
    if (
      !gestureRecognizerRef.current ||
      !videoRef.current ||
      !canvasRef.current
    ) {
      console.warn("Required components for prediction are not ready.");
      return;
    }

    if (!webcamRunning) {
      return;
    }

    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");

    if (canvasCtx && videoElement) {
      const drawingUtils = new DrawingUtils(canvasCtx);

      const predict = async () => {
        if (videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
          const results = await gestureRecognizerRef.current.recognize(
            videoElement
          );
          if (!videoElement) return;
          // if (!results || !results.gestures) {
          //   updateHands([]);
          //   return;
          // }

          const newHands = results.gestures.map((gesture, index) => ({
            gestureName: gesture[0].categoryName,
            confidence: gesture[0].score,
            landmarks: results.landmarks[index],
          }));
          updateHands(newHands);

          canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
          canvasCtx.drawImage(
            videoElement,
            0,
            0,
            canvasElement.width,
            canvasElement.height
          );
          canvasCtx.save();

          if (results.landmarks) {
            for (const landmarks of results.landmarks) {
              drawingUtils.drawLandmarks(landmarks, {
                color: "#eebbc3",
                lineWidth: 5,
              });
            }
          }

          canvasCtx.restore();
        }

        if (webcamRunning) {
          requestAnimationFrame(predict);
        }
      };

      requestAnimationFrame(predict);
    }
  };

  return (
    <div className="hand-tracking">
      <video
        ref={videoRef}
        // style={{ display: webcamRunning ? "block" : "none" }}
        className="video"
        onLoadedMetadata={handleLoadedMetadata}
      ></video>
      <canvas className="canvas" ref={canvasRef}></canvas>
      <div>{gestureOutput}</div>
    </div>
  );
};

export default HandTracking;
