import type { InputFieldProps } from ".";

export default function InputRadio({
  name,
  label,
  register,
  setValue,
  errors,
  watch,
  option,
}: InputFieldProps) {
  const list = watch?.(name) || [];

  const onSelect = (item: any, e: React.ChangeEvent<any>) => {
    if (option?.disabled) return;
    if (setValue) {
      const updated = list.map((v: any) => ({
        ...v,
        selected: v.value === item.value,
      }));
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

      <div className="flex gap-2 w-fit">
        {list.map((v: any) => (
          <div
            key={v.value}
            onClick={(e) => onSelect(v, e)}
            className={`
              px-3 py-2 flex items-center gap-2
              ${option?.className ?? ""}
              ${option?.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            {/* Custom radio circle */}
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center 
                  ${v.selected ? "border-blue-600" : "border-gray-400"}
                `}
            >
              {v.selected && !option?.disabled && (
                <div className="w-2 h-2 rounded-full bg-blue-600" />
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
