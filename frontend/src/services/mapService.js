import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const getPlaces = async (selectedWords) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/places`, {
      keyword : selectedWords
    });
    return response.data.places;
  } catch (error) {
    throw new Error('검색 중 오류가 발생했습니다.');
  }
};