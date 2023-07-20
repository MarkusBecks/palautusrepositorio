import axios from 'axios';
import { Diary } from '../types';

const baseUrl = 'http://localhost:3001';

const getDiaries = async () => {
  try {
    const response = await axios.get<Diary[]>(`${baseUrl}/api/diaries`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

const createDiary = async (diaryEntry: Diary) => {
  try {
    const response = await axios.post<Diary>(
      `${baseUrl}/api/diaries`,
      diaryEntry
    );
    return response.data;
  } catch (error) {
    console.error('Error adding diary', error);
    throw error;
  }
};

export { getDiaries, createDiary };
