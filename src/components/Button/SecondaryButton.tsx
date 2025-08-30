import { forwardRef } from "react";
import classNames from "classnames";

import { Button, ButtonProps } from "@/components/Button/Button";
import css from "./SecondaryButton.module.css";

export const SecondaryButton = forwardRef<HTMLButtonElement, ButtonProps>(({ className, ...rest }, ref) => {
    return <Button ref={ref} className={classNames(css.secondary, className)} {...rest} />;
});
