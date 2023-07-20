import { useState, useEffect } from 'react';
import { getDiaries } from './services/diaries';
import { Diary } from './types';
import AddDiary from './components/AddDiary';

const App = () => {
  const [diaries, setDiaries] = useState<Diary[]>([]);

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        const diariesData = await getDiaries();
        setDiaries(diariesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDiaries();
  }, []);

  const handleAddDiary = (newDiary: Diary) => {
    try {
      setDiaries((prevDiaries) => [...prevDiaries, newDiary]);
    } catch (error) {
      console.error('an unknown error occurred');
    }
  };

  return (
    <div>
      <AddDiary onAddDiary={handleAddDiary} />
      <h1>Diary Entries</h1>
      <ul>
        {diaries.map((diary, index) => (
          <li key={index}>
            <h2>Date: {diary.date}</h2>
            <ul>
              <li>Weather: {diary.weather}</li>
              <li>Visibility: {diary.visibility}</li>
              <li>Comment: {diary.comment}</li>
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
