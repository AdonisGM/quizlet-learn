import Create from '../components/Create/Create';
import { useEffect } from 'react';
import ReactGA from 'react-ga4';

const CreateScreen = ({ title }) => {
  useEffect(() => {
    document.title = title;
    ReactGA.event({ category: 'Create', action: 'Create course' });
  }, [title]);

  return <Create />;
};

export default CreateScreen;
