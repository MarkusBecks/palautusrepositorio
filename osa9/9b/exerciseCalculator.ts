import { add, areAllNumbers } from "./util/helpers"

interface Result {
    periodLength: number,
    trainingDays: number,
    success: boolean,
    rating: number,
    ratingDescription: string,
    target: number,
    average: number
}

// extract command-line arguments
const args: string[] = process.argv.slice(2); 

const calculateExercises = (args: string[]): Result => {

if (!areAllNumbers(args)) {
    console.log('Values provided are not numbers!')
    process.exit(1);
}

// extract target value and convert it to a number
const target = Number(args[0]);

// exclude target from the rest of the arguments to get the periodLength
const periodLength = process.argv.slice(3).length;

const totalHours: number = args.slice(1) // exclude the target value
    .map(Number) // convert all remaining arguments to numbers
    .reduce(add); // calculate the total

const trainingDaysArr: number[] = []; 

args.slice(1).forEach((el) => {
    const num = Number(el);
    if (num > 0) {
        trainingDaysArr.push(num);
    }
});

const trainingDays = trainingDaysArr.length;

const average: number = totalHours / periodLength;

const success = (average: number, target: number): boolean =>
    average === target || average > target;

const ratio: number = average / target;

const rating = (ratio: number): number => {
    let rating: number;
    if (ratio < 0.5) {
        rating = 1;
    } else if (ratio >= 0.5 && ratio < 1) {
        rating = 2;
    } else if (ratio >= 1) {
        rating = 3;
    }
    return rating;
}
 
const ratingDescription = (ratio: number): string => {
    if (ratio < 0.5) {
        return 'room for improvement'
    } else if (ratio >= 0.5 && ratio < 1) {
        return 'almost there!'
    } else if (ratio >= 1) {
        return 'you did it!'
    }
}

const result: Result = {
    periodLength,
    trainingDays,
    success: success(average, target),
    rating: rating(ratio),
    ratingDescription: ratingDescription(ratio),
    target,
    average
}
    console.log(result);
    return result;
}

calculateExercises(args);