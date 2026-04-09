import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import "../../styles.css";

const meta = {
  component: Button,
  tags: ["autodocs"], // 👈 이 줄을 추가하면 자동으로 Docs 탭과 코드가 생성됩니다!
  args: {
    children: "Button",
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

// 1. 기본 버튼
export const Default: Story = {
  args: {
    children: "기본 버튼",
  },
};

// 2. 프라이머리 버튼 (Variant 적용)
export const Secondary: Story = {
  args: {
    variant: "secondary", // 컴포넌트의 variant prop
    children: "Secondary Button",
  },
};

// 3. 다양한 크기 예시
export const Small: Story = {
  args: {
    size: "sm",
    children: "Small Button",
  },
};
