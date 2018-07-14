import React from "react";
import { FieldError } from "./index";
import { Radio, Checkbox as SemanticCheckbox } from "semantic-ui-react";

const ToggleFactory = (ToggleComponent, factoryProps) => ({
  field: { name, value, onChange, onBlur },
  id,
  form,
  label,
  className,
  ...props
}) => {
  return (
    <div>
      <ToggleComponent
        {...factoryProps}
        name={name}
        id={id}
        checked={value}
        onChange={event => {
          form.setFieldValue(name, !value);
        }}
        onBlur={onBlur}
        label={label}
        {...props}
      />
      {form.touched[name] &&
        form.errors[name] && <FieldError>{form.errors[name]}</FieldError>}
    </div>
  );
};

export const Toggle = ToggleFactory(Radio, { toggle: true });
Toggle.displayName = "FormikToggle";

export const Checkbox = ToggleFactory(SemanticCheckbox);
Checkbox.displayName = "FormikCheckbox";
