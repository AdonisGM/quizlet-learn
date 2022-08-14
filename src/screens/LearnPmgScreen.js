import { useEffect } from "react";
import LearnPmg from "../components/LearnPmg/LearnPmg";

const LearnPmgScreen = ({title}) => {
  useEffect(() => {
    document.title = title;
  }, [title])

  return <LearnPmg/>;
}

export default LearnPmgScreen;