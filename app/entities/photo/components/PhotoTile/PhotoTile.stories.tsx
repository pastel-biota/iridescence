import type { Meta, StoryObj } from "@storybook/react-vite";
import { css } from "styled-system/css";

import { PhotoTile } from "./PhotoTile";

const meta = {
  component: PhotoTile,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PhotoTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ideal: Story = {
  args: {
    photoId: "",
    blurUrl: "https://picsum.photos/id/1024/32/24",
    thumbnailUrl: "https://picsum.photos/id/1024/1920/1080",
    fallbackColor: "#ff0000",
  },
  decorators: (Story) => {
    return (
      <div
        className={css({
          width: 400,
          height: 400,
          padding: 16,
          backgroundColor: "brand.background",
        })}
      >
        <Story />
      </div>
    );
  },
};
