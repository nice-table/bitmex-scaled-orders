import React from "react";
import { FieldError } from "./index";
import { Radio } from "semantic-ui-react";

export const Toggle = ({
  field: { name, value, onChange, onBlur },
  id,
  form,
  label,
  className,
  ...props
}) => {
  return (
    <div>
      <Radio
        toggle
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
