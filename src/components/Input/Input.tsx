"use client";

import { ChangeEvent, forwardRef, HTMLProps, ReactNode, useCallback } from "react";
import classNames from "classnames";

import css from "./Input.module.css";

interface InputProps extends Omit<HTMLProps<HTMLInputElement>, "onChange"> {
    onChange?: (value: string) => void;

    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, leftIcon, rightIcon, onChange, ...rest }, ref) => {
        const handleOnChange = useCallback(
            (event: ChangeEvent<HTMLInputElement>) => onChange?.(event.currentTarget.value),
            [onChange]
        );

        return (
            <div className={classNames(css.container, className)}>
                {leftIcon && <div className={css.icon}>{leftIcon}</div>}
                <input ref={ref} className={css.input} type="text" onChange={handleOnChange} {...rest} />
                {rightIcon && <div className={css.icon}>{rightIcon}</div>}
            </div>
        );
    }
);
