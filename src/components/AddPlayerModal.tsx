"use client";

import { Modal } from "@/components/Modal";
import PlayerNameInput from "@/components/PlayerNameInput";

interface AddPlayerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddPlayerModal({ isOpen, onClose }: AddPlayerModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2>Add player</h2>
            <PlayerNameInput onPlayerAdded={onClose} />
        </Modal>
    );
}
