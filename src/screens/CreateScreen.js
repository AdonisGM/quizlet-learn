import Create from '../components/Create/Create';
import { useEffect } from 'react';

const CreateScreen = ({title}) => {
  useEffect(() => {
    document.title = title;
  }, [title])

  return <Create/>
}

export default CreateScreen;