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
}: InputFieldProps) {
  const [innerValue, setInnerValue] = useState("");

  // 콤마 추가 함수
  const formatNumber = (value: string) => {
    const onlyNums = value.replace(/[^\d]/g, "");
    if (!onlyNums) return "";
    return new Intl.NumberFormat().format(Number(onlyNums));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // 화면에 보여줄 값 (콤마 추가)
    const formatted = formatNumber(raw);
    setInnerValue(formatted);
    // RHF 의 실제 값 → 콤마 제거한 숫자
    if (setValue) {
      const numberValue = raw.replace(/[^\d]/g, "");
      setValue(name, numberValue === "" ? "" : Number(numberValue));
    }
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
        {...register}
        value={innerValue}
        placeholder={placeholder}
        onChange={handleChange}
        inputMode="numeric"
        className={"w-full outline-none " + (option?.className ?? "")}
        style={{ ...option?.style }}
        disabled={option?.disabled}
      />
      {/* 전체 삭제 버튼 */}
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
      {/* Error */}
      {errors?.[name]?.message && !option?.offErrorMessage && (
        <p className="text-red-500 text-sm mt-1">
          {String(errors[name]?.message)}
        </p>
      )}
    </div>
  );
}
