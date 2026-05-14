import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputText } from "./InputText";

const schema = z.object({
  myField: z.string().min(3, "최소 3자"),
});
type Form = z.infer<typeof schema>;

function Wrapper(props: {
  defaultValue?: string;
  onSubmit?: (data: Form) => void;
}) {
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: { myField: props.defaultValue ?? "" },
  });
  return (
    <form onSubmit={handleSubmit((d) => props.onSubmit?.(d))}>
      <InputText
        name="myField"
        label="필드"
        placeholder="입력"
        register={register}
        setValue={setValue}
        watch={watch}
        errors={errors}
      />
      <button type="submit">제출</button>
    </form>
  );
}

describe("InputText", () => {
  it("label과 placeholder를 표시한다", () => {
    render(<Wrapper />);
    expect(screen.getByText("필드")).toBeDefined();
    expect(screen.getByPlaceholderText("입력")).toBeDefined();
  });

  it("초기값이 있으면 input에 표시된다", () => {
    render(<Wrapper defaultValue="hello" />);
    expect(
      (screen.getByPlaceholderText("입력") as HTMLInputElement).value,
    ).toBe("hello");
  });

  it("값이 있으면 삭제 버튼이 노출되고 클릭 시 비워진다", () => {
    render(<Wrapper defaultValue="hello" />);
    const input = screen.getByPlaceholderText("입력") as HTMLInputElement;
    // 삭제 svg를 감싼 button (텍스트 없음) → role=button으로 모든 버튼 가져와서 submit 외 첫 번째
    const buttons = screen.getAllByRole("button");
    const clearBtn = buttons.find((b) => b.getAttribute("type") === "button");
    expect(clearBtn).toBeDefined();
    fireEvent.click(clearBtn!);
    expect(input.value).toBe("");
  });

  it("값이 비어있으면 삭제 버튼이 노출되지 않는다", () => {
    render(<Wrapper defaultValue="" />);
    const buttons = screen.getAllByRole("button");
    // submit 버튼 하나만 존재
    expect(buttons.filter((b) => b.getAttribute("type") === "button")).toHaveLength(
      0,
    );
  });
});
