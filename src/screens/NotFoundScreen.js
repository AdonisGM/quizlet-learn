import { useEffect } from 'react';
import NotFound from '../components/NotFound/NotFound';

const NotFoundScreen = ({ title }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return <NotFound />;
};

export default NotFoundScreen;
