import * as THREE from "three";

export const createBars = (
  scene: THREE.Scene,
  aspectRatio: number,
  config
): THREE.Mesh[] => {
  const fovRadius = config.cameraFov * (Math.PI / 180); // Convert fov to radians
  const horizontalFov = 2 * Math.atan(Math.tan(fovRadius / 2) * aspectRatio);
  const totalWidthAtBars = 2 * config.cameraZ * Math.tan(horizontalFov / 2); // Total visible size at bars
  const totalHeightAtBars = 2 * config.cameraZ * Math.tan(fovRadius / 2); // Total visible size at bars

  const totalSpaceBetweenBars =
    (config.numberOfBars - 1) * config.spaceBetweenBars;
  const totalBarsWidth = totalWidthAtBars - totalSpaceBetweenBars;
  const barWidth = totalBarsWidth / config.numberOfBars;

  const barDepth = barWidth;

  const startX = -totalWidthAtBars / 2;

  const bars = [];

  // Inside useEffect of Visualizer
  for (let i = 0; i < config.numberOfBars; i++) {
    const barGeometry = new THREE.BoxGeometry(
      barWidth,
      config.initialBarHeight,
      barDepth
    );
    const barMaterial = new THREE.MeshBasicMaterial({
      color: config.barColor,
    });
    const bar = new THREE.Mesh(barGeometry, barMaterial);
    // bar.position.x = startX + i * (barWidth + spaceWidth);
    bar.position.x =
      startX + i * (barWidth + config.spaceBetweenBars) + barWidth / 2;
    bar.position.y = -totalHeightAtBars / 2 + config.initialBarHeight / 2; // Set the initial y position to half the height
    scene.add(bar);
    bars.push(bar);
  }

  return bars;
};

// Function to update bars' color linearly from left to right
export const updateBarColors = (bars, startColor, endColor) => {
  // Get the leftmost and rightmost x positions of the bars
  const xPositions = bars.map((bar) => bar.position.x);
  const minX = Math.min(...xPositions);
  const maxX = Math.max(...xPositions);

  bars.forEach((bar) => {
    // Normalize the bar's x position within the range
    const normalizedPosition = (bar.position.x - minX) / (maxX - minX);

    // Linearly interpolate the color for this bar
    const barColor = startColor.clone().lerp(endColor, normalizedPosition);

    // If the bar already has a material, just change its color
    if (bar.material && bar.material.color) {
      bar.material.color.set(barColor);
    } else {
      // Otherwise, create a new material with the interpolated color
      bar.material = new THREE.MeshBasicMaterial({ color: barColor });
    }
  });
};

export const updateBars = (
  bars: THREE.Mesh[],
  fftData: Float32Array | null,
  config
): void => {
  for (let i = 0; i < bars.length; i++) {
    const bar = bars[i];
    if (bar) {
      if (fftData) {
        const fovRadius = config.cameraFov * (Math.PI / 180); // Convert fov to radians
        const totalHeightAtBars = 2 * config.cameraZ * Math.tan(fovRadius / 2); // Total visible size at bars

        const height = THREE.MathUtils.mapLinear(fftData[i], -100, 0, 0.1, 14);
        const scale = Math.min(
          Math.max(0.1, height),
          (totalHeightAtBars - 2) / config.initialBarHeight // don't allow it to go over the top
        );
        // bar.position.y = -scale / 2;
        // const yPos = bar.position.y;
        bar.scale.y = scale;

        const beforeHeight =
          -totalHeightAtBars / 2 + config.initialBarHeight / 2;
        bar.position.y = beforeHeight + (scale * config.initialBarHeight) / 2;
      }
    }
  }
};

export const onResize = (
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  visualizerRef: HTMLDivElement
): void => {
  const newWidth = visualizerRef.clientWidth;
  const newHeight = visualizerRef.clientHeight;
  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(newWidth, newHeight);
};
