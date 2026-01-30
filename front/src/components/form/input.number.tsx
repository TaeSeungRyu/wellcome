import { useState } from "react";
import type { InputFieldProps } from ".";

export default function InputCommaNumber({
  name,
  placeholder,
  register,
  label,
  setValue,
  errors,
  option,
  minLength,
  maxLength,
  watch,
}: InputFieldProps) {
  const value = watch?.(name) || "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (setValue) {
      setValue(name, raw);
    }
    register(name)
      .onChange(e)
      .then(() => {
        option?.onChange?.(e);
      });
  };

  const removeValue = () => {
    if (setValue) setValue(name, "");
  };

  return (
    <div
      className={
        "relative w-[200px] mb-4 border p-2 rounded border-gray-300 " +
        (option?.wrapperClassName ?? "")
      }
      style={{ ...option?.wrapperStyle }}
    >
      {label && (
        <div style={{ marginBottom: "16px", ...option?.labelStyle }}>
          {label && <label className={option?.labelClassName}>{label}</label>}
        </div>
      )}
      <input
        {...register(name)}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        inputMode="numeric"
        minLength={minLength}
        maxLength={maxLength}
        className={"w-full outline-none " + (option?.className ?? "")}
        style={{ ...option?.style }}
        disabled={option?.disabled}
      />
      {/* 전체 삭제 버튼 */}
      {setValue && value && value !== "" && !option?.offRightIcon && (
        <button
          type="button"
          onClick={removeValue}
          style={{
            position: "absolute",
            right: "8px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          ❌
        </button>
      )}
      {/* Error */}
      {errors?.[name]?.message && !option?.offErrorMessage && (
        <p className="text-red-500 text-sm mt-1">
          {String(errors[name]?.message)}
        </p>
      )}
    </div>
  );
}
