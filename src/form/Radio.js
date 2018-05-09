import React from "react";
import { Header, Radio } from "semantic-ui-react";

export const RadioButton = ({
  field: { name, value, onChange, onBlur },
  id,
  label,
  className,
  ...props
}) => {
  return (
    <div>
      <Radio
        name={name}
        id={id}
        type="radio"
        value={id}
        checked={id === value}
        onChange={onChange}
        onBlur={onBlur}
        label={label}
        {...props}
      />
    </div>
  );
};

export const RadioButtonGroup = ({
  value,
  error,
  touched,
  id,
  label,
  className,
  children
}) => {
  return (
    <div className={className}>
      <Header as="h4">{label}</Header>
      {children}
    </div>
  );
};
