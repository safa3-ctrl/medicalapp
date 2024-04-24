import { forwardRef } from "react";
import Label from "./Label";

const Input = forwardRef(({
  type,
  name,
  id,
  placeholder,
  value,
  onChange,
  required,
  label,
  error,
  ...rest
},ref) => {
  return (
    <div className="flex flex-col gap-1">
    {label && <Label for={id}>{label}</Label>}
    <input
      className="border  p-4 rounded-md w-full focus:outline-none mt-4"
      type={type}
      name={name}
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      {...rest}
      ref={ref}
    />
    <span className="text-red-400 ml-2">{error ?? ''}</span>
    </div>
  );
});

export default Input;
