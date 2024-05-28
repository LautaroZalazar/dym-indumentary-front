import { useState } from "react";
import lock from "../../../assets/SVG/lock.svg";
import email from "../../../assets/SVG/email.svg";
import Input from "../../../components/Input";
import VisibilityEyeButton from "../../../components/VisibilityEye";
import Button from "../components/button";
import { ILogin } from "../models/login.interface";
import { useUserLoginMutation } from "../../../redux/slices/user.slice";
import { useNavigate } from "react-router-dom";

const Login: React.FC<ILogin> = ({ setIsSelected }) => {
  const [passwordVisibility, setPasswordVisibility] = useState("password");
  const [disabled, setDisabled] = useState(true);

  const initialState = {
    email: "",
    password: "",
  };
  const navigate = useNavigate();

  const [form, setForm] = useState(initialState);

  const [userLogin] = useUserLoginMutation();

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const response = await userLogin(form);

      if (!response.error) {
        localStorage.setItem("user", JSON.stringify(response.data));
        navigate("/");
      }

      setForm(initialState);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    if (form.email && form.password) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  };

  return (
    <div className="bg-transparent">
      <div className="flex flex-col items-center justify-center mt-4">
        <form className="flex flex-col items-center">
          <Input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            preImage={email.toString()}
          />
          <Input
            name="password"
            type={passwordVisibility}
            value={form.password}
            onChange={handleChange}
            preImage={lock.toString()}
          >
            <VisibilityEyeButton
              visibility={passwordVisibility}
              setVisibility={setPasswordVisibility}
            />
          </Input>
          <div className="mt-8 flex flex-col items-center">
            <Button primary={true} name="Log In" onClick={handleSubmit} disabled={disabled} />
            <p className="mt-4 hidden md:flex">
              No tienes una cuenta?
              <button
                onClick={() => {
                  setIsSelected("SignIn");
                }}
                className="text-[#F26426]"
              >
                &nbsp;Registrate
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
