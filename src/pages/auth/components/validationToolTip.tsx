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
    <div className="absolute w-3/4 top-60 left-50 mt-2 p-2 rounded bg-gray-300 border border-gray-300">
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
