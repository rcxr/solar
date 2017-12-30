// Configuration values used to control the simulation
const config = {
  // Desired amount of frames per second
  fps: 30,
  // Scale used only for visual representation of the planet shapes
  shapeScale: 1 / 8e5,
  // Scale used for the canvas grid
  canvasScale: 1 / 1e9,
  // Canvas width
  canvasWidth: 650,
  // Canvas height
  canvasHeight: 500,
  // Active integrator method
  integrator: 0,
  // The timestep used for the integrator
  dt: 600,
  // The amount of stepts taken per frame
  steps: 200,
  // Whether the engine is active
  active: true,
};
