import InputText from "@/components/form/inputText";
import type { BoardForm } from "./board.schema";
import { useFormContext } from "react-hook-form";

export function BoardModalComponent222() {
  const fields: (keyof BoardForm)[] = ["title", "contents"];
  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useFormContext();
  const onSubmit = (data: any) => {
    console.log("Form Data Submitted:", data);
  };

  return (
    <div>
      <div>
        <h2>데이터 등록</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputText
            name={fields[0]}
            label="제목"
            placeholder="제목을 입력하세요"
            register={register}
            setValue={setValue}
            errors={errors}
          />

          <InputText
            name={fields[1]}
            label="내용"
            placeholder="내용을 입력하세요"
            register={register}
            setValue={setValue}
            errors={errors}
          />

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            type="submit"
          >
            제출
          </button>
        </form>
      </div>
    </div>
  );
}
