import type {
  FieldErrors,
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
}

export interface InputFieldProps {
  name: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  label?: string;
  setValue?: UseFormSetValue<any>;
  errors?: FieldErrors<any>;
  watch?: UseFormWatch<any>;
  option?: InputOption;
}
