import React from "react";
import Button from "./button";
import { IBasicAuth } from "../models/basic-auth.interface";

const BasicAuth: React.FC<IBasicAuth> = ({ setIsSelected }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-5 mt-4">
      <Button name="Sign In" primary={false} onClick={() => setIsSelected("SignIn")} />
      <Button name="Log In" primary={true} onClick={() => setIsSelected("LogIn")} />
    </div>
  );
};

export default BasicAuth;
