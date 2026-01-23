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
  const error = errors?.[name];

  const onToggle = (item: any, e: React.MouseEvent) => {
    if (option?.disabled || !setValue) return;

    const updated = list.map((v: any) =>
      v.value === item.value ? { ...v, selected: !v.selected } : v,
    );

    // setValue를 통해 RHF 상태 업데이트
    setValue(name, updated, { shouldValidate: true });

    // 만약 register의 onChange 트리거가 꼭 필요하다면 수동 호출 가능하지만,
    // 통상 setValue만으로 충분합니다.
  };

  // 공통 스타일 추출
  const wrapperClass = `relative w-full mb-4 rounded border-gray-300 ${option?.wrapperClassName ?? ""}`;
  const labelClass = `block text-sm font-medium mb-3 text-gray-700 ${option?.labelClassName ?? ""}`;
  const direction =
    option?.direction === "row" ? "flex-row flex-wrap" : "flex-col";
  return (
    <div className={wrapperClass} style={option?.wrapperStyle}>
      {label && (
        <label className={labelClass} style={option?.labelStyle}>
          {label}
        </label>
      )}

      <div className={`flex ${direction} gap-1`}>
        {list.map((v: any) => {
          const isSelected = v.selected;
          const isDisabled = option?.disabled;

          return (
            <div
              key={v.value}
              onClick={(e) => onToggle(v, e)}
              className={`
                group px-3 py-2 flex items-center gap-3 rounded-md transition-colors
                ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-gray-50"}
                ${option?.className ?? ""}
              `}
              style={option?.style}
            >
              {/* Checkbox Box */}
              <div
                className={`
                  w-5 h-5 border rounded flex items-center justify-center transition-all
                  ${isSelected ? "bg-blue-600 border-blue-600" : "bg-white border-gray-300 group-hover:border-blue-400"}
                `}
              >
                {isSelected && (
                  <svg
                    className="w-3.5 h-3.5 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M5 13l4 4L19 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>

              {/* Label Text */}
              <span
                className={`text-sm ${isSelected ? "text-blue-700 font-medium" : "text-gray-600"}`}
              >
                {v.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* RHF 연결용 hidden input */}
      <input type="hidden" {...register(name)} />

      {/* Error Message */}
      {error?.message && !option?.offErrorMessage && (
        <p className="text-red-500 text-xs mt-2 ml-1 animate-pulse">
          {String(error.message)}
        </p>
      )}
    </div>
  );
}
