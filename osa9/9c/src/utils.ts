import { NewPatient, Gender } from './types';

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

const toNewPatientEntry = (object: unknown): NewPatient => {
	if (!object || typeof object !== 'object') {
		throw new Error('Incorrect or missing data');
	}

	if (
		'name' in object &&
		'ssn' in object &&
		'occupation' in object &&
		'dateOfBirth' in object &&
		'gender' in object
	) {
		const { name, dateOfBirth, ssn, gender, occupation } = object;

		if (!name || !dateOfBirth || !ssn || !gender || !occupation) {
			throw new Error('Incorrect data: some fields are missing or empty');
		}

		const newEntry: NewPatient = {
			name: parseName(name),
			dateOfBirth: parseDate(dateOfBirth),
			ssn: parseSsn(ssn),
			gender: parseGender(gender),
			occupation: parseOccupation(occupation),
		};

		return newEntry;
	}

	throw new Error('Incorrect data: some fields are missing');
};

export default toNewPatientEntry;
