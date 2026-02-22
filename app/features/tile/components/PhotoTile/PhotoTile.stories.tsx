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
    thumbnailUrl: "https://picsum.photos/id/1024/1920/1080",
    className: "",
    colSpan: 1,
    rowSpan: 1,
    title: {
      jp: "みはらしの丘",
      en: "Miharashi Hill",
    },
    properties: {
      camera: "FUJIFILM X-T4",
      aperture: 3.6,
      shatter: 8,
      iso: 320,
      exposure: -2.1,
      focus: 42.0,
      // FUJIFILM X-T4 F/3.6 1/8 ISO 320 EXP. -2.1 42.00 mm
    },
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
