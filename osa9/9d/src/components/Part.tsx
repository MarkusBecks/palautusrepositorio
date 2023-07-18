import { CoursePart } from '../types';

interface PartProps {
  part: CoursePart;
}

const styles = {
  fontStyle: 'italic',
  marginTop: '0',
};

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Part = ({ part }: PartProps) => {
  switch (part.kind) {
    case 'basic':
      return (
        <>
          <p style={styles}>{part.description}</p>
        </>
      );
    case 'group':
      return (
        <>
          <p style={styles}>Project exercises {part.groupProjectCount}</p>
        </>
      );
    case 'background':
      return (
        <div>
          <p style={styles}>{part.description}</p>
          <p>read more: {part.backgroundMaterial}</p>
        </div>
      );
    case 'special':
      return (
        <div>
          <p style={styles}>{part.description}</p>
          <p>required skills: {part.requirements.join(', ')}</p>
        </div>
      );
    default:
      return assertNever(part);
  }
};

export default Part;
