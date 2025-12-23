import type { InputFieldProps } from ".";

export default function InputToggle({
  name,
  label,
  register,
  setValue,
  errors,
  watch,
  option,
}: InputFieldProps) {
  const item = watch?.(name) || {
    selected: false,
    leftLabel: "",
    rightLabel: "",
  };

  const onToggle = () => {
    if (option?.disabled) {
      return;
    }
    if (setValue) {
      const updated = {
        ...item,
        selected: !item.selected,
      };
      setValue(name, updated, { shouldValidate: true });
    }
  };

  return (
    <div
      className={
        "flex flex-col gap-2 mb-4 w-fit " + (option?.wrapperClassName ?? "")
      }
      style={{ ...option?.wrapperStyle }}
    >
      {label && (
        <div style={{ marginBottom: "16px", ...option?.labelStyle }}>
          {label && <label className={option?.labelClassName}>{label}</label>}
        </div>
      )}
      <div className="flex items-center gap-3">
        {/* LEFT LABEL */}
        {item.leftLabel && (
          <span
            className={`text-sm ${
              !item.selected ? "text-blue-600 font-medium" : "text-gray-600"
            } ${option?.disabled ? "opacity-50 cursor-not-allowed text-gray-400" : ""}
            `}
          >
            {item.leftLabel}
          </span>
        )}
        {/* TOGGLE */}
        <div
          onClick={onToggle}
          className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all
            ${item.selected ? "bg-blue-600" : "bg-gray-300"}
            ${option?.className ?? ""}
            ${option?.disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <div
            className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform
              ${item.selected ? "translate-x-6" : "translate-x-0"}
            ${option?.disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
          />
        </div>
        {/* RIGHT LABEL */}
        {item.rightLabel && (
          <span
            className={`text-sm ${
              item.selected ? "text-blue-600 font-medium" : "text-gray-600"
            } ${option?.disabled ? "opacity-50 cursor-not-allowed text-gray-400" : ""}
            }`}
          >
            {item.rightLabel}
          </span>
        )}
      </div>

      {/* RHF hidden */}
      <input type="hidden" {...register} readOnly />
      {/* Error */}
      {errors?.[name]?.message && !option?.offErrorMessage && (
        <p className="text-red-500 text-sm mt-1">
          {String(errors[name]?.message)}
        </p>
      )}
    </div>
  );
}
