import React from "react";

export default function Input({
  name,
  type,
  onChange,
  className,
  width,
  label
}: {
  name: string;
  type: string;
  label:string;
  width?:string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}) {
  return (
    <fieldset className={` w-${width||""}  ${className ?? ""} rounded-3xl border-2 border-purple-700  py-0.5`}>
      <legend className="mx-3 text-sm">
        {label}
      </legend>

      <input
        type={type}
        name={name}
        id={name}
        onChange={onChange}
        className={`w-full bg-transparent border-none outline-none text-xl rounded-3xl px-3`}
      />
    </fieldset>
  );
}