import { Route, Routes } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import CreateScreen from './screens/CreateScreen';
import Layout from './components/Layout/Layout';
import NotFoundScreen from './screens/NotFoundScreen';
import DetailCourseScreen from './screens/DetailCourseScreen';
import LearnScreen from './screens/LearnScreen';
import ExamScreen from './screens/ExamScreen';
import LearnPmgScreen from './screens/LearnPmgScreen';
import ExamScreenPmg from './screens/ExamPmgScreen';
import MessageScreen from './screens/MessageScreen';

import ReactGA from 'react-ga4';
import { useEffect } from 'react';
import MergeScreen from './screens/MergeScreen';
ReactGA.initialize('G-FLXKD35453');

function App() {
  useEffect(() => {
    // Send pageview with a custom path
    ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
  }, []);

  return (
    <Routes>
      <Route path={'/'} element={<Layout />}>
        <Route path={'/'} element={<HomeScreen title={'Home | AdonisGM'} />} />
        <Route
          path={'/create'}
          element={<CreateScreen title={'Create course | AdonisGM'} />}
        />
        <Route
          path={'/course/:id'}
          element={<DetailCourseScreen title={'Detail course | AdonisGM'} />}
        />
        <Route
          path={'/learn/:id'}
          element={<LearnScreen title={'Learn course | AdonisGM'} />}
        />
        <Route
          path={'/learn/pmg/:id'}
          element={<LearnPmgScreen title={'Learn PMG course | AdonisGM'} />}
        />
        <Route
          path={'/merge'}
          element={<MergeScreen title={'Merge course | AdonisGM'} />}
        />
      </Route>
      <Route
        path={'/course/:id/exam'}
        element={<ExamScreen title={'Exam Pmg Screen | AdonisGM'} />}
      />
      <Route
        path={'/message'}
        element={<MessageScreen title={'Message | AdonisGM'} />}
      />
      <Route
        path={'/course/pmg/:id/exam'}
        element={<ExamScreenPmg title={'Exam Pmg Screen | AdonisGM'} />}
      />
      <Route
        path={'*'}
        element={<NotFoundScreen title={'Not found | AdonisGM'} />}
      />
    </Routes>
  );
}

export default App;
