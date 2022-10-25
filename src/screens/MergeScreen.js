import { useEffect } from "react"
import Merge from "../components/Merge/Merge"
import ReactGA from 'react-ga4';

const MergeScreen = ({title}) => {
  useEffect(() => {
    document.title = title
    ReactGA.event({ category: 'Merge', action: 'Merge course' });
  }, []);

  return (
    <Merge/>
  )
}

export default MergeScreen