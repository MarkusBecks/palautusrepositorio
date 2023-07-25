import express, { Request, Response } from 'express';
import patientService from '../services/patientService';
import toNewPatientEntry from '../utils';
import { Patient, EntryRequestBody, Params } from '../types';
import { isValidEntry, parseDiagnosisCodes } from '../utils';

const router = express.Router();

router.get('/:id', (req, res) => {
	const { id } = req.params;
	const patient = patientService.getPatient(id);

	if (!patient) {
		return res.status(404).json({ error: 'Patient not found' });
	}
	return res.send(patient);
});

router.get('/', (_req, res) => {
	res.send(patientService.getNonSensitivePatientEntries());
	console.log('fetching patients');
});

router.post(
	'/:id/entries',
	(req: Request<Params, unknown, EntryRequestBody>, res: Response) => {
		const { entry } = req.body;
		const { id: patientId } = req.params;

		try {
			const patient = patientService.getPatient(patientId);

			if (!patient) {
				return res.status(404).json({ error: 'Patient not found' });
			}

			// Validate the entry using isValidEntry
			const validationErrors = isValidEntry(entry);
			if (!validationErrors) {
				return res.status(400).json({ error: 'Invalid entry data' });
			}

			// Parse diagnosis codes
			const diagnosisCodes = parseDiagnosisCodes(entry);
			const modifiedEntry = { ...entry, diagnosisCodes };

			const modifiedPatient = patientService.addEntry(patientId, modifiedEntry);
			return res.json(modifiedPatient);
		} catch (error: unknown) {
			let errorMessage = 'Something went wrong.';
			if (error instanceof Error) {
				errorMessage += ' Error: ' + error.message;
			}
			return res.status(400).send(errorMessage);
		}
	}
);

router.post('/', (req: Request<object, unknown, Patient>, res: Response) => {
	try {
		const newPatientEntry = toNewPatientEntry(req.body);
		const addedEntry = patientService.addPatient(newPatientEntry);
		res.json(addedEntry);
	} catch (error: unknown) {
		let errorMessage = 'Something went wrong.';
		if (error instanceof Error) {
			errorMessage += ' Error: ' + error.message;
		}
		res.status(400).send(errorMessage);
	}
});

export default router;
