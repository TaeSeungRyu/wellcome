import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { InputCheckbox } from "./InputCheckbox";
import type { SelectableOption } from ".";

interface Form {
  perms: SelectableOption[];
}

function Wrapper({
  initialOptions,
  onChange,
}: {
  initialOptions: SelectableOption[];
  onChange?: (next: SelectableOption[]) => void;
}) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Form>({
    mode: "all",
    defaultValues: { perms: initialOptions },
  });
  // setValue를 감싸 외부에 알림
  const trackedSetValue: typeof setValue = (...args) => {
    setValue(...args);
    const [, value] = args;
    if (Array.isArray(value)) onChange?.(value as SelectableOption[]);
  };
  return (
    <InputCheckbox
      name="perms"
      label="권한"
      register={register}
      setValue={trackedSetValue}
      watch={watch}
      errors={errors}
    />
  );
}

const options: SelectableOption[] = [
  { value: "READ", label: "읽기", selected: false },
  { value: "WRITE", label: "쓰기", selected: true },
];

describe("InputCheckbox", () => {
  it("label과 옵션 항목을 표시한다", () => {
    render(<Wrapper initialOptions={options} />);
    expect(screen.getByText("권한")).toBeDefined();
    expect(screen.getByText("읽기")).toBeDefined();
    expect(screen.getByText("쓰기")).toBeDefined();
  });

  it("선택된 항목을 클릭하면 해제되고 setValue가 호출된다", () => {
    const onChange = vi.fn();
    render(<Wrapper initialOptions={options} onChange={onChange} />);
    fireEvent.click(screen.getByText("쓰기"));
    expect(onChange).toHaveBeenCalledTimes(1);
    const next = onChange.mock.calls[0][0] as SelectableOption[];
    expect(next).toEqual([
      { value: "READ", label: "읽기", selected: false },
      { value: "WRITE", label: "쓰기", selected: false },
    ]);
  });

  it("선택되지 않은 항목을 클릭하면 선택된다", () => {
    const onChange = vi.fn();
    render(<Wrapper initialOptions={options} onChange={onChange} />);
    fireEvent.click(screen.getByText("읽기"));
    const next = onChange.mock.calls[0][0] as SelectableOption[];
    expect(next.find((o) => o.value === "READ")?.selected).toBe(true);
  });
});
