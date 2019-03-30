import React from "react";
import { Switch, CheckboxWithLabel } from "formik-material-ui";
import FormControlLabel from "@material-ui/core/FormControlLabel";

export const Toggle = ({ label, ...props }) => (
  <FormControlLabel label={label} control={<Switch {...props} />} />
);

export { CheckboxWithLabel as Checkbox };
