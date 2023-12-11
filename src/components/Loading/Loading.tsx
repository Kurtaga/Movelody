import { useContext } from "react";
import { AppContext } from "../AppContext/AppContext";
import "./Loading.css";

const Loading = () => {
  const { loading } = useContext(AppContext);

  return (
    loading && (
      <div className="loading">
        <div className="loader"></div>
      </div>
    )
  );
};

export default Loading;
