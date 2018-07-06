import React from "react";
import PropTypes from "prop-types";
import numeral from "numeral";
import _ from "lodash";
import ReactTable from "components/ReactTable";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Button, Header, Divider, Confirm } from "semantic-ui-react";
import { RadioButton, RadioButtonGroup } from "form/Radio";
import { Toggle } from "form/Toggle";
import { TextInput } from "form/TextInput";
import { Flex, Box } from "grid-styled";
import { generateOrders } from "./scaledOrderGenerator";
import { ORDER_DISTRIBUTIONS } from "./constants";
import { DataContext } from "modules/data";
import Persist from "form/formik-persist";

class OrderForm extends React.PureComponent {
  static propTypes = {
    submitting: PropTypes.bool.isRequired,
    createOrders: PropTypes.func.isRequired,
    currentInstrument: PropTypes.string.isRequired
  };

  state = { open: false };

  showConfirmModal = () => this.setState({ open: true });
  handleConfirm = () => this.setState({ open: false });
  handleCancel = () => this.setState({ open: false });

  renderPreview(values) {
    let orders = generateOrders(values);

    // An error
    if (!_.isArray(orders)) {
      orders = [];
    }

    return (
      <React.Fragment>
        <Header as="h3">Order preview</Header>
        <ReactTable
          data={orders}
          minRows={0}
          showPagination={false}
          pageSize={orders.length}
          columns={[
            {
              Header: "Price",
              accessor: "price",
              Cell: ({ value }) => numeral(value).format("0,0"),
              Footer: () => (
                <div>
                  Avg. price:{" "}
                  {numeral(
                    _.sum(orders.map(x => x.price * x.amount)) / values.amount
                  ).format("0,0")}
                </div>
              )
            },
            {
              Header: "Amount",
              accessor: "amount",
              Cell: ({ value }) => numeral(value).format("0,0")
            }
          ]}
        />
      </React.Fragment>
    );
  }

