import { type FC, useState } from "react";
import { css } from "styled-system/css";

type Props = {
  textToCopy: string;
};

export const CopyText: FC<Props> = ({ textToCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    void navigator.clipboard.writeText(textToCopy);
    setCopied(true);
  };

  const handleLeave = () => {
    setCopied(false);
  };

  return (
    <button
      className={root}
      onClick={handleClick}
      onBlur={handleLeave}
      onMouseLeave={handleLeave}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
};

const root = css({
  color: "brand.identity",
  fontFamily: "en",
  fontSize: "sm",
  lineHeight: "none",
  textDecoration: "underline",
  cursor: "pointer",
});
