import { useQuery } from '@tanstack/react-query';
import { IGetMoviesResult, getTv } from '../api';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import { makeImagePath } from "../utilities";
import Slider from "../components/Slider";
import { useMatch, useNavigate } from "react-router-dom";

function Tv() {
  const { isLoading: popularLoading, data: popularData } = useQuery<IGetMoviesResult>({
    queryKey: ['tv', 'popular'],
    queryFn: () => getTv('popular'),
  });
  const { isLoading: airingLoading, data: airingData } = useQuery<IGetMoviesResult>({
    queryKey: ['tv', 'airing_today'],
    queryFn: () => getTv('airing_today'),
  });
  const { isLoading: ratedLoading, data: ratedData } = useQuery<IGetMoviesResult>({
    queryKey: ['tv', 'top_rated'],
    queryFn: () => getTv('top_rated'),
  });

  const navigate = useNavigate();
  const bigMovieMatch = useMatch('/tv/:Id');


  const allDataSets = [popularData, airingData, ratedData];
  
  const onOverlayClick = () => navigate('/tv');
  
  const findMovieById = (
    movieId: number,
    dataSets: (IGetMoviesResult | undefined)[]
  ) => {
    for (const dataSet of dataSets) {
      const found = dataSet?.results.find((movie) => movie.id === movieId);
      if (found) return found;
    }
    return null;
  };
  
  const movieId =
  bigMovieMatch?.params.Id && +bigMovieMatch.params.Id;
  
  const clickMovie = movieId && findMovieById(movieId, allDataSets);

  const isLoading = popularLoading || airingLoading || ratedLoading;

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            $bgPhoto={makeImagePath(
              airingData?.results[0].backdrop_path || ''
            )}
          >
            <Title>{airingData?.results[0].title}</Title>
            <Overview>{airingData?.results[0].overview}</Overview>
          </Banner>
          <Slider
            title='Airing Today'
            category={airingData?.results || []}
          />
          <Slider title='Popular' category={popularData?.results || []} />
          <Slider title='Top Rated' category={ratedData?.results || []} />
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <MovieModal layoutId={bigMovieMatch.params.Id}>
                  {clickMovie ? (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickMovie.backdrop_path,
                            'w500'
                          )})`,
                        }}
                      />
                      <BigTitle>{clickMovie.title}</BigTitle>
                      <BigOverview>{clickMovie.overview}</BigOverview>
                    </>
                  ) : (
                    <Error>NO DATA</Error>
                  )}
                </MovieModal>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Tv;

const Wrapper = styled.div`
  position: relative;
  background: black;
  padding-bottom: 200px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ $bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.$bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 24px;
  width: 50%;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const MovieModal = styled(motion.div)`
  position: fixed;
  width: 60vw;
  height: 70vh;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center center;
`;

const BigTitle = styled.h2`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 32px;
  position: relative;
  top: -80px;
`;

const Error = styled.div`
  text-align: center;
  line-height: 400px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;
