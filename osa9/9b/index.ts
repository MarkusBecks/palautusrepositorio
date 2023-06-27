import express from 'express';
import { calculateBmi } from './bmiCalculator';

const app = express();

const mode = process.env.NODE_ENV || 'development';
console.log(`Running in ${mode} mode`);

app.get('/hello', (_req, res) => {
    res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
    const weight = Number(req.query.weight);
    const height = Number(req.query.height);

    if (isNaN(weight) || isNaN(height) || !weight || !height) {
        return res.status(400).json({ error: 'malformatted parameters'})
    }

    const bmi = calculateBmi(weight, height);

    return res.status(200).json({
        weight: weight,
        height: height,
        bmi: bmi
    });
});

const PORT = 3003;
  
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});