import { useQuery } from "@tanstack/react-query"
import { IGetMoviesResult, getMovies } from "../api"

const useMultipleQuery = () => {
  const nowPlaying = useQuery<IGetMoviesResult>({queryKey: ['movies', 'nowPlaying'], queryFn: () => getMovies('now_playing')});
  const topRated = useQuery<IGetMoviesResult>({queryKey: ['movies', 'topRated'], queryFn: () => getMovies('top_rated')});
  const upcoming = useQuery<IGetMoviesResult>({queryKey: ['movies', 'upcoming'], queryFn: () => getMovies('upcoming')});
  return [nowPlaying, topRated, upcoming];
};

export default useMultipleQuery;