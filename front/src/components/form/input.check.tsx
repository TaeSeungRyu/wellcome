import type { InputFieldProps } from ".";

export default function InputCheckbox({
  name,
  label,
  register,
  setValue,
  errors,
  watch,
  option,
}: InputFieldProps) {
  const list = watch?.(name) || [];

  const onToggle = (item: any, e: React.ChangeEvent<any>) => {
    if (option?.disabled) return;
    if (setValue) {
      const updated = list.map((v: any) =>
        v.value === item.value
          ? { ...v, selected: !v.selected } // 선택 토글
          : v
      );
      setValue(name, updated, { shouldValidate: true });
    }
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
      <div className="flex flex-col gap-2">
        {list.map((v: any) => (
          <div
            key={v.value}
            onClick={(e) => onToggle(v, e)}
            className={`
              px-3 py-2 flex items-center gap-2
              ${option?.className ?? ""}
              ${option?.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
            style={{ ...option?.style }}
          >
            {/* Custom Checkbox box */}
            <div
              className={`w-4 h-4 border rounded flex items-center justify-center
                  ${v.selected ? "bg-blue-600 border-blue-600" : "border-gray-400"}
              `}
            >
              {v.selected && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>

            <span>{v.label}</span>
          </div>
        ))}
      </div>
      {/* RHF 연결용 hidden input */}
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
