// Used to convert seconds to years, just for visual purposes
const SECONDS_TO_YEARS = 1 / 3.15576e7;

const INTEGRATOR_LABELS = [
  "Euler Explicit",
  "Euler-Cromer",
  "Euler-Cromer Midpoint",
  "Taylor Series",
];


// Main function, the entry point for the engine
$(function() {
  // Activating all the body tooltips
  $("body").tooltip({
    position: {
      my: "center top",
      at: "center bottom",
    },
  });

  // Wiring up dt slider
  var dtValue = $("#dtInput > .value");
  dtValue.text(config.dt);
  $("#dtInput > .slider").slider({
    min: 100,
    max: 1000,
    step: 100,
    value: config.dt,
    slide: function(event, ui) {
      config.dt = ui.value;
      dtValue.text(ui.value);
    },
  });

  // Wiring up steps slider
  var stepsValue = $("#stepsInput > .value");
  stepsValue.text(config.steps);
  $("#stepsInput > .slider").slider({
    min: 20,
    max: 1000,
    step: 20,
    value: config.steps,
    slide: function(event, ui) {
      config.steps = ui.value;
      stepsValue.text(ui.value);
    },
  });

  // Wiring up integrator slider
  var integratorValue = $("#integratorInput > .value");
  integratorValue.text(INTEGRATOR_LABELS[config.integrator]);
  $("#integratorInput > .slider").slider({
    min: 0,
    max: 3,
    step: 1,
    value: config.integrator,
    slide: function(event, ui) {
      config.integrator = ui.value;
      integratorValue.text(INTEGRATOR_LABELS[ui.value]);
    },
  });

  // Caching the engine pause/resume button
  var engineButton = $("#engineInput > .button");
  // This function updates the button
  var updateEngineButton = function() {
    if (config.active) {
      engineButton.text("Running");
      engineButton.removeClass("inactive");
      engineButton.addClass("active");
    } else {
      engineButton.text("Paused");
      engineButton.removeClass("active");
      engineButton.addClass("inactive");
    }
  };
  // Updating the button to the initial value
  updateEngineButton();

  // Adding functionality to the button
  engineButton.click(function() {
    config.active = !config.active;
    updateEngineButton();
  });

  // Adding keypress event handlers
  $("body").keypress(function(e) {
    switch (e.which) {
      case 32:
        config.active = !config.active;
        updateEngineButton();
        break;
    }
  });

  // Initializing the canvas
  var stage = new createjs.Stage("canvas");
  stage.canvas.width = config.canvasWidth;
  stage.canvas.height = config.canvasHeight;

  // Adding a black background
  var bg = new createjs.Shape();
  bg.graphics.beginFill("#3B8686").drawRect(0, 0, stage.canvas.width, stage.canvas.height);
  stage.addChild(bg);

  // Adding a label useful to communicate how much time has passed
  var frameLabel = new createjs.Text("", "24px Arial", "#DDD");
  frameLabel.x = 0;
  frameLabel.y = 0;
  stage.addChild(frameLabel);

  // Creating the solar system
  var system = new System();
  // https://en.wikipedia.org/wiki/Sun (changed radius from its real value of 6.957e8)
  system.addPlanet(new Planet(0, 1.98855e30, 0, 2e7, "#FFBE40"));
  // https://en.wikipedia.org/wiki/Mercury_(planet)
  system.addPlanet(new Planet(4.60012e10, 3.3011e23, 5.8980e4, 2.4397e6, "#B3CC57"));
  // https://en.wikipedia.org/wiki/Venus
  system.addPlanet(new Planet(1.07477e11, 4.8675e24, 3.5259e4, 6.0518e6, "#FFBE40"));
  // https://en.wikipedia.org/wiki/Earth
  system.addPlanet(new Planet(1.47095e11, 5.97237e24, 3.02865e4, 6.371e6, "#EF746F"));
  // https://en.wikipedia.org/wiki/Mars
  system.addPlanet(new Planet(2.067e11, 6.4171e23, 2.6499e4, 3.3895e6, "#AB3E5B"));

  // Adding planet shapes to the canvas
  system.getPlanets().forEach(function(planet) {
    stage.addChild(planet.getShape());
    stage.addChild(planet.getOrbit());
  });

  // Initializing the total running time
  var t = 0;
  // Engine loop function
  var update = function() {
    // The system only updates when the engine is active
    if (config.active) {
      // Update the system by a timestep multiple times
      for (var i = 0; i < config.steps; ++i) {
        // Update the system by a timestep
        system.update(config.dt);
      }

      // Update the total running time
      t += config.dt * config.steps;
    }

    // Update the label
    frameLabel.text = "Year: " + (t * SECONDS_TO_YEARS).toFixed(2);
    // Update the canvas
    stage.update();
  }

  // Let the loop function run!
  setInterval(update, 1000 / config.fps);
});
