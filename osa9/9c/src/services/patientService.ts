import patients from '../../data/patients';
import { NonSensitivePatientEntry, Patient, NewPatient } from '../types';
import { v4 as uuidv4 } from 'uuid';

const getPatients = (): Patient[] => {
	return patients;
};

const getNonSensitivePatientEntries = (): NonSensitivePatientEntry[] => {
	return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
		id,
		name,
		dateOfBirth,
		gender,
		occupation,
	}));
};

const addPatient = (entry: NewPatient): Patient => {
	const newPatientEntry = {
		id: uuidv4(),
		...entry,
	};

	console.log('newPatientEntry :', newPatientEntry);

	patients.push(newPatientEntry);
	return newPatientEntry;
};

export default {
	getPatients,
	getNonSensitivePatientEntries,
	addPatient,
};
