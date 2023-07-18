import { CoursePart } from '../types';

const Total = ({ courseParts }: { courseParts: CoursePart[] }) => {
  return (
    <p>
      Total number of exercises{' '}
      {courseParts.reduce((acc, part) => acc + part.exerciseCount, 0)}
    </p>
  );
};

export default Total;
