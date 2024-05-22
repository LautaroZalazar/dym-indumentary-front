import React, { useEffect } from "react";

const ValidationToolTip: React.ElementType = ({ validate, error, setError, base }): any => {

  useEffect(() => {
    if (validate.length > 0) {
      const hasError = validate.some((validation: any) => !validation.condition);
      if (hasError !== error) {
        setError(base, hasError);
      }
    }
  }, [validate, error, setError]);
  return (
    <div className="absolute bottom-full left-0 w-full transform -translate-y-2 bg-gray-300 text-white text-sm rounded p-2">
      {validate.map((validation: any, index: any) => (
        <p
          key={index}
          className={`text-sm ${validation.condition ? "text-green-600" : "text-red-600"}`}
        >
          {validation.message}
        </p>
      ))}
    </div>
  );
};

export default ValidationToolTip;
