import { SyntheticEvent, useState } from 'react';
import { Diary, ValidationError } from '../types';
import { createDiary } from '../services/diaries';
import Notification from './Notification';
import axios from 'axios';

interface AddDiaryProps {
  onAddDiary: (diary: Diary) => void;
}

const AddDiary = ({ onAddDiary }: AddDiaryProps) => {
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState('');
  const [visibility, setVisibility] = useState('');
  const [comment, setComment] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    const diaryEntry: Diary = {
      date,
      weather,
      visibility,
      comment,
    };
    try {
      const addedDiary = await createDiary(diaryEntry);
      onAddDiary(addedDiary);
      setDate('');
      setWeather('');
      setVisibility('');
      setComment('');
    } catch (error) {
      if (axios.isAxiosError<ValidationError>(error)) {
        setErrorMessage(JSON.stringify(error.response?.data || null));
        setTimeout(() => setErrorMessage(null), 5000); // Clear the error message after 5 seconds
      } else {
        console.error('Error adding diary', error);
      }
    }
  };

  return (
    <div>
      <h2>Add new entry</h2>
      {errorMessage && <Notification message={errorMessage} />}
      <form onSubmit={handleSubmit}>
        <label>
          Date:
          <input
            type="date"
            name="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </label>
        <fieldset>
          <legend>Visibility</legend>
          <div>
            <input
              type="radio"
              id="great"
              name="visibility"
              value="great"
              checked={visibility === 'great'}
              onChange={() => setVisibility('great')}
            />
            <label htmlFor="great">great</label>

            <input
              type="radio"
              id="good"
              name="visibility"
              value="good"
              checked={visibility === 'good'}
              onChange={() => setVisibility('good')}
            />
            <label htmlFor="good">good</label>

            <input
              type="radio"
              id="ok"
              name="visibility"
              value="ok"
              checked={visibility === 'ok'}
              onChange={() => setVisibility('ok')}
            />
            <label htmlFor="ok">ok</label>

            <input
              type="radio"
              id="poor"
              name="visibility"
              value="poor"
              checked={visibility === 'poor'}
              onChange={() => setVisibility('poor')}
            />
            <label htmlFor="poor">poor</label>
          </div>
        </fieldset>
        <fieldset>
          <legend>Weather</legend>
          <div>
            <input
              type="radio"
              id="sunny"
              name="weather"
              value="sunny"
              checked={weather === 'sunny'}
              onChange={() => setWeather('sunny')}
            />
            <label htmlFor="sunny">sunny</label>

            <input
              type="radio"
              id="rainy"
              name="weather"
              value="rainy"
              checked={weather === 'rainy'}
              onChange={() => setWeather('rainy')}
            />
            <label htmlFor="rainy">rainy</label>

            <input
              type="radio"
              id="cloudy"
              name="weather"
              value="cloudy"
              checked={weather === 'cloudy'}
              onChange={() => setWeather('cloudy')}
            />
            <label htmlFor="cloudy">cloudy</label>

            <input
              type="radio"
              id="stormy"
              name="weather"
              value="stormy"
              checked={weather === 'stormy'}
              onChange={() => setWeather('stormy')}
            />
            <label htmlFor="stormy">stormy</label>

            <input
              type="radio"
              id="windy"
              name="weather"
              value="windy"
              checked={weather === 'windy'}
              onChange={() => setWeather('windy')}
            />
            <label htmlFor="windy">windy</label>
          </div>
        </fieldset>
        <div>
          <legend>Comment:</legend>
          <textarea
            name="comment"
            id="comment"
            cols={50}
            rows={10}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          ></textarea>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  );
};

export default AddDiary;
