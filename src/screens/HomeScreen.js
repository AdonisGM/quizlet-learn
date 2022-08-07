import Home from '../components/Home/Home'
import { useEffect } from 'react';

const HomeScreen = ({title}) => {
  useEffect(() => {
    document.title = title;
  }, [title])

  return <Home/>;
}

export default HomeScreen;