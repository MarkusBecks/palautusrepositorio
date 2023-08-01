import diagnoses from '../../data/diagnoses';
import { Diagnosis } from '../types';

const getDiagnoses = (): Diagnosis[] => {
	return diagnoses;
};

export const getDiagnosesWithLabels = (): {
	value: string;
	label: string;
}[] => {
	return diagnoses.map((diagnosis) => ({
		value: diagnosis.code,
		label: `${diagnosis.code} - ${diagnosis.name}`,
	}));
};

export default {
	getDiagnoses,
};
