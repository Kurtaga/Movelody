import { useState, useEffect } from "react";

export const useAudioAmplitude = (analyser) => {
  const [amplitude, setAmplitude] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (analyser) {
        const values = analyser.getValue();
        let max = 0;
        for (const value of values) {
          max = Math.max(max, Math.abs(value)); // Find the maximum absolute value
        }
        setAmplitude(max); // This will be a value between 0 and 1
      }
    }, 100); // Update every 100 milliseconds, adjust as needed

    return () => clearInterval(interval);
  }, [analyser]);

  return amplitude;
};
