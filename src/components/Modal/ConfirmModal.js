import React from "react";
import PropTypes from "prop-types";
import { ModalProvider } from "./Modal";

class ConfirmModal extends React.Component {
  static propTypes = {
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    autoClose: PropTypes.bool,
    children: PropTypes.func.isRequired
  };

  static defaultProps = {
    autoClose: true,
    onCancel: function() {}
  };

  render() {
    return (
      <ModalProvider>
        {({ isOpen }) => (
          <React.Fragment>{isOpen && <div>modal here</div>}</React.Fragment>
        )}
      </ModalProvider>
    );
  }
}
