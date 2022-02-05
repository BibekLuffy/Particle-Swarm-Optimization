/**
 * Implementation of Particle swarm optimization to maximize a function
 * Submitted by:
 * Bibek Karki (bibek.202503@ncit.edu.np)
 * Rezy Shrestha (rezy.202508@ncit.edu.np)
 */

// Objective function
export const functionalValue = (x) => 1 + 2 * x - x * x;

// Velocity function
export const velocityFunction = (w, v, c1, r1, pbest, x, c2, r2, gbest) =>
  w * v + c1 * r1 * (pbest - x) + c2 * r2 * (gbest - x);

// Generates the random sign value
export const randomSignGenerator = () =>
  Math.floor(Math.random() * 2) % 2 === 0 ? 1 : -1;

// Generates the random value with given range
export const randomValueGenerator = (range = 1) => Math.random() * range;

// Format the array element
export const arrayTextFormatter = (array) =>
  JSON.stringify(array)
    .replace(/,/g, ", ")
    .replace(/\[/g, "[ ")
    .replace(/\]/g, " ]");

// Start pso operation
export const startIteration = (population_size, iteration) => {
  return new Promise((resolve) => {
    let particle_position_x = [];
    let particle_velocity_v = [];
    let particle_best_position_pbest = [];
    let local_best_fitness = [];
    let random_first = [];
    let random_second = [];
    let current_fitness = [];
    let xyValues = [];
    let global_best_fitness = 0;
    let global_best_gbest = 0;
    let global_best_index = -1;
    let range = 2;
    let c1 = 2;
    let c2 = 2;
    let w = 0.7;
    let result = [];
    for (var i = 0; i < population_size; i++) {
      random_first.push(randomValueGenerator());
      random_second.push(randomValueGenerator());
      particle_position_x.push(
        randomValueGenerator(range) * randomSignGenerator()
      );
      particle_velocity_v.push(0);
      // particle_velocity_v.push(randomValueGenerator() * randomSignGenerator());
    }
    result.push({
      position: arrayTextFormatter(particle_position_x),
      velocity: arrayTextFormatter(particle_velocity_v),
    });
    for (i = 0; i < iteration; i++) {
      if (i === 0) {
        particle_best_position_pbest = [...particle_position_x];
        current_fitness = particle_position_x.map((position) =>
          functionalValue(position)
        );
        local_best_fitness = [...current_fitness];
      } else {
        let temp_particle_velocity_v = [];
        let temp_particle_position_x = [];
        let temp_current_fitness = [];
        let temp_local_best_fitness = [];
        let temp_particle_best_position_pbest = [];
        let temp_xyValues = [];
        // eslint-disable-next-line no-loop-func
        particle_velocity_v.forEach((velocity, index) => {
          let oldPosition = particle_position_x[index];
          let newVelocity = velocityFunction(
            w,
            velocity,
            c1,
            random_first[index],
            particle_best_position_pbest[index],
            oldPosition,
            c2,
            random_second[index],
            global_best_gbest
          );
          temp_particle_velocity_v.push(newVelocity);
          let newPosition = newVelocity + oldPosition;
          temp_particle_position_x.push(newPosition);
          let functionalValueResult = functionalValue(oldPosition);
          temp_current_fitness.push(functionalValueResult);
          temp_local_best_fitness.push(
            Math.max(functionalValueResult, local_best_fitness[index])
          );
          temp_particle_best_position_pbest.push(
            Math.max(oldPosition, newPosition)
          );
          temp_xyValues.push({
            x: newPosition,
            y: functionalValueResult,
          });
        });
        particle_velocity_v = [...temp_particle_velocity_v];
        particle_position_x = [...temp_particle_position_x];
        current_fitness = [...temp_current_fitness];
        local_best_fitness = [...temp_local_best_fitness];
        particle_best_position_pbest = [...temp_particle_best_position_pbest];
        xyValues = [...temp_xyValues];
      }

      let new_global_best_fitness = Math.max(...local_best_fitness);
      global_best_fitness = new_global_best_fitness;
      global_best_index = local_best_fitness.indexOf(global_best_fitness);
      global_best_gbest = particle_best_position_pbest[global_best_index];

      result.push({
        xyValues,
        position: arrayTextFormatter(particle_position_x),
        velocity: arrayTextFormatter(particle_velocity_v),
        current_fitness: arrayTextFormatter(current_fitness),
        local_best_fitness: arrayTextFormatter(local_best_fitness),
        particle_best_position_pbest: arrayTextFormatter(
          particle_best_position_pbest
        ),
        global_best_fitness,
        global_best_gbest,
      });
    }
    resolve(result);
  });
};
