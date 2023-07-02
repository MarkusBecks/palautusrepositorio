import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises, Result } from './exerciseCalculator';
import { isNumberArray } from './util/helpers';

const app = express();
app.use(express.json());

const mode = process.env.NODE_ENV || 'development';
console.log(`Running in ${mode} mode`);

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const weight = Number(req.query.weight);
  const height = Number(req.query.height);

  if (isNaN(weight) || isNaN(height) || !weight || !height) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  const bmi = calculateBmi(weight, height);

  return res.status(200).json({
    weight: weight,
    height: height,
    bmi: bmi,
  });
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const {
    target,
    daily_exercises,
  }: { daily_exercises: number[]; target: number } = req.body;

  if (!daily_exercises || !target) {
    return res.status(400).json({ error: 'parameters missing' });
  }

  if (!isNumberArray(daily_exercises)) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  const result: Result = calculateExercises(target, daily_exercises);

  return res.status(200).json(result);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
