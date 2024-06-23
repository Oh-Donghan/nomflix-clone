import { useEffect, useState } from 'react';

function getWindowDimensions() {
  const { innerWidth: width } = window;
  return width;
}

function useWindowDimensions() {
  const [windowD, setWindowD] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowD(getWindowDimensions());
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return windowD;
}

export default useWindowDimensions;
