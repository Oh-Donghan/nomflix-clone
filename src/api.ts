import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_PATH = 'https://api.themoviedb.org/3';

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export const getTv = async (category:string) => {
  const response = await axios.get(
    `${BASE_PATH}/tv/${category}?api_key=${API_KEY}`
  );
  return response.data;
};

// axios 사용
export const getMovies = async (category: string) => {
  const response = await axios.get(
    `${BASE_PATH}/movie/${category}?api_key=${API_KEY}`
  );
  return response.data;
};

// fetch 사용
// export function getMovies() {
//   return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
//     (response) => response.json()
//   );
// }
