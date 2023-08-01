import patients from '../../data/patients';
import {
	NonSensitivePatientEntry,
	Patient,
	NewPatient,
	Entry,
	EntryWithoutId,
} from '../types';
import { v4 as uuidv4 } from 'uuid';

const getPatients = (): Patient[] => {
	return patients;
};

const getPatient = (id: string): Patient | undefined => {
	return patients.find((patient) => patient.id === id);
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
		entries: [] as Entry[],
	};

	console.log('new patient :', newPatientEntry);

	patients.push(newPatientEntry);
	return newPatientEntry;
};

const addEntry = (patientId: string, entry: EntryWithoutId): Patient => {
	const foundPatient = getPatient(patientId);

	if (!foundPatient) {
		throw new Error('Patient not found');
	}

	const newEntry = { ...entry, id: uuidv4() };
	console.log('newEntry:', newEntry);

	foundPatient.entries.push(newEntry);
	console.log('foundPatient:', foundPatient);

	return foundPatient;
};

export default {
	getPatients,
	getPatient,
	getNonSensitivePatientEntries,
	addPatient,
	addEntry,
};
