"use client";

import { FC, PropsWithChildren, useEffect, useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";

import { IconButton } from "@/components/Button";
import css from "./Modal.module.css";

interface ModalProps extends PropsWithChildren {
    isOpen: boolean;
    onClose: () => void;
    showCloseButton?: boolean;
}

export const Modal: FC<ModalProps> = ({ isOpen, onClose, showCloseButton = true, children }) => {
    const modalRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const modalElement = modalRef.current;

        if (!modalElement) {
            return;
        }

        if (isOpen) {
            modalElement.showModal();
        } else {
            modalElement.close();
        }
    }, [isOpen]);

    return (
        <div className={css.wrapper}>
            {/* @ts-expect-error closedby does exist on dialog */}
            <dialog ref={modalRef} className={css.modal} onClose={() => onClose()} closedby="any">
                {showCloseButton && (
                    <IconButton type="button" onClick={() => onClose()} className={css.close}>
                        <CloseIcon />
                    </IconButton>
                )}
                {children}
            </dialog>
        </div>
    );
};
