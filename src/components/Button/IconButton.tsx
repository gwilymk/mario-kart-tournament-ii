import { forwardRef } from "react";
import classNames from "classnames";

import { Button, ButtonProps } from "@/components/Button/Button";
import css from "./IconButton.module.css";

export const IconButton = forwardRef<HTMLButtonElement, ButtonProps>(({ className, ...rest }, ref) => {
    return <Button ref={ref} className={classNames(css.icon, className)} {...rest} />;
});
