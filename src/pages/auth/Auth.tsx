import { useState } from "react";
import BasicAuth from "./components/BasicAuth";
import Login from "./login/Login";

const Auth = () => {
  const [isSelected, setIsSelected] = useState("BasicAuth");

  if (isSelected === "BasicAuth") return <BasicAuth setIsSelected={setIsSelected} />;

  if (isSelected === "SignIn") return <div>SignIn</div>;

  if (isSelected === "LogIn") return <Login setIsSelected={setIsSelected} />;
};

export default Auth;
