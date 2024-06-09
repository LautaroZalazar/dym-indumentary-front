import { IButton } from "../models/button.interface";

const Button: React.FC<IButton> = ({ name, primary, onClick, disabled  }) => {

  return (
    <button
      disabled={disabled}
      className={`w-56 h-12  ${
        primary ? "bg-[#F26426]" : `border-[#F26426] border-[1px]`
      } ${disabled ? 'opacity-40' : 'opacity-100'} rounded-full`}
      onClick={onClick}
    >
      {name}
    </button>
  );
};

export default Button;
