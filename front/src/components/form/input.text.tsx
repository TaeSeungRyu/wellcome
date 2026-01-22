import { useState } from "react";
import type { InputFieldProps } from ".";

export default function InputText({
  name,
  placeholder,
  register,
  label,
  setValue,
  errors,
  option,
}: InputFieldProps) {
  const [innerValue, setInnerValue] = useState("");
  const hasError = !!errors?.[name];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setInnerValue(raw);

    // RHF 연동
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
      className={`relative flex flex-col w-full min-w-[200px] mb-5 ${option?.wrapperClassName ?? ""}`}
      style={option?.wrapperStyle}
    >
      {/* Label 스타일 개선 */}
      {label && (
        <label
          className={`block mb-2 text-sm font-semibold text-slate-700 ${option?.labelClassName ?? ""}`}
          style={option?.labelStyle}
        >
          {label}
        </label>
      )}

      <div className="relative group">
        <input
          {...register(name)}
          value={innerValue}
          placeholder={placeholder}
          onChange={handleChange}
          inputMode="numeric"
          disabled={option?.disabled}
          type="text"
          className={`
            w-full px-4 py-3 bg-white border rounded-xl text-sm transition-all duration-200 outline-none
            placeholder:text-slate-400
            ${
              hasError
                ? "border-red-500 focus:ring-4 focus:ring-red-100"
                : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            }
            ${option?.disabled ? "bg-slate-50 cursor-not-allowed opacity-60" : "hover:border-slate-300"}
            ${option?.className ?? ""}
          `}
          style={option?.style}
        />

        {/* 삭제 버튼: 디자인 및 인터랙션 개선 */}
        {setValue && innerValue && !option?.offRightIcon && (
          <button
            type="button"
            onClick={removeValue}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* 에러 메시지 애니메이션/가독성 개선 */}
      {hasError && !option?.offErrorMessage && (
        <p className="mt-1.5 ml-1 text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1">
          {String(errors[name]?.message)}
        </p>
      )}
    </div>
  );
}
