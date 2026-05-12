import type {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

export interface InputOption {
  style?: React.CSSProperties;
  wrapperStyle?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
  className?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  disabled?: boolean;
  offRightIcon?: boolean;
  offErrorMessage?: boolean;
  direction?: "row" | "column";
  onChange?: (e: React.ChangeEvent<any>) => void;
  accept?: string; // For file input accept attribute
}

// checkbox/radio/select 등 선택형 인풋이 다루는 옵션 모양
export interface SelectableOption {
  value: string;
  label: string;
  selected: boolean;
}

// T가 명시되지 않으면 any로 폴백 — 다양한 폼 스키마와 호환되어야 하므로
// 엄격한 default(FieldValues)를 쓰면 invariant generic 때문에 호출 측이 깨진다.
export interface InputFieldProps<T extends FieldValues = any> {
  name: Path<T>;
  placeholder?: string;
  register: UseFormRegister<T>;
  label?: string;
  setValue?: UseFormSetValue<T>;
  errors?: FieldErrors<T>;
  watch?: UseFormWatch<T>;
  option?: InputOption;
  minLength?: number;
  maxLength?: number;
}
