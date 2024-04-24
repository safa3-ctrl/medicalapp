import { forwardRef } from "react";
import Label from "./Label";
import { Controller } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import 'react-phone-number-input/style.css'

const PhoneNumberInput = forwardRef(({control,label,error,...rest},ref) => {
    return(
        <div className="flex flex-col gap-1">
        <Label>{label ?? ''}</Label>
        <Controller
        ref={ref}
        control={control}
        {...rest}
        rules={{
          validate: (value) => isValidPhoneNumber(value),
        }}
        render={({ field: { onChange, value } }) => (
          <PhoneInput
            value={value}
            onChange={onChange}
            defaultCountry="TN"
            id="phone-input"
            className="border  p-4 rounded-md w-full focus:outline-none mt-4"
          />
        )}
      />
    <span className="text-red-400 ml-2">{error ?? ''}</span>
      </div>
    )
});

export default PhoneNumberInput;