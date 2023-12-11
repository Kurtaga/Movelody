import React, { useContext } from "react";
import "./Footer.css";
import pause from "../../assets/pause.svg";
import play from "../../assets/play.svg";
import { AppContext } from "../AppContext/AppContext";

const Footer = () => {
  const { paused, setPaused } = useContext(AppContext);

  const handleClick = () => {
    setPaused(!paused);
  };
  return (
    <div className="footer">
      <span>
        <p className="title">Title</p>
        <p className="playing-now">Playing now</p>
      </span>
      <img src={(paused && play) || pause} onClick={handleClick} />
    </div>
  );
};

export default Footer;
