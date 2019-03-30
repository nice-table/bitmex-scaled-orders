import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import { useModal } from "./useModal";
import { DialogBase } from "./Base";

const propTypes = {
  children: PropTypes.func,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  content: PropTypes.node,
  open: PropTypes.bool
};

export function ConfirmDialog({
  children,
  open,
  content,
  onCancel,
  onConfirm,
  ...props
}) {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <React.Fragment>
      <DialogBase
        {...props}
        open={open != null ? open : isOpen}
        onClose={onCancel || closeModal}
        children={content}
        actions={
          <React.Fragment>
            <Button
              style={{ marginRight: "8px" }}
              onClick={onCancel || closeModal}
              variant="contained"
            >
              Cancel
            </Button>

            <Button
              onClick={onConfirm}
              variant="contained"
              color="primary"
              style={{ marginRight: "8px" }}
            >
              OK
            </Button>
          </React.Fragment>
        }
      />

      {children && children({ isOpen, openModal, closeModal })}
    </React.Fragment>
  );
}

ConfirmDialog.propTypes = propTypes;
