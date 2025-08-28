"use client";

import { ComponentProps, forwardRef, PropsWithChildren } from "react";
import classNames from "classnames";

import css from "./Button.module.css";

export type ButtonProps = PropsWithChildren<ComponentProps<"button">>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, children, ...rest }, ref) => {
    return (
        <button ref={ref} className={classNames(css.button, className)} {...rest}>
            {children}
        </button>
    );
});
