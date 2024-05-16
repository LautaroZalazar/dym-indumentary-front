import backArrow from "@/assets/SVG/backArrow.svg";
import { IBackButton } from "../models/back-button.interface";

const BackButton: React.FC<IBackButton> = ({ onClick }) => {
  const handleOnClick = () => {
    window.history.back();
  };
  return (
    <button className="w-full justify-start flex pl-2 pt-2" onClick={onClick || handleOnClick}>
      <img src={backArrow.toString()} alt="backArrow" className="size-6 inline-block" />
    </button>
  );
};

export default BackButton;
