import React, { FC } from "react";
import styles from "../styles/modules/button.module.scss";
import { getClasses } from "../utils/getClasses";

interface ButtonProps {
  type?: string;
  variant?: string;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  header?: boolean;
}

const Button: FC<ButtonProps> = ({
  type,
  variant = "primary",
  children,
  onClick,
  disabled,
  header,
}) => {
  return (
    <button
      disabled={disabled}
      type={type === "submit" ? "submit" : "button"}
      className={getClasses([
        styles.button,
        disabled ? styles[`button--secondary`] : styles[`button--${variant}`],
        header && styles[`button__header`],
      ])}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

interface SelectButtonProps {
  id: string;
  children: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectButton: FC<SelectButtonProps> = ({
  children,
  id,
  onChange,
  value,
}) => {
  return (
    <select
      id={id}
      className={getClasses([styles.button, styles.button__select])}
      onChange={(e) => onChange(e)}
      defaultValue={value}
    >
      {children}
    </select>
  );
};

export { SelectButton };
export default Button;
