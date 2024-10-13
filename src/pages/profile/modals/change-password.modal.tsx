import React, { useState } from "react";
import Input from "../../../components/Input";
import VisibilityEyeButton from "../../../components/VisibilityEye";
import ValidationToolTip from "../../auth/components/validationToolTip";
import { validationPassword } from "../../auth/utils/validations/password.validation";
import lock from "../../../assets/SVG/lock.svg";

const ChangePasswordModal = () => {
  const [form, setForm] = useState({
    password: "",
  });
  const [passwordVisibility, setPasswordVisibility] = useState("password");
  const [showTooltip, setShowTooltip] = useState({
    password: false,
  });

  const [error, setError] = useState({
    password: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleError = (base: string, hasError: boolean) => {
    setError({ ...error, [base]: hasError });
  };

  return (
    <div className="bg-dymBlack absolute h-screen opacity-50">
      <div className="relative top-50 left-50">
        <Input
          name="password"
          type={passwordVisibility}
          value={form.password}
          onChange={handleChange}
          preImage={lock.toString()}
          onFocus={() => {
            setShowTooltip({
              ...showTooltip,
              password: true,
            });
          }}
          onBlur={() => {
            setShowTooltip({
              ...showTooltip,
              password: false,
            });
          }}
        >
          <VisibilityEyeButton
            visibility={passwordVisibility}
            setVisibility={setPasswordVisibility}
          />
        </Input>
        {showTooltip.password && (
          <ValidationToolTip
            validate={validationPassword(form.password)}
            setError={handleError}
            error={error.password}
            base="password"
          />
        )}
      </div>
    </div>
  );
};

export default ChangePasswordModal;
