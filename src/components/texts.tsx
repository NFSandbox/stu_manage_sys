import { classNames } from "@/tools/css_tools";
import React, { ReactNode } from "react";
import { setDefault } from "@/tools/set_default";

interface NoticeTextProps {
  hasColor?: boolean;
  children: ReactNode;
}

/**
 * A component that shows some texts with the style of notice / description text.
 */
export function NoticeText(props: NoticeTextProps) {
  let hasColor = props.hasColor;
  hasColor = setDefault(hasColor, true);

  return (
    <div
      className={classNames(
        "text-black/50 dark:text-white/50",
        hasColor ? "bg-bgcolor/50 dark:bg-bgcolor-dark/50" : "",
        "rounded-xl p-2",
      )}
    >
      {props.children}
    </div>
  );
}
