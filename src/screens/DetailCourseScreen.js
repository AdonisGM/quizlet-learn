import DetailCourse from '../components/DetailCourse/DetailCourse';
import { useEffect } from 'react';

const DetailCourseScreen = ({ title }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return <DetailCourse />;
};

export default DetailCourseScreen;
