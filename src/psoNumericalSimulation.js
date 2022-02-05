import { arrayTextFormatter, functionalValue, velocityFunction } from "./pso";

// Start pso operation simulation with numerical
export const startNumerical = () => {
  return new Promise((resolve) => {
    let iteration = 4;
    let particle_position_x = [-0.3425, 3.9558, -1.1228, -0.0981, 0.0385];
    let particle_velocity_v = [0.0319, 0.3185, 0.3331, 0.2677, -0.3292];
    let particle_best_position_pbest = [];
    let local_best_fitness = [];
    let random_first = [0.4657, 0.8956, 0.3877, 0.4902, 0.5039];
    let random_second = [0.5319, 0.8185, 0.8331, 0.7677, 0.1708];
    let current_fitness = [];
    let xyValues = [];
    let global_best_fitness = 0;
    let global_best_gbest = 0;
    let global_best_index = -1;
    let c1 = 0.2;
    let c2 = 0.6;
    let w = 0.7;
    let result = [];
    result.push({
      position: arrayTextFormatter(particle_position_x),
      velocity: arrayTextFormatter(particle_velocity_v),
    });
    for (var i = 0; i < iteration; i++) {
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
        let temp_xyValues = [];
        let temp_local_best_fitness = [];
        let temp_particle_best_position_pbest = [];
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
