import React from "react";
import PropTypes from "prop-types";
import { useModal } from "./useModal";
import { DialogBase } from "./Base";

const propTypes = {
  children: PropTypes.func,
  onClose: PropTypes.func,
  content: PropTypes.func.isRequired,
  open: PropTypes.bool
};

export function Dialog({ children, open, content, onClose, ...props }) {
  const { isOpen, openModal, closeModal } = useModal();

  const openState = open != null ? open : isOpen;

  return (
    <React.Fragment>
      <DialogBase
        {...props}
        open={openState}
        onClose={onClose || closeModal}
        children={openState && content({ closeModal })}
      />

      {children && children({ isOpen, openModal, closeModal })}
    </React.Fragment>
  );
}

Dialog.propTypes = propTypes;
