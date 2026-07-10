import { type FC, type HTMLAttributes, useState } from "react";
import { css } from "styled-system/css";

type Props = {
  textToCopy: string;
} & Omit<
  HTMLAttributes<HTMLButtonElement>,
  "onClick" | "onBlur" | "onMouseLeave"
>;

export const CopyTextButton: FC<Props> = ({
  textToCopy,
  children,
  ...props
}) => {
  // TODO: Interact when copied
  const [_copied, setCopied] = useState(false);

  const handleClick = () => {
    void navigator.clipboard.writeText(textToCopy);
    setCopied(true);
  };

  const handleLeave = () => {
    setCopied(false);
  };

  return (
    <button
      onClick={handleClick}
      onBlur={handleLeave}
      onMouseLeave={handleLeave}
      className={root}
      {...props}
    >
      {children}
    </button>
  );
};

const root = css({
  cursor: "pointer",
});
