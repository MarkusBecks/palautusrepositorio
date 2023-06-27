import { areAllNumbers } from "./util/helpers";

// extract command-line arguments
const args: string[] = process.argv.slice(2); 

const weight: number = Number(args[0]);
const height: number = Number(args[1]);

const calculateBmi = (args: string[]): string => {
    if (!areAllNumbers(args)) {
        console.log('Values provided are not numbers!')
        process.exit(1);
    }

    const bmi = weight / ((height / 100) * (height / 100)); // convert height to meters
    let message: string;
    console.log('weight: ', weight);
    console.log('height: ', height);
    console.log('BMI: ', Math.round(bmi * 10) / 10);
    if (bmi < 16) {
        message = 'Underweight';
    } else if (bmi >= 16 && bmi < 25) {
        message = 'Normal range';
    } else if (bmi >= 25 && bmi < 30) {
        message = 'Overweight';
    } else {
        message = 'Obese';
    }
    return message;
}

console.log(calculateBmi(args));  