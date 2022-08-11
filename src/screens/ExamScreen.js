import { useEffect } from 'react';
import Exam from '../components/Exam/Exam';

const ExamScreen = ({ title }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return <Exam />;
};

export default ExamScreen;
