import { IButton } from "../models/button.interface";

const Button: React.FC<IButton> = ({ name, primary, onClick  }) => {

  return (
    <button
      className={`w-56 h-12  ${
        primary ? "bg-[#F26426]" : `border-[#F26426] border-[1px]`
      } rounded-full`}
      onClick={onClick}
    >
      {name}
    </button>
  );
};

export default Button;
