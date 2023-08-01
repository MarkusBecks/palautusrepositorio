import express, { Request, Response } from 'express';
import patientService from '../services/patientService';
import toNewPatientEntry from '../utils';
import { Patient, Params, EntryWithoutId } from '../types';
import { parseDiagnosisCodes, isInvalidEntry } from '../utils';

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
	(req: Request<Params, unknown, EntryWithoutId>, res: Response) => {
		console.log('Request Body:', req.body); // Log the received request body
		const entry = req.body;
		console.log('Entry:', entry);
		const { id: patientId } = req.params;

		try {
			console.log('Entry:', entry); // Log the extracted entry object
			const patient = patientService.getPatient(patientId);

			if (!patient) {
				return res.status(404).json({ error: 'Patient not found' });
			}

			// Validate the entry using isValidEntry
			const validationErrorMessage = isInvalidEntry(entry);
			if (validationErrorMessage) {
				return res.status(400).json({ error: validationErrorMessage });
			}

			// Parse diagnosis codes
			const diagnosisCodes = parseDiagnosisCodes(entry);
			const modifiedEntry = { ...entry, diagnosisCodes };
			console.log('modifiedEntry:', modifiedEntry);

			const modifiedPatient = patientService.addEntry(patientId, modifiedEntry);
			console.log('Modified Patient:', modifiedPatient); // Log the updated patient
			return res.json(modifiedPatient);
		} catch (error: unknown) {
			let errorMessage = 'Failed to add entry.';
			if (error instanceof Error) {
				errorMessage += ' Error: ' + error.message;
			}
			console.error(errorMessage); // Log the error
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
		let errorMessage = 'Adding patient failed.';
		if (error instanceof Error) {
			errorMessage += ' Error: ' + error.message;
		}
		res.status(400).send(errorMessage);
	}
});

export default router;
