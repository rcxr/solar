// Represents a system composed of planets
class System {
  // Constructor`that initializes the system to an empty set of planets
  constructor() {
    this.planets = [];
  }

  // Adds a planet to the system
  addPlanet(planet) {
    this.planets.push(planet);
  }

  // Returns the set of planets
  getPlanets() {
    return this.planets;
  }

  // Updates the system by a timestep
  update(dt) {
    // Firstly, reset the previously calculated accelerations
    this.planets.forEach(function(planet) {
      planet.reset();
    });

    // Calculate the planet accelerations by applying the gravity forces
    for (var i in this.planets) {
      for (var j in this.planets) {
        // This check prevents the duplicated combinations from being calculated twice
        // It also removes the reflexive pairs, e.g. (0, 0), (1, 1), etc.
        if (i < j) {
          // Apply the gravity forces for the pair of planets
          Physics.applyGravity(this.planets[i], this.planets[j]);
        }
      }
    }

    // Integrate the planets' accelerations and calculate the new speed and position
    this.planets.forEach(function(planet) {
      planet.integrate(dt);
    });

    // Update the visual representation of the planets
    this.planets.forEach(function(planet) {
      planet.updateVisuals();
    });
  }
}
