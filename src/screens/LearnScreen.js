import { useEffect } from "react";
import Learn from "../components/Learn/Learn";

const LearnScreen = ({title}) => {
  useEffect(() => {
    document.title = title;
  }, [title])

  return <Learn/>;
}

export default LearnScreen;