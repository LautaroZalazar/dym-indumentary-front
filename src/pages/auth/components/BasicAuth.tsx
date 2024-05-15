import React from "react";
import Button from "./button";
import { IBasicAuth } from "../models/basic-auth.interface";

const BasicAuth: React.FC<IBasicAuth> = ({ setIsSelected }) => {

  return (
      <div className="flex flex-col justify-center items-center w-full h-2/4 gap-y-5">
        <Button name="Sign In" primary={false} onClick={() => setIsSelected("SignIn")} />
        <Button name="Log In" primary={true} onClick={() => setIsSelected("LogIn")} />
      </div>
  );
};

export default BasicAuth;
