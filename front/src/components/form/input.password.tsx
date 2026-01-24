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
  minLength,
  maxLength,
}: InputFieldProps) {
  const [innerValue, setInnerValue] = useState("");
  const [inputType, setInputType] = useState<"password" | "text">("password");
  const hasError = !!errors?.[name];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setInnerValue(raw);
    if (setValue) setValue(name, raw);
    register(name)
      .onChange(e)
      .then(() => {
        option?.onChange?.(e);
      });
  };

  const removeValue = () => {
    setInnerValue("");
    if (setValue) setValue(name, "");
  };

  const togglePassword = () => {
    setInputType((prev) => (prev === "password" ? "text" : "password"));
  };

  return (
    <div
      className={`relative flex flex-col w-full min-w-[200px] mb-5 ${option?.wrapperClassName ?? ""}`}
      style={option?.wrapperStyle}
    >
      {/* Label */}
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
          name={name}
          value={innerValue}
          placeholder={placeholder}
          onChange={handleChange}
          disabled={option?.disabled}
          type={inputType}
          minLength={minLength}
          maxLength={maxLength}
          autoComplete="current-password"
          className={`
            w-full px-4 py-3 bg-white border rounded-xl text-sm transition-all duration-200 outline-none
            placeholder:text-slate-400 pr-20 
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

        {/* 우측 버튼 그룹 (삭제 + 토글) */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
          {/* 전체 삭제 버튼 */}
          {setValue && innerValue && !option?.offRightIcon && (
            <button
              type="button"
              onClick={removeValue}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
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

          {/* 비밀번호 토글 버튼 */}
          <button
            type="button"
            onClick={togglePassword}
            className="p-1.5 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            {inputType === "password" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* 에러 메시지 */}
      {hasError && !option?.offErrorMessage && (
        <p className="mt-1.5 ml-1 text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1">
          {String(errors[name]?.message)}
        </p>
      )}
    </div>
  );
}
