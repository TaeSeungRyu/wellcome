import { useState } from "react";
import type { InputFieldProps } from ".";

export default function InputPassword({
  name,
  placeholder,
  register,
  label,
  setValue,
  errors,
  option,
}: InputFieldProps) {
  const [innerValue, setInnerValue] = useState("");
  const [inputType, setInputType] = useState<string>("password");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setInnerValue(raw);
    // RHF 의 실제 값 → 콤마 제거한 숫자
    if (setValue) {
      setValue(name, raw);
    }
    register(name).onChange(e);
  };

  const removeValue = () => {
    setInnerValue("");
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
        value={innerValue}
        placeholder={placeholder}
        onChange={handleChange}
        inputMode="numeric"
        className={"w-full outline-none " + (option?.className ?? "")}
        style={{ ...option?.style }}
        disabled={option?.disabled}
        type={inputType}
        autoComplete="off"
      />
      {setValue && innerValue && innerValue !== "" && !option?.offRightIcon && (
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
      <button
        type="button"
        onClick={() => {
          setInputType(inputType === "text" ? "password" : "text");
        }}
      >
        {inputType === "text" ? "🙈" : "👁️"}
      </button>

      {/* Error */}
      {errors?.[name]?.message && !option?.offErrorMessage && (
        <p className="text-red-500 text-sm mt-1">
          {String(errors[name]?.message)}
        </p>
      )}
    </div>
  );
}
