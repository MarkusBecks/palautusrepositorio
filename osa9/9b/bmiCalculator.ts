import { areAllNumbers } from "./util/helpers";

export const calculateBmi = (weight: number, height: number): string => {
    const bmi = weight / ((height / 100) * (height / 100)); // convert height to meters
    let message: string = '';

    if (bmi < 16) {
        message = 'Underweight';
    } else if (bmi >= 16 && bmi < 25) {
        message = 'Normal (healthy weight)';
    } else if (bmi >= 25 && bmi < 30) {
        message = 'Overweight';
    } else if (bmi >= 30 ) {
        message = 'Obese';
    }
    return message;
}

// extract command-line arguments
const args: string[] = process.argv.slice(2); 


if (args.length) {
    
const weight: number = Number(args[0]);
const height: number = Number(args[1]);

if (!areAllNumbers(args)) {
    console.log('Values provided are not numbers!')
    process.exit(1);
}

console.log(calculateBmi(weight, height));  
}