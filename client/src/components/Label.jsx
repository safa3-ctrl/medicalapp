import React from "react";

const Label = ({ forId, children }) => {
  return (
    <label
      htmlFor={forId}
      id={forId}
      className="block  text-sm text-[14px] mt-[12px] dark:text-white mb-[px] text-gray-500 font-bold "
    >
      {children}
    </label>
  );
};

export default Label;
