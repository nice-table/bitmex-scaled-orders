import React from "react";
import { FieldError } from "./index";
import { Input, TextArea } from "semantic-ui-react";

const TextInput = ({
  className,
  field,
  form: { setFieldTouched, touched, errors },
  type,
  label,
  multiLine,
  ...props
}) => (
  <div className={className}>
    <label>
      {!multiLine && (
        <Input
          fluid
          label={label}
          type={type}
          {...field}
          {...props}
          onBlur={arg => {
            setFieldTouched(field.name, true);
            field.onBlur(arg.currentTarget.value);
          }}
        />
      )}

      {multiLine && <TextArea {...field} {...props} />}

      {touched[field.name] &&
        errors[field.name] && <FieldError>{errors[field.name]}</FieldError>}
    </label>
  </div>
);

TextInput.defaultProps = {
  type: "text",
  multiLine: false
};

export { TextInput };
