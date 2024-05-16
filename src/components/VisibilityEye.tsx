import React from "react";
import visibilityEye from "@/assets/SVG/visibilityEye.svg";
import { IVisibilityEye } from "../models/visibility-eye.interface";

const VisibilityEyeButton: React.FC<IVisibilityEye> = ({ visibility, setVisibility }) => {
  const handleOnClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    visibility === "text" ? setVisibility("password") : setVisibility("text");
  };
  return (
    <button onClick={handleOnClick}>
      <img src={visibilityEye.toString()} alt="visibility eye" />
    </button>
  );
};

export default VisibilityEyeButton;
