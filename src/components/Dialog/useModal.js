import { useState, useCallback } from "react";

export function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const openModal = useCallback(() => {
    return setIsOpen(true);
  }, [setIsOpen]);

  const closeModal = useCallback(() => {
    return setIsOpen(false);
  }, [setIsOpen]);

  return {
    isOpen,
    openModal,
    closeModal
  };
}
