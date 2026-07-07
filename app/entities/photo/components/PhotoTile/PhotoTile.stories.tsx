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
    photo: {
      id: "photo-1",
      representativeColor: "#123456",
      images: {
        thumbnail: {
          ext: "png",
          mime: "image/png",
          width: 320,
          height: 240,
          imageUrl: "https://picsum.photos/id/320/240/1080",
        },
        icon: {
          ext: "png",
          mime: "image/png",
          width: 32,
          height: 24,
          imageUrl: "https://picsum.photos/id/1024/32/24",
        },
      },
    },
    selected: false,
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
