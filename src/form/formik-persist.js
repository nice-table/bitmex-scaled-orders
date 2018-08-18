/*
MIT License

Copyright (c) 2017 Jared Palmer http://jaredpalmer.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/*
  Modified https://github.com/jaredpalmer/formik-persist 1.1.0 to fix "isSubmitting" bug on reload
*/
import React from "react";
import { connect } from "formik";
import _ from "lodash";
import isEqual from "react-fast-compare";

class PersistImpl extends React.Component {
  static defaultProps = {
    debounce: 300
  };

  saveForm = _.debounce(data => {
    if (data) {
      window.localStorage.setItem(this.props.name, JSON.stringify(data));
    }
  }, this.props.debounce);

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props.formik.values, prevProps.formik.values)) {
      if (this.props.formik.isValid) {
        this.saveForm(this.props.formik);
      }
    }
  }

  componentDidMount() {
    const maybeState = window.localStorage.getItem(this.props.name);
    if (maybeState && maybeState !== null) {
      const stateParsed = JSON.parse(maybeState);

      // Don't hydrate invalid state
      if (stateParsed.isValid === false) {
        return;
      }

      stateParsed.isSubmitting = false;
      this.props.formik.setFormikState(stateParsed);
    }
  }

  render() {
    return null;
  }
}

export const Persist = connect(PersistImpl);
