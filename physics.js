// https://en.wikipedia.org/wiki/Gravitational_constant
const G = 6.674e-11;

// Static physics library
class Physics {
  // Updates the acceleration of two planets by applying the mutual gravity force
  static applyGravity(planet1, planet2) {
    // a1 will hold the acceleration vector for the planet1
    // The vector direction will be from planet1 to planet2
    // The vector magnitude will be calculated by applying the Cowell's Method
    var a1 = vec3.create();
    // a2 will hold the acceleration vector for the planet2
    // The vector direction will be from planet2 to planet1
    // The vector magnitude will be calculated by applying the Cowell's Method
    var a2 = vec3.create();

    // We want a vector that points to planet2 from planet1, i.e. a1 = pos2 - pos1
    vec3.sub(a1, planet2.getPos(), planet1.getPos());
    // We calculate the euclidean distance
    var r = vec3.len(a1);
    // Caching value that will be reused
    var r3 = r * r * r;
    // Applying Cowell's Method and clearing out the acceleration element (using F = m * a)
    // Note that the direction of both accelerations is the same, but with opposite sign
    vec3.scale(a2, a1, -G * planet1.getMass() / r3);
    vec3.scale(a1, a1, G * planet2.getMass() / r3);

    // Apply accelerations to the planets
    planet1.accelerate(a1);
    planet2.accelerate(a2);
  }
}
