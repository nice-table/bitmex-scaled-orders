import React from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import { Flex, Box } from "@rebass/grid";
import { Formik, Form, Field } from "formik";
import { Checkbox } from "form/Toggle";
import Button from "@material-ui/core/Button";
import * as Yup from "yup";
import { UISettingsContext } from "./UISettings";
import FormLabel from "@material-ui/core/FormLabel";

class SelectInstrumentsForm extends React.Component {
  render() {
    const instrumentsOrdered = _.orderBy(this.props.instruments, x => [
      x.rootSymbol,
      x.expiry
    ]);

    const instrumentsGroupedByRootSymbol = _.groupBy(
      instrumentsOrdered,
      "rootSymbol"
    );

    return (
      <Formik
        isInitialValid
        validationSchema={() =>
          Yup.object().shape({
            instruments: Yup.object().test(
              "one instrument",
              "Choose at least one instrument",
              value => Object.values(value).some(x => x === true)
            )
          })
        }
        render={({ values, errors, isSubmitting, isValid }) => (
          <Form>
            {errors && errors.instruments && (
              <FormLabel error>{errors.instruments}</FormLabel>
            )}

            <Flex flexWrap="wrap" mx={-2}>
              {_.map(instrumentsGroupedByRootSymbol, (symbols, rootSymbol) => (
                <Box key={rootSymbol} px={2} width={1 / 2}>
                  <h3>{rootSymbol}</h3>
                  <Flex flexWrap="wrap" mb={2}>
                    {symbols.map(x => (
                      <Box width={1 / 2} mb={2} key={x.symbol}>
                        <Field
                          component={Checkbox}
                          Label={{ label: x.symbol }}
                          id={x.symbol}
                          name={`instruments.${x.symbol}`}
                        />
                      </Box>
                    ))}
                  </Flex>
                </Box>
              ))}
            </Flex>

            {errors && errors.instruments && (
              <FormLabel error>{errors.instruments}</FormLabel>
            )}

            <Flex>
              <div style={{ marginLeft: "auto" }}>
                <Button
                  disabled={isSubmitting || !isValid}
                  color="primary"
                  variant="contained"
                  type="submit"
                >
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

const SelectInstrumentsFormWrapper = props => (
  <UISettingsContext.Consumer>
    {data => (
      <SelectInstrumentsForm
        initialValues={{
          instruments: data.selectedInstruments.reduce((acc, curr) => {
            acc[curr] = true;

            return acc;
          }, {})
        }}
        selectedInstruments={data.selectedInstruments}
        instruments={data.getInstruments()}
        onSubmit={values => {
          data.setSelectedInstruments(
            _.reduce(
              values.instruments,
              (acc, curr, key) => {
                if (curr === true) {
                  return acc.concat(key);
                }

                return acc;
              },
              []
            )
          );

          props.afterSubmit();
        }}
        {...props}
      />
    )}
  </UISettingsContext.Consumer>
);

SelectInstrumentsFormWrapper.propTypes = {
  afterSubmit: PropTypes.func
};

SelectInstrumentsFormWrapper.defaultProps = {
  afterSubmit: function() {}
};

export { SelectInstrumentsFormWrapper as SelectInstrumentsForm };
