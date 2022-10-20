import Home from '../components/Home/Home';
import { useEffect } from 'react';
import ReactGA from 'react-ga4';

const HomeScreen = ({ title }) => {
  useEffect(() => {
    document.title = title;
    ReactGA.event({ category: 'Home', action: 'Home Event' });
  }, [title]);

  return <Home />;
};

export default HomeScreen;
