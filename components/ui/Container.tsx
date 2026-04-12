import type { HTMLAttributes, ReactNode } from "react";

import styles from "./Container.module.css";

export type ContainerElement = "div" | "main" | "section" | "article";

export type ContainerProps = {
  as?: ContainerElement;
  children?: ReactNode;
  className?: string;
} & Omit<HTMLAttributes<HTMLElement>, "as">;

export function Container({
  as: Tag = "div",
  children,
  className,
  ...rest
}: ContainerProps) {
  const merged = [styles["root"], className].filter(Boolean).join(" ");

  return (
    <Tag className={merged} {...rest}>
      {children}
    </Tag>
  );
}
