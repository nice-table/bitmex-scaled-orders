import React from "react";
import PropTypes from "prop-types";

class ModalProvider extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired
  };

  state = {
    isOpen: false
  };

  onOpen = () => this.setState({ isOpen: true });
  onClose = () => this.setState({ isOpen: false });

  render() {
    const { isOpen, onOpen, onClose } = this.state;

    return this.props.children({ isOpen, onOpen, onClose });
  }
}

export { ModalProvider };
