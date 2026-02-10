import type { InputFieldProps } from ".";

export default function InputFile({
  name,
  register,
  label,
  setValue,
  errors,
  option,
  watch,
}: InputFieldProps) {
  // 현재 선택된 파일 정보 가져오기
  const fileValue = watch?.(name);
  const fileName = fileValue?.[0]?.name || fileValue?.name; // FileList 혹은 단일 File 대응
  const hasError = !!errors?.[name];

  const handleRemove = () => {
    if (setValue) {
      setValue(name, null); // 값 초기화
    }
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
        {/* 실제 숨겨진 File Input */}
        <input
          {...register(name)}
          type="file"
          id={name}
          disabled={option?.disabled}
          className="hidden" // 화면에서 숨김
          accept={option?.accept} // 허용 확장자 옵션 추가 필요 시
          onChange={(e) => {
            register(name).onChange(e); // RHF 기본 동작
            option?.onChange?.(e); // 커스텀 콜백
          }}
        />

        {/* 커스텀 디자인된 UI 레이어 */}
        <div className="flex items-center gap-2">
          <label
            htmlFor={name}
            className={`
              flex items-center justify-center px-4 py-3 border rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer
              ${
                hasError
                  ? "border-red-500 bg-red-50 text-red-600 focus:ring-4 focus:ring-red-100"
                  : "border-slate-200 bg-white text-slate-600 hover:border-blue-500 hover:bg-blue-50"
              }
              ${option?.disabled ? "bg-slate-50 cursor-not-allowed opacity-60" : ""}
              ${option?.className ?? ""}
            `}
          >
            파일 선택
          </label>

          {/* 파일이 선택되었을 때 표시되는 파일명 */}
          <div className="flex-1 px-4 py-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-sm text-slate-500 truncate">
            {fileName || "선택된 파일 없음"}
          </div>

          {/* 삭제 버튼 */}
          {fileName && !option?.offRightIcon && (
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
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
