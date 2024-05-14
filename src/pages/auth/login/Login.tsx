import { useState } from "react";
import lock from "@/assets/SVG/lock.svg";
import human from "@/assets/SVG/human.svg";
import email from "@/assets/SVG/email.svg";
import logo from "@/assets/SVG/logo.svg";
import Input from "../../../components/Input";
import VisibilityEyeButton from "../../../components/VisibilityEye";
import BackButton from "../../../components/BackButton";
import Button from "../components/button";
import { ILogin } from "../models/login.interface";

const Login: React.FC<ILogin> = ({ setIsSelected }) => {
  const [passwordVisibility, setPasswordVisibility] = useState("password");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  return (
    <div className="bg-[#18151A] h-screen">
      {setIsSelected ? <BackButton onClick={() => setIsSelected("BasicAuth")} /> : <BackButton />}
      <div className="bg-[#18151A] flex flex-col items-center justify-center mt-4">
        <img src={logo.toString()} alt="logo" className="size-44 my-6" />
        <form className="flex flex-col items-center">
          <Input
            name="name"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            preImage={human.toString()}
          />
          <Input
            name="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            preImage={email.toString()}
          />
          <Input
            name="password"
            type={passwordVisibility}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            preImage={lock.toString()}
          >
            <VisibilityEyeButton
              visibility={passwordVisibility}
              setVisibility={setPasswordVisibility}
            />
          </Input>
          <div className="mt-8">
            <Button primary={true} name="Sign In" onClick={() => {}} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
