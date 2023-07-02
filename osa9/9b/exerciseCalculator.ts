import { add, areAllNumbers } from './util/helpers';

export interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export const calculateExercises = (
  target: number,
  daily_exercises: number[]
): Result => {
  const periodLength = daily_exercises.length;
  const trainingDays = daily_exercises.filter((value) => value > 0).length;
  const totalHours: number = daily_exercises.reduce(add, 0);
  const average: number = totalHours / periodLength;
  const success = average >= target;
  const ratio: number = average / target;

  const rating = (): number => {
    let rating = 0;

    if (ratio < 0.5) {
      rating = 1;
    } else if (ratio >= 0.5 && ratio < 1) {
      rating = 2;
    } else if (ratio >= 1) {
      rating = 3;
    }

    return rating;
  };

  const ratingDescription = (): string => {
    let description = '';

    if (ratio < 0.5) {
      description = 'room for improvement';
    } else if (ratio >= 0.5 && ratio < 1) {
      description = 'almost there!';
    } else if (ratio >= 1) {
      description = 'you did it!';
    }

    return description;
  };

  const result: Result = {
    periodLength,
    trainingDays,
    success,
    rating: rating(),
    ratingDescription: ratingDescription(),
    target,
    average,
  };

  return result;
};

// extract command-line arguments
const args: string[] = process.argv.slice(2);
const target = Number(args[0]);

if (args.length) {
  if (!areAllNumbers(args)) {
    console.log('Values provided are not numbers!');
    process.exit(1);
  }

  const hours = args.slice(1).map(Number);

  console.log(calculateExercises(target, hours));
}
