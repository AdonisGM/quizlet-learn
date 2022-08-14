import { useEffect } from 'react';
import ExamPmg from '../components/ExamPmg/ExamPmg';

const ExamPmgScreen = ({ title }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return <ExamPmg />;
};

export default ExamPmgScreen;
