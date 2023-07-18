import { CoursePart } from '../types';
import Part from './Part';

interface ContentProps {
  courseParts: CoursePart[];
}

const styles = {
  fontWeight: 'bold',
};

const Content = ({ courseParts }: ContentProps) => {
  return (
    <div>
      {courseParts.map((part) => (
        <>
          <div style={styles}>
            {part.name} {part.exerciseCount}
          </div>
          <Part key={part.name} part={part} />
        </>
      ))}
    </div>
  );
};

export default Content;
