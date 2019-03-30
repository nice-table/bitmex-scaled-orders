import React from "react";
import PropTypes from "prop-types";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";

const propTypes = {
  title: PropTypes.node.isRequired,
  children: PropTypes.node,
  actions: PropTypes.node,
  id: PropTypes.string
};

export function DialogBase({
  title,
  actions,
  children,
  id = "app-dialog",
  ...props
}) {
  return (
    <Dialog id={id} aria-labelledby={id} {...props}>
      <DialogTitle id={id}>{title}</DialogTitle>

      <DialogContent>{children}</DialogContent>

      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
}

DialogBase.propTypes = propTypes;
