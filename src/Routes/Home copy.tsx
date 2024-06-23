import styled from 'styled-components';
import { makeImagePath } from '../utilities';
import useMultipleQuery from '../components/useMultipleQuery';
import Slider from '../components/Slider';

function Home() {
  const [
    { isLoading: loadingNowPlaying, data: nowPlayingData },
    { isLoading: loadingTopRated, data: topRatedData },
    { isLoading: loadingUpcoming, data: upcomingData },
  ] = useMultipleQuery();

  const isLoading = loadingNowPlaying || loadingTopRated || loadingUpcoming;

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            $bgPhoto={makeImagePath(
              nowPlayingData?.results[0].backdrop_path || ''
            )}
          >
            <Title>{nowPlayingData?.results[0].title}</Title>
            <Overview>{nowPlayingData?.results[0].overview}</Overview>
          </Banner>
          <Slider
            title='Now Playing'
            category={nowPlayingData?.results || []}
          />
          <Slider title='Top Rated' category={topRatedData?.results || []} />
          <Slider title='Upcoming' category={upcomingData?.results || []} />
        </>
      )}
    </Wrapper>
  );
}

export default Home;

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
