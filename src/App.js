import { Route, Routes } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import CreateScreen from './screens/CreateScreen';
import Layout from './components/Layout/Layout';
import NotFoundScreen from './screens/NotFoundScreen';
import DetailCourseScreen from './screens/DetailCourseScreen';
import LearnScreen from './screens/LearnScreen';

function App() {
  return (
    <Routes>
      <Route path={'/'} element={<Layout />}>
        <Route path={'/'} element={<HomeScreen title={'Home | AdonisGM'}/>} />
        <Route path={'/create'} element={<CreateScreen title={'Create course | AdonisGM'}/>} />
        <Route path={'/course/:id'} element={<DetailCourseScreen title={'Detail course | AdonisGM'}/>} />
        <Route path={'/learn/:id'} element={<LearnScreen title={'Detail course | AdonisGM'}/>} />
      </Route>
      <Route path={'*'} element={<NotFoundScreen title={'Not found | AdonisGM'}/>} />
    </Routes>
  );
}

export default App;
