import styled from "styled-components";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { startIteration } from "./pso";
import { useState } from "react";
import Divider from "@mui/material/Divider";
import { Bubble } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { startNumerical } from "./psoNumericalSimulation";
ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

const FormWrapper = styled.div`
  padding: 1rem 3rem;
`;

const App = () => {
  const [result, setResult] = useState([]);
  const { control, handleSubmit } = useForm({
    defaultValues: {
      population_size: 50,
      iteration: 100,
    },
  });

  const titleResult = (title, data) => (
    <div>
      <h3>{title}</h3>
      {data && <h4>{data}</h4>}
    </div>
  );

  const onSubmit = async (val) => {
    setResult([]);
    const value = await startIteration(val.population_size, val.iteration);
    setResult(value);
    console.log(value);
  };

  const startSimulation = async () => {
    setResult([]);
    const value = await startNumerical();
    setResult(value);
    console.log(value);
  };

  return (
    <FormWrapper>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Particle Swarm Optimization</h1>
        <h3>
          Objective function: Maximize: f(x) = 1+ 2*x - x^2; c1 = 0.7; c2 = 0.8;
          w = 0.7
        </h3>
        <h4>Initializing the parameters:</h4>
        <Controller
          name="population_size"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Population size (n)"
              fullWidth
              type="number"
            />
          )}
        />
        <br />
        <br />
        <Controller
          name="iteration"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Iteration (E)"
              fullWidth
              type="number"
            />
          )}
        />
        <br />
        <br />
        <Button type="submit" fullWidth variant="contained">
          Start
        </Button>
        <br />
        <br />
        <Button fullWidth variant="contained" onClick={startSimulation}>
          Simulate numerical
        </Button>
      </form>
      {result.map((value, index) => (
        <div>
          <br />
          <br />
          <Divider variant="middle" />
          {titleResult(
            index === 0 ? "Initial assignment" : `Iteration ${index}`
          )}
          {value?.position &&
            titleResult(
              "Swarm with individual particle position x: ",
              value?.position
            )}
          {value?.velocity &&
            titleResult(
              "Swarm with individual particle velocity v: ",
              value?.velocity
            )}
          {value?.current_fitness &&
            titleResult("Current fitness CF: ", value?.current_fitness)}
          {value?.local_best_fitness &&
            titleResult("Local best fitness LBF: ", value?.local_best_fitness)}
          {value?.particle_best_position_pbest &&
            titleResult(
              "Local best position pbest: ",
              value?.particle_best_position_pbest
            )}
          {value?.global_best_fitness &&
            titleResult(
              "Global best fitness GBF: ",
              value?.global_best_fitness
            )}
          {value?.global_best_gbest &&
            titleResult(
              "Global best position gbest: ",
              value?.global_best_gbest
            )}
          {value?.xyValues && value?.xyValues?.length > 0 && (
            <Bubble
              data={{
                datasets: [
                  {
                    label: "Position dataset",
                    data: value?.xyValues.map((xy) => ({
                      x: xy.x,
                      y: xy.y,
                      r: 2,
                    })),
                    backgroundColor: "rgba(53, 162, 235, 0.5)",
                  },
                ],
              }}
            />
          )}
        </div>
      ))}
    </FormWrapper>
  );
};

export default App;
