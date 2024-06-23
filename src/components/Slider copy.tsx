import { AnimatePresence, motion } from 'framer-motion';
import styled from 'styled-components';
import { makeImagePath } from '../utilities';
import { useState } from 'react';
import useWindowDimensions from './WindowDimensions';
import { IMovie } from '../api';
import { useMatch, useNavigate } from 'react-router-dom';

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: 'tween',
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: 'tween',
    },
  },
};

const offset = 6;

export default function Slider({
  title,
  category,
}: {
  title: string;
  category: IMovie[];
}) {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const navigate = useNavigate();
  const bigMovieMatch = useMatch('/movies/:movieId');

  // 실시간 window width
  const windowD = useWindowDimensions();

  // index를 늘리는 함수 (데이터를 받아와서 배너용 아이템을 뺀 나머지를 계산해서 보여주기)
  const increaseIndex = () => {
    // 타입스크립트 에러 방지를 위해 data가 있는지 먼저 확인
    if (category) {
      // leaving 광클 방지 상태 - leaving이 true일때 리턴 (false일때만 슬라이드 되게하기)
      if (leaving) return;
      toggleLeaving();
      const totalMovies = category.length - 1;
      // data를 6개로 나눠서(offset) 개수에 맞게 자르기(6개씩, 남는data는 버리기)
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  // toggleLeaving - 클릭할때마다 boolean 반전을 주기
  const toggleLeaving = () => setLeaving((prev) => !prev);

  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };

  const onOverlayClick = () => navigate('/');

  const clickMovie =
    bigMovieMatch?.params.movieId &&
    category?.find((movie) => movie.id === +bigMovieMatch.params.movieId!);

  return (
    <Wrapper>
      <Title>{title}</Title>
      <MovieSlider>
        <div onClick={increaseIndex}>click</div>
        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
          <Row
            initial={{ x: windowD + 10 }}
            animate={{ x: 0 }}
            exit={{ x: -windowD - 10 }}
            transition={{ type: 'tween', duration: 1 }}
            key={index}
          >
            {category
              .slice(1)
              .slice(offset * index, offset * index + offset)
              .map((movie) => (
                <Box
                  onClick={() => onBoxClicked(movie.id)}
                  key={movie.id}
                  layoutId={movie.id + ''}
                  variants={boxVariants}
                  initial='normal'
                  whileHover='hover'
                  transition={{ type: 'tween' }}
                  $bgPhoto={makeImagePath(movie.backdrop_path, 'w500')}
                >
                  <Info variants={infoVariants}>
                    <h4>{movie.title}</h4>
                  </Info>
                </Box>
              ))}
          </Row>
        </AnimatePresence>
      </MovieSlider>
      <AnimatePresence>
        {bigMovieMatch ? (
          <>
            <Overlay
              onClick={onOverlayClick}
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
            <MovieModal layoutId={bigMovieMatch.params.movieId}>
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
                </>
              ) : (
                <Error>NO DATA</Error>
              )}
            </MovieModal>
          </>
        ) : null}
      </AnimatePresence>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  top: -220px;
`;

const MovieSlider = styled.div`
  height: 250px;
  margin-bottom: 20px;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ $bgPhoto: string }>`
  background-color: #fff;
  background-image: url(${(props) => props.$bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Title = styled.h2`
  padding: 5px 20px;
  font-weight: bold;
  font-size: 28px;
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
  text-align: center;
  font-size: 32px;
  position: relative;
  top: -60px;
`;

const Error = styled.div`
  text-align: center;
  line-height: 400px;
`;
