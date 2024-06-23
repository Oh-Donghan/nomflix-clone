import { HashRouter, Route, Routes } from 'react-router-dom';
import Home from './Routes/Home';
import Tv from './Routes/Tv';
import Search from './Routes/Search';
import Header from './components/Header';

function Router() {
  return (
    <HashRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="movies/:movieId" element={<Home />} />
        <Route path='/tv' element={<Tv />} />
        <Route path='tv/:id' element={<Tv />} />
        <Route path='/search' element={<Search />} />
      </Routes>
    </HashRouter>
  );
}

export default Router;
