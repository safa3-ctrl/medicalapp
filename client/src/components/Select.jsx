import { forwardRef } from "react";
import Label from "./Label";

const Select = forwardRef(({
  type,
  name,
  id,
  placeholder,
  value,
  onChange,
  required,
  options = [],
  label,
  error,
  ...rest
},ref) => {
  return (
    <>
    <Label for={id}>{label ?? ''}</Label>
    <select
      className={`
         border  p-4 rounded-md w-full focus:outline-none mt-[12px] 
      `}
      type={type}
      name={name}
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      {...rest}
      ref={ref}
    >
      {options.map((option) => (
        <option value={option.value}>{option.label}</option>
      ))}
    </select>
    <span className="text-red-400 ml-2">{error ?? ''}</span>
    </>
  );
});

export default Select;
