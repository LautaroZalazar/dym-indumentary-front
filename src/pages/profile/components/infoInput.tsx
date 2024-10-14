import React from "react";

interface InfoInputProps {
  title: string;
  value: string;
}

const InfoInput: React.FC<InfoInputProps> = ({ title, value }) => {
  return (
    <div className="pt-3">
      <label htmlFor="name" className={`text-dymOrange block pl-3 pb-1 text-sm`}>
        {title}
      </label>
      <input
        id="name"
        type="text"
        value={value}
        disabled
        className={`bg-dymBlack border ${
          value ? "border-dymOrange" : "border-[#FF0000]"
        } w-[21rem] h-9 rounded-md pl-3 text-sm`}
      />
    </div>
  );
};

export default InfoInput;
