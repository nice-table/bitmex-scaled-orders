import React from "react";
import PropTypes from "prop-types";
import { Flex, Box } from "grid-styled";
import { Formik, Form, Field } from "formik";
import { Toggle } from "form/Toggle";
import { TextInput } from "form/TextInput";
import { Button } from "semantic-ui-react";
import * as Yup from "yup";
import { ApiContextConsumer } from "./ApiKeyProvider";

class ApiKeyForm extends React.Component {
  render() {
    return (
      <Formik
        initialValues={{
          testnet: false,
          productionApiKeyID: "",
          productionApiKeySecret: "",
          testnetApiKeyID: "",
          testnetApiKeySecret: ""
        }}
        validationSchema={() => {
          return Yup.lazy(values => {
            const validations = {
              testnet: Yup.boolean().label("Use testnet")
            };

            if (values.testnet === false) {
              validations.productionApiKeyID = Yup.string()
                .label("Api key ID")
                .required();
              validations.productionApiKeySecret = Yup.string()
                .label("Api key secret")
                .required();
            }

            if (values.testnet === true) {
              validations.testnetApiKeyID = Yup.string()
                .label("Testnet Api key ID")
                .required();
              validations.testnetApiKeySecret = Yup.string()
                .label("Testnet Api key secret")
                .required();
            }

            return Yup.object().shape(validations);
          });
        }}
        render={({ values }) => (
          <Form>
            <Flex mb={2}>
              <Box>
                <Field name="testnet" component={Toggle} label="Use testnet" />
              </Box>
            </Flex>

            {values.testnet === false && (
              <Flex mb={2} flexWrap="wrap">
                <Box w={1} mb={2}>
                  <Field
                    name="productionApiKeyID"
                    component={TextInput}
                    label="Api key ID"
                  />
                </Box>
                <Box w={1}>
                  <Field
                    name="productionApiKeySecret"
                    component={TextInput}
                    label="Api key secret"
                  />
                </Box>
              </Flex>
            )}

            {values.testnet === true && (
              <Flex mb={2} flexWrap="wrap">
                <Box mb={2} w={1}>
                  <Field
                    name="testnetApiKeyID"
                    component={TextInput}
                    label="Testnet Api key ID"
                  />
                </Box>
                <Box w={1}>
                  <Field
                    name="testnetApiKeySecret"
                    component={TextInput}
                    label="Testnet Api key secret"
                  />
                </Box>
              </Flex>
            )}

            <Flex>
              <div style={{ marginLeft: "auto" }}>
                <Button color="green" type="submit">
                  Save
                </Button>
              </div>
            </Flex>
          </Form>
        )}
        {...this.props}
      />
    );
  }
}

const ApiKeyFormWrapper = props => (
  <ApiContextConsumer>
    {data => (
      <ApiKeyForm
        initialValues={{
          testnet: data.testnet,
          productionApiKeyID: data.productionApiKeyID || "",
          productionApiKeySecret: data.productionApiKeySecret || "",
          testnetApiKeyID: data.testnetApiKeyID || "",
          testnetApiKeySecret: data.testnetApiKeySecret || ""
        }}
        onSubmit={values => {
          data.setApiKeys(values);

          if (props.afterSubmit) {
            props.afterSubmit();
          }
        }}
        {...props}
      />
    )}
  </ApiContextConsumer>
);

ApiKeyFormWrapper.propTypes = {
  afterSubmit: PropTypes.func
};

export { ApiKeyFormWrapper as ApiKeyForm, ApiKeyForm as _ApiKeyForm };
