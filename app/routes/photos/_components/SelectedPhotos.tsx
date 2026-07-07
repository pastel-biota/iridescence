import { type FC, useMemo } from "react";
import { css, cva } from "styled-system/css";
import { hstack } from "styled-system/patterns";
import type { SystemStyleObject } from "styled-system/types";

import { CopyTextButton } from "~/experts/dom/components/CopyTextButton";

type Props = {
  selected: Set<string>;
  style: SystemStyleObject;
};

export const SelectedPhotos: FC<Props> = ({ selected, style }) => {
  const hasSelected = selected.size > 0;

  const ids = useMemo(() => [...selected.values()], [selected]);
  const jsonArray = useMemo(() => JSON.stringify(ids), [ids]);
  const lineEndedArray = useMemo(() => ids.join("\n"), [ids]);

  return (
    <aside className={css(root({ hasSelected }), style)}>
      <h2 className={heading}>{selected.size} 枚 選択中</h2>
      <div className={buttonList}>
        <CopyTextButton className={button} textToCopy={jsonArray}>
          JSON 配列でコピー
        </CopyTextButton>
        <CopyTextButton className={button} textToCopy={lineEndedArray}>
          改行区切りでコピー
        </CopyTextButton>
      </div>
    </aside>
  );
};

const root = cva({
  base: {
    backgroundColor: "brand.background",
    color: "white",
    padding: "24px 32px",
    transition: "transform 150ms",
  },
  variants: {
    hasSelected: {
      true: {
        transform: "translateY(0%)",
      },
      false: {
        transform: "translateY(100%)",
      },
    },
  },
}).raw;

const heading = css({
  fontSize: "1.5em",
  fontFamily: "ja",
});

const buttonList = hstack({});

const button = css({
  cursor: "pointer",
  fontSize: "1em",
  fontFamily: "ja",
  textDecoration: "underline",
  padding: "2px 4px",
  border: "1px solid transparent",
  _focusVisible: {
    borderColor: "white",
  },
});
