import React from "react";
import Tilt from "react-parallax-tilt";
import BrainImage from "../assests/images/brain.png";
import "./Logo.scss";

const Logo = () => {
  return (
    <div className="ma4 mt10">
      <Tilt
        className="tilt-in br2 shadow-2"
        style={{ width: 150, height: 150 }}
      >
        <img src={BrainImage} alt="brain" />
      </Tilt>
    </div>
  );
};

export default Logo;
