// Modified version of https://github.com/jaredpalmer/formik-persist
// Version 1.0.0 didn't work with newer version of Formik due to undefined formik context
import React from "react";
import _ from "lodash";
import { FormikConsumer } from "formik";
import PropTypes from "prop-types";

export class Persist extends React.Component {
  static defaultProps = {
    debounce: 300
  };

  static propTypes = {
    formik: PropTypes.object
  };

  saveForm = _.debounce(data => {
    window.localStorage.setItem(this.props.name, JSON.stringify(data));
  }, this.props.debounce);

  componentWillReceiveProps(_nextProps) {
    if (!_.isEqual(_nextProps.formik, this.props.formik)) {
      this.saveForm(_nextProps.formik);
    }
  }

  componentDidMount() {
    const maybeState = window.localStorage.getItem(this.props.name);
    if (maybeState && maybeState !== null) {
      const { values, errors, touched, isSubmitting, status } = JSON.parse(
        maybeState
      );

      const { formik } = this.props;

      if (values) {
        formik.setValues(values);
      }

      if (errors) {
        formik.setErrors(errors);
      }

      if (touched) {
        formik.setTouched(touched);
      }

      if (isSubmitting) {
        formik.setSubmitting(isSubmitting);
      }

      if (status) {
        formik.setStatus(status);
      }
    }
  }

  render() {
    return null;
  }
}

export default props => (
  <FormikConsumer>
    {formikProps => <Persist formik={formikProps} {...props} />}
  </FormikConsumer>
);
