import React from "react";
import logo from "@/assets/SVG/logo.svg";
import Button from "./button";
import { IBasicAuth } from "../models/basic-auth.interface";

const BasicAuth: React.FC<IBasicAuth> = ({ setIsSelected }) => {
  return (
    <div className="flex flex-col w-full h-screen bg-[#18151A]">
      <div className="flex justify-center items-center w-full h-2/4">
        <img src={logo.toString()} alt="logo" className="as:size-40 size-full" />
      </div>
      <div className="flex flex-col justify-center items-center w-full h-2/4 gap-y-5">
        <Button name="Sign In" primary={false} onClick={() => setIsSelected("SignIn")} />
        <Button name="Log In" primary={true} onClick={() => setIsSelected("LogIn")} />
      </div>
    </div>
  );
};

export default BasicAuth;
