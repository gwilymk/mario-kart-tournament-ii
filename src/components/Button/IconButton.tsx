import { forwardRef } from "react";
import classNames from "classnames";

import { Button, ButtonProps } from "@/components/Button/Button";
import css from "./IconButton.module.css";

interface IconButtonProps extends ButtonProps {
    hover?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ className, hover = true, ...rest }, ref) => {
        return <Button ref={ref} className={classNames(css.icon, { [css.iconHover]: hover }, className)} {...rest} />;
    }
);
