import { forwardRef } from "react";
import classNames from "classnames";

import { Button, ButtonProps } from "@/components/Button/Button";
import css from "./PrimaryButton.module.css";

export const PrimaryButton = forwardRef<HTMLButtonElement, ButtonProps>(({ className, ...rest }, ref) => {
    return <Button ref={ref} className={classNames(css.primary, className)} {...rest} />;
});
