import type { FC, ReactNode } from "react";
import { css, cva } from "styled-system/css";

type Props = {
  affix: ReactNode;
  value: ReactNode;
  fixation: "prefix" | "suffix";
};

export const PropertyValue: FC<Props> = ({ affix, value, fixation }) => {
  return (
    <div className={root({ fixation })}>
      <dt className={affixText}>{affix}</dt>
      <dd className={valueText}>{value}</dd>
    </div>
  );
};

const root = cva({
  base: {
    display: "flex",
    gap: "1px",
    fontFamily: "metrics",
    lineHeight: "none",
    letterSpacing: "pack",
    alignItems: "end",
  },
  variants: {
    fixation: {
      prefix: {},
      suffix: {
        flexDirection: "row-reverse",
      },
    },
  },
});

const affixText = css({
  fontSize: "75%",
  lineHeight: "none",
});

const valueText = css({
  lineHeight: "none",
});
