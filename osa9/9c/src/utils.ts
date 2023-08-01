import {
	NewPatient,
	Gender,
	Patient,
	Diagnosis,
	EntryWithoutId,
	OccupationalHealthcareEntry,
	HealthCheckRating,
} from './types';

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

interface Discharge {
	date: string;
	criteria: string;
}

const isValidDischarge = (discharge: unknown): discharge is Discharge => {
	if (!discharge || typeof discharge !== 'object') {
		return false;
	}

	return (
		'date' in discharge &&
		isString(discharge.date) &&
		discharge.date.trim() !== '' &&
		'criteria' in discharge &&
		isString(discharge.criteria) &&
		discharge.criteria.trim() !== ''
	);
};

const isValidSickLeave = (
	sickLeave: unknown
): sickLeave is OccupationalHealthcareEntry['sickLeave'] => {
	if (!sickLeave || typeof sickLeave !== 'object') {
		// if sickLeave is not provided or not an object, consider it valid as optional
		return true;
	}

	// Check for the presence and validity of startDate and endDate
	if (
		'startDate' in sickLeave &&
		isString(sickLeave.startDate) &&
		sickLeave.startDate.trim() !== ''
	) {
		if (
			'endDate' in sickLeave &&
			isString(sickLeave.endDate) &&
			sickLeave.endDate.trim() !== ''
		) {
			// Both startDate and endDate are provided and valid
			return true;
		} else {
			// only start Date is provided (endDate is missing or invalid)
			return false;
		}
	} else {
		// startDate is missing or invalid
		if ('endDate' in sickLeave) {
			// if endDate is provided without startDate, consider it invalid
			return false;
		} else {
			// Both startDate and endDate are missing, which is valid
			return true;
		}
	}
};

export const isInvalidEntry = (entry: EntryWithoutId): string | null => {
	// Check that properties exist in entry object
	if (
		!(
			'description' in entry &&
			'date' in entry &&
			'type' in entry &&
			'specialist' in entry
		)
	) {
		return 'Entry is missing required properties';
	}

	// Check that common properties are not empty strings
	if (!isString(entry.description) || entry.description.trim() === '') {
		return 'Description missing or empty.';
	}

	if (!isString(entry.date) || entry.date.trim() === '') {
		return 'Date missing or empty.';
	}

	if (!isString(entry.type) || entry.type.trim() === '') {
		return 'Type missing or empty.';
	}

	if (!isString(entry.specialist) || entry.specialist.trim() === '') {
		return 'Specialist missing or empty.';
	}

	// Check for specific Entry type properties
	switch (entry.type) {
		case 'HealthCheck':
			if (
				!('healthCheckRating' in entry) ||
				typeof entry.healthCheckRating !== 'number' ||
				!Object.values(HealthCheckRating).includes(entry.healthCheckRating)
			) {
				return 'HealthCheck Rating must be between 0-3.';
			}
			break;
		case 'Hospital':
			if (!('discharge' in entry && isValidDischarge(entry.discharge))) {
				return 'Discharge date or criteria invalid/missing.';
			}
			break;
		case 'OccupationalHealthcare':
			if (
				!(
					'employerName' in entry &&
					isString(entry.employerName) &&
					entry.employerName.trim() !== ''
				)
			) {
				return 'Employer name invalid or missing.';
			}
			if (!isValidSickLeave(entry.sickLeave)) {
				return 'Must provide both start and end dates for sick leave.';
			}
			break;
		default:
			return 'Invalid entry type';
	}

	return null;
};

export const parseDiagnosisCodes = (
	object: unknown
): Array<Diagnosis['code']> => {
	if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
		// we will just trust the data to be in correct form
		return [] as Array<Diagnosis['code']>;
	}

	console.log('parseDiagnosisCodes object:', object.diagnosisCodes);
	return object.diagnosisCodes as Array<Diagnosis['code']>;
};

const toNewPatientEntry = (patient: Patient): NewPatient => {
	console.log('toNewPatientEntry Request Body Data:', patient);
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
		console.log('toNewPatientEntry patient: ', patient);

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
