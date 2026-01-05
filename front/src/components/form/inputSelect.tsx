import { useState } from "react";
import type { InputFieldProps } from ".";

export default function InputSelect({
  name,
  placeholder = "선택하세요",
  register,
  label,
  setValue,
  errors,
  watch,
  option,
}: InputFieldProps) {
  const [open, setOpen] = useState(false);

  // 부모가 가진 실제 배열값
  const list = watch?.(name) || [];

  // 선택된 객체 찾기
  const selectedItem = list.find((v: any) => v.selected);

  const displayLabel = selectedItem?.label ?? placeholder;

  const onSelect = (item: any, e: React.ChangeEvent<any>) => {
    if (option?.disabled) return;
    if (setValue) {
      // 선택한 항목만 selected: true 로 업데이트
      const updated = list.map((v: any) => ({
        ...v,
        selected: v.value === item.value,
      }));
      setValue(name, updated, { shouldValidate: true });
    }
    setOpen(false);
    register(name).onChange(e);
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
      <div
        className={`
          border p-2 rounded cursor-pointer bg-white
          ${option?.className ?? ""}
          ${option?.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
        onClick={() => {
          if (option?.disabled) return;
          setOpen(!open);
        }}
        style={{ ...option?.style }}
      >
        {displayLabel}
      </div>
      {/* Dropdown */}
      {open && (
        <div
          className={`
            absolute left-0 right-0 bg-white border rounded mt-1 shadow z-10
            ${option?.className ?? ""}
            ${option?.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          `}
          style={{ ...option?.style }}
        >
          {list.map((v: any) => (
            <div
              key={v.value}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={(e) => {
                onSelect(v, e);
              }}
            >
              {v.label}
            </div>
          ))}
        </div>
      )}
      {/* RHF hidden input → register 동작 연결 */}
      <input type="hidden" {...register(name)} readOnly />
      {/* Error */}
      {errors?.[name]?.message && !option?.offErrorMessage && (
        <p className="text-red-500 text-sm mt-1">
          {String(errors[name]?.message)}
        </p>
      )}
    </div>
  );
}
