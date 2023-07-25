import { NewPatient, Gender, Entry, Patient, Diagnosis } from './types';

const isString = (text: unknown): text is string => {
	return typeof text === 'string' || text instanceof String;
};

const parseName = (name: unknown): string => {
	if (!isString(name)) {
		throw new Error('Incorrect or missing name');
	}

	return name;
};

const parseSsn = (ssn: unknown): string => {
	if (!isString(ssn)) {
		throw new Error('Incorrect or missing ssn');
	}

	return ssn;
};

const parseOccupation = (occupation: unknown): string => {
	if (!isString(occupation)) {
		throw new Error('Incorrect or missing occupation');
	}

	return occupation;
};

const isDate = (date: string): boolean => {
	return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
	if (!isString(date) || !isDate(date)) {
		throw new Error('Incorrect date of birth: ' + date);
	}
	return date;
};

const isGender = (param: string): param is Gender => {
	return Object.values(Gender)
		.map((v) => v.toString())
		.includes(param);
};

const parseGender = (gender: unknown): Gender => {
	if (!isString(gender) || !isGender(gender)) {
		throw new Error('Incorrect gender: ' + gender);
	}
	return gender;
};

export const isValidEntry = (entry: Entry): boolean => {
	// Check for common properties in all entry types
	if (
		!(
			'description' in entry &&
			'date' in entry &&
			'type' in entry &&
			'specialist' in entry
		)
	) {
		return false;
	}

	// Check for specific Entry type properties
	switch (entry.type) {
		case 'HealthCheck':
			return 'healthCheckRating' in entry;
		case 'Hospital':
			return (
				'discharge' in entry &&
				typeof entry.discharge === 'object' &&
				'date' in entry.discharge &&
				'criteria' in entry.discharge
			);
		case 'OccupationalHealthcare':
			return 'employerName' in entry;
		default:
			return false;
	}
};

export const parseDiagnosisCodes = (
	object: unknown
): Array<Diagnosis['code']> => {
	if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
		// we will just trust the data to be in correct form
		return [] as Array<Diagnosis['code']>;
	}

	return object.diagnosisCodes as Array<Diagnosis['code']>;
};

const toNewPatientEntry = (patient: Patient): NewPatient => {
	console.log('Request Body Data:', patient);
	if (!patient || typeof patient !== 'object') {
		throw new Error('Incorrect or missing data');
	}

	if (
		'name' in patient &&
		'ssn' in patient &&
		'occupation' in patient &&
		'dateOfBirth' in patient &&
		'gender' in patient
	) {
		const { name, dateOfBirth, ssn, gender, occupation } = patient;

		if (!name || !dateOfBirth || !ssn || !gender || !occupation) {
			throw new Error('Incorrect data: some fields are missing or empty');
		}
		console.log(patient);

		/* if (!isValidEntry(entries)) {
			throw new Error('Incorrect data: invalid entries');
		} */

		const newEntry: NewPatient = {
			name: parseName(name),
			dateOfBirth: parseDate(dateOfBirth),
			ssn: parseSsn(ssn),
			gender: parseGender(gender),
			occupation: parseOccupation(occupation),
			entries: [],
		};
		console.log('newEntry: ', newEntry);
		return newEntry;
	}

	throw new Error('Incorrect data: some fields are missing');
};

export default toNewPatientEntry;