  render() {
    const { submitting } = this.props;

    return (
      <Formik
        initialValues={{
          amount: 10000,
          orderCount: 5,
          priceLower: 8200,
          priceUpper: 8300,
          distribution: "flat",
          postOnly: false,
          reduceOnly: false,
          hidden: false
        }}
        isInitialValid
        onSubmit={vals => {
          const orders = generateOrders(vals);
          const execInst = [];

          /*
            Also known as a Post-Only order. If this order would have executed on placement, it will cancel instead.
          */
          if (vals.postOnly === true) {
            execInst.push("ParticipateDoNotInitiate");
          }

          /*
            A 'ReduceOnly' order can only reduce your position, not increase it.
            If you have a 'ReduceOnly' limit order that rests in the order book while the position is reduced by other orders, then its order quantity will be amended down or canceled.
            If there are multiple 'ReduceOnly' orders the least agresssive will be amended first.
          */
          if (vals.reduceOnly === true) {
            execInst.push("ReduceOnly");
          }

          const apiOrders = orders.map(x => ({
            symbol: this.props.currentInstrument,
            ordType: "Limit",
            side: vals.orderType,
            orderQty: x.amount,
            price: x.price,
            displayQty: vals.hidden === true ? 0 : undefined,
            execInst: execInst.length > 0 ? execInst.join(",") : undefined
          }));

          this.props.createOrders({ body: { orders: apiOrders } });
        }}
        validationSchema={props =>
          Yup.object().shape({
            postOnly: Yup.boolean().label("Post-Only"),
            reduceOnly: Yup.boolean().label("Reduce-Only"),
            hidden: Yup.boolean().label("Hidden"),
            distribution: Yup.string()
              .label("Distribution")
              .required(),
            amount: Yup.number()
              .label("Quantity")
              .integer()
              .required()
              .min(2),
            orderCount: Yup.number()
              .label("Number of orders")
              .integer()
              .min(2)
              .max(200)
              .required(),
            priceLower: Yup.number()
              .label("Price lower")
              .integer()
              .required()
              .positive(),
            priceUpper: Yup.number()
              .label("Price upper")
              .integer()
              .required()
              .positive()
              .moreThan(Yup.ref("priceLower"))
          })
        }
        render={({
          values,
          errors,
          touched,
          setFieldValue,
          submitForm,
          isValid
        }) => (
          <React.Fragment>
            <Form>
              <Flex mb={2} flexWrap="wrap">
                <Box pr={2} width={[1 / 2]}>
                  <Field
                    label="Quantity USD"
                    name="amount"
                    type="number"
                    min={2}
                    component={TextInput}
                  />

                  <div style={{ marginTop: "10px" }}>
                    <b>
                      Order value:{" "}
                      <DataContext.Consumer>
                        {data =>
                          data.orderValueXBT(values.amount) &&
                          `${numeral(data.orderValueXBT(values.amount)).format(
                            "0,0.0000"
                          )} XBT`
                        }
                      </DataContext.Consumer>{" "}
                    </b>
                  </div>
                </Box>
                <Box width={[1 / 2]}>
                  <Field
                    label="Number of orders"
                    name="orderCount"
                    type="number"
                    min={2}
                    component={TextInput}
                  />
                </Box>

                <Box w={1}>
                  <Divider />
                </Box>

                <Box pr={2} width={[1 / 2]}>
                  <Field
                    label="Price upper"
                    name="priceUpper"
                    type="number"
                    component={TextInput}
                  />
                </Box>
                <Box width={[1 / 2]}>
                  <Field
                    label="Price lower"
                    name="priceLower"
                    type="number"
                    component={TextInput}
                  />
                </Box>
              </Flex>

              <Flex mb={2}>
                <Box width={[1, 1 / 2]}>
                  <RadioButtonGroup
                    id="distribution"
                    label="Distribution"
                    value={values.distribution}
                    error={errors.distribution}
                    touched={touched.distribution}
                  >
                    {_.map(ORDER_DISTRIBUTIONS, distribution => (
                      <Field
                        component={RadioButton}
                        name="distribution"
                        id={distribution.key}
                        key={distribution.key}
                        label={distribution.label}
                      />
                    ))}
                  </RadioButtonGroup>
                </Box>

                <Box width={[1, 1 / 2]}>
                  <Header as="h4">Order execution</Header>
                  <Flex flexWrap="wrap">
                    <Box w={1} mb={2}>
                      <Field
                        name="postOnly"
                        component={Toggle}
                        label="Post-Only"
                        disabled={values.hidden === true}
                      />
                    </Box>
                    <Box w={1} mb={2}>
                      <Field
                        name="reduceOnly"
                        component={Toggle}
                        label="Reduce-Only"
                      />
                    </Box>
                    <Box w={1}>
                      <Field
                        name="hidden"
                        component={Toggle}
                        label="Hidden"
                        disabled={values.postOnly === true}
                      />
                    </Box>
                  </Flex>
                </Box>
              </Flex>

              <Divider />

              <Flex>
                <div style={{ marginLeft: "auto" }}>
                  <Button
                    disabled={!isValid || submitting}
                    type="submit"
                    color="green"
                    onClick={e => {
                      e.preventDefault();

                      setFieldValue("orderType", "Buy");
                      this.showConfirmModal();
                    }}
                  >
                    Buy / long
                  </Button>

                  <Button
                    style={{ marginRight: 0, marginLeft: "10px" }}
                    disabled={!isValid || submitting}
                    type="submit"
                    color="red"
                    onClick={e => {
                      e.preventDefault();

                      setFieldValue("orderType", "Sell");
                      this.showConfirmModal();
                    }}
                  >
                    Sell / short
                  </Button>
                </div>
              </Flex>

              <Persist name="order-form" />
            </Form>

            {isValid && this.renderPreview(values)}

            <Confirm
              header="Place orders"
              content={`
                Are you sure you want to place a ${String(
                  values.orderType
                ).toUpperCase()} order of ${numeral(values.amount).format(
                "0,0"
              )}?
              `}
              open={this.state.open}
              onCancel={this.handleCancel}
              onConfirm={() => {
                submitForm();
                this.handleConfirm();
              }}
            />
          </React.Fragment>
        )}
      />
    );
  }
}

export { OrderForm };
