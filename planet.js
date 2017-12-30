// Represents a celestial body and its properties
class Planet {
  // Constructor requires the distance to the center of the system, the mass of the celestial body
  // the radius for the visual representation (not used by the physics simulation) and a color
  constructor(distance, mass, speed, radius, color) {
    // Initializing body properties
    this.mass = mass;
    this.pos = vec3.fromValues(distance, 0, 0);
    this.v = vec3.fromValues(0, speed, 0);
    this.a = vec3.create();

    // Creating planet visual representation
    this.shape = new createjs.Shape();
    this.shape.graphics.beginFill(color).drawCircle(0, 0, radius * config.shapeScale);

    // Placing planet in the center by default
    this.shape.x = Math.round(config.canvasWidth / 2 + this.pos[0] * config.canvasScale)
    this.shape.y = Math.round(config.canvasHeight / 2 + this.pos[1] * config.canvasScale);

    // Creating orbit representation
    this.orbit = new createjs.Shape();
  }

  // Returns the position
  getPos() {
    return this.pos;
  }

  // Returns the mass
  getMass() {
    return this.mass;
  }

  // Returns the shape graphic element
  getShape() {
    return this.shape;
  }

  // Returns the orbit graphic element
  getOrbit() {
    return this.orbit;
  }

  // Accumulates a given acceleration
  accelerate(a) {
    vec3.add(this.a, this.a, a);
  }

  // Integrates the body using the previusly calculated acceleration
  integrate(dt) {
    switch (config.integrator) {
      case 0:
        this.integratorEulerExplicit(dt);
        break;
      case 1:
        this.integratorEulerCromer(dt);
        break;
      case 2:
        this.integratorEulerCromerMidpoint(dt);
        break;
      case 3:
        this.integratorTaylorSeries(dt);
        break;
    }
  }

  // Applies Euler-Cromer by using the old velocity
  integratorEulerExplicit(dt) {
    // Calculate the new position using the old velocity
    vec3.scaleAndAdd(this.pos, this.pos, this.v, dt);
    // Calculate the new velocity
    vec3.scaleAndAdd(this.v, this.v, this.a, dt);
  }

  // Applies Euler-Cromer by using the updated velocity
  integratorEulerCromer(dt) {
    // Calculate the new velocity
    vec3.scaleAndAdd(this.v, this.v, this.a, dt);
    // Calculate the new position using the new velocity
    vec3.scaleAndAdd(this.pos, this.pos, this.v, dt);
  }

  // Applies Euler-Cromer by using the velocity average
  integratorEulerCromerMidpoint(dt) {
    // Calculate the new velocity
    var v = vec3.create();
    vec3.scaleAndAdd(v, this.v, this.a, dt);
    // Get the average velocity and use it get the new position
    var both = vec3.clone(v);
    vec3.scaleAndAdd(this.pos, this.pos, vec3.add(both, both, this.v), dt / 2);
    // Persist the new velocity
    vec3.copy(this.v, v);
  }

  // Applies the Taylor Series to calculate the position and the velocity
  integratorTaylorSeries(dt) {
    // f(t + 1) = h^0 * f(t) / 0! + h^1 * f'(t) / 1! + h^2 * f''(t) / 2!
    vec3.scaleAndAdd(this.pos, this.pos, this.v, dt);
    vec3.scaleAndAdd(this.pos, this.pos, this.a, dt * dt / 2);
    // f'(t + 1) = h^0 * f'(t) / 0! + h^1 * f''(t) / 1!
    vec3.scaleAndAdd(this.v, this.v, this.a, dt);
  }

  // Resets the acceleration value to zero
  reset() {
    this.a = vec3.create();
  }

  // Responsible of updating the graphic components
  updateVisuals() {
    // Calculating new position on the canvas coordinate system
    var canvasX = Math.round(config.canvasWidth / 2 + this.pos[0] * config.canvasScale);
    var canvasY = Math.round(config.canvasHeight / 2 + this.pos[1] * config.canvasScale);

    // If position hasn't changed, return
    if (this.shape.x == canvasX && this.shape.y == canvasY) {
      return;
    }

    // Create a new segment in the orbit
    this.orbit.graphics.beginStroke("white");
    this.orbit.graphics.moveTo(this.shape.x, this.shape.y);
    this.orbit.graphics.lineTo(canvasX, canvasY);
    this.orbit.graphics.endStroke();

    // Update planet visual representation
    this.shape.x = canvasX;
    this.shape.y = canvasY;
  }
}
