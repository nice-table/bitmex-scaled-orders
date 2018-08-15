import React from "react";
import PropTypes from "prop-types";
import numeral from "numeral";
import _ from "lodash";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Button, Header, Divider, Confirm } from "semantic-ui-react";
import { RadioButton, RadioButtonGroup } from "form/Radio";
import { Toggle } from "form/Toggle";
import { TextInput } from "form/TextInput";
import { Flex, Box } from "grid-styled";
import { Persist } from "form/formik-persist";
import ReactTooltip from "react-tooltip";

import { DataContext } from "modules/data";
import { generateOrders } from "./scaledOrderGenerator";
import { ORDER_DISTRIBUTIONS } from "./constants";
import { OrderPreview } from "./OrderPreview";
import { roundToTickSize } from "./index";

const formatOrderPrice = (tickSize, price) => {
  const rounded = roundToTickSize(tickSize, price);

  return rounded;
};

class OrderForm extends React.PureComponent {
  static propTypes = {
    createOrders: PropTypes.func.isRequired,
    currentInstrument: PropTypes.string.isRequired,
    instrumentData: PropTypes.object.isRequired
  };

  state = { open: false, isRetrying: false };

  showConfirmModal = () => this.setState({ open: true });
  handleConfirm = () => this.setState({ open: false });
  handleCancel = () => this.setState({ open: false });

  // Whether we're retrying to submit orders to Bitmex in case we're hit with overload responses
  // State is used in order to be able to stop the retry loop by button click for example
  setIsRetrying = isRetrying => this.setState({ isRetrying });

  renderPreview(values) {
    let orders = generateOrders({
      ...values,
      tickSize: this.props.instrumentData.tickSize
    });

    // An error
    if (!_.isArray(orders)) {
      orders = [];
    }

    return (
      <React.Fragment>
        <Header as="h3">Order preview</Header>
        <OrderPreview orders={orders} orderAmount={values.amount} />
      </React.Fragment>
    );
  }

  calculateAveragePrice(values) {
    const orders = generateOrders({
      ...values,
      tickSize: this.props.instrumentData.tickSize
    });

    if (!_.isArray(orders)) {
      return null;
    }

    return _.sum(orders.map(x => x.price * x.amount)) / values.amount;
  }

  render() {
    const { instrumentData } = this.props;

    return (
      <Formik
        key={this.props.currentInstrument}
        initialValues={{
          amount: 10,
          orderCount: 5,
          priceLower: instrumentData.lastPrice,
          priceUpper: roundToTickSize(
            instrumentData.tickSize,
            instrumentData.lastPrice * 1.01
          ),
          distribution: "flat",
          postOnly: false,
          reduceOnly: false,
          hidden: false
        }}
        isInitialValid
        onSubmit={(values, actions) => {
          const orders = generateOrders({
            ...values,
            tickSize: this.props.instrumentData.tickSize
          });
          const execInst = [];

          /*
            Also known as a Post-Only order. If this order would have executed on placement, it will cancel instead.
          */
          if (values.postOnly === true) {
            execInst.push("ParticipateDoNotInitiate");
          }

          /*
            A 'ReduceOnly' order can only reduce your position, not increase it.
            If you have a 'ReduceOnly' limit order that rests in the order book while the position is reduced by other orders, then its order quantity will be amended down or canceled.
            If there are multiple 'ReduceOnly' orders the least agresssive will be amended first.
          */
          if (values.reduceOnly === true) {
            execInst.push("ReduceOnly");
          }

          const apiOrders = orders.map(x => ({
            symbol: this.props.currentInstrument,
            ordType: "Limit",
            side: values.orderType,
            orderQty: x.amount,
            price: x.price,
            displayQty: values.hidden === true ? 0 : undefined,
            execInst: execInst.length > 0 ? execInst.join(",") : undefined
          }));

          actions.setSubmitting(true);

          if (values.retryOnOverload) {
            this.setIsRetrying(true);
          }

          const submitOrders = () =>
            new Promise((resolve, reject) => {
              this.props
                .createOrders({ body: { orders: apiOrders } })
                .then(resp => {
                  // https://www.bitmex.com/app/restAPI#Overload
                  if (
                    resp.response &&
                    resp.response.status === 503 &&
                    this.state.isRetrying === true
                  ) {
                    setTimeout(() => {
                      submitOrders().then(resolve);
                    }, 500); // Wait 500ms as specified by Bitmex before retrying on overload
                  } else {
                    resolve(resp);
                  }
                })
                .catch(reject);
            });

          submitOrders().finally(() => {
            actions.setSubmitting(false);
            this.setIsRetrying(false);
          });
        }}
        validationSchema={() =>
          Yup.object().shape({
            postOnly: Yup.boolean().label("Post-Only"),
            reduceOnly: Yup.boolean().label("Reduce-Only"),
            hidden: Yup.boolean().label("Hidden"),
            retryOnOverload: Yup.boolean().label("Retry on overload"),
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
              .required()
              .positive(),
            priceUpper: Yup.number()
              .label("Price upper")
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
          isSubmitting,
          isValid,
          validateForm
        }) => (
          <React.Fragment>
            <Form>
              <Flex mb={2} flexWrap="wrap">
                <Box pr={2} width={[1 / 2]}>
                  <Field
                    label="Quantity Contracts"
                    name="amount"
                    type="number"
                    min={2}
                    component={TextInput}
                  />

                  <div style={{ marginTop: "10px" }}>
                    <b>
                      Order value:{" "}
                      <DataContext.Consumer>
                        {data => {
                          const averagePrice = this.calculateAveragePrice(
                            values
                          );

                          return (
                            averagePrice &&
                            `${numeral(
                              data.orderValueXBT(averagePrice, values.amount)
                            ).format("0,0.0000")} XBT`
                          );
                        }}
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

                <Box width={1}>
                  <Divider />
                </Box>

                <Box pr={2} width={[1 / 2]}>
                  <Field
                    label="Price upper"
                    name="priceUpper"
                    type="number"
                    step={instrumentData.tickSize}
                    component={TextInput}
                    onBlur={(e, field) =>
                      setFieldValue(
                        "priceUpper",
                        formatOrderPrice(
                          instrumentData.tickSize,
                          e.target.value
                        )
                      )
                    }
                  />
                </Box>
                <Box width={[1 / 2]}>
                  <Field
                    label="Price lower"
                    name="priceLower"
                    type="number"
                    step={instrumentData.tickSize}
                    component={TextInput}
                    onBlur={(e, field) =>
                      setFieldValue(
                        "priceLower",
                        formatOrderPrice(
                          instrumentData.tickSize,
                          e.target.value
                        )
                      )
                    }
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
                    <Box width={1} mb={2}>
                      <Field
                        data-tip
                        data-for="post-only-message"
                        name="postOnly"
                        component={Toggle}
                        label="Post-Only"
                        disabled={values.hidden === true}
                      />
                      <ReactTooltip
                        place="right"
                        id="post-only-message"
                        effect="solid"
                        multiline
                      >
                        A Post-Only Order will not execute immediately against
                        the market. Use to ensure a Maker Rebate. <br />
                        If it would execute against resting orders, it will
                        cancel instead.
                      </ReactTooltip>
                    </Box>

                    <Box width={1} mb={2}>
                      <Field
                        data-tip
                        data-for="reduce-only-message"
                        name="reduceOnly"
                        component={Toggle}
                        label="Reduce-Only"
                      />
                      <ReactTooltip
                        place="right"
                        id="reduce-only-message"
                        effect="solid"
                        multiline
                      >
                        A Reduce-Only Order will only reduce your position, not
                        increase it. <br />
                        If this order would increase your position, it is
                        amended down or canceled such that it does not.
                      </ReactTooltip>
                    </Box>

                    <Box mb={2} width={1}>
                      <Field
                        data-tip
                        data-for="hidden-message"
                        name="hidden"
                        component={Toggle}
                        label="Hidden"
                        disabled={values.postOnly === true}
                      />
                      <ReactTooltip
                        place="right"
                        id="hidden-message"
                        effect="solid"
                        multiline
                      >
                        Hidden orders do not display in the order book
                      </ReactTooltip>
                    </Box>

                    <Box width={1}>
                      <Field
                        data-tip
                        data-for="overload-message"
                        name="retryOnOverload"
                        component={Toggle}
                        label="Retry on overload"
                      />

                      <ReactTooltip
                        place="right"
                        id="overload-message"
                        effect="solid"
                        multiline
                      >
                        Will re-submit every 500 ms when Bitmex responds with
                        overload message until successful
                      </ReactTooltip>
                    </Box>
                  </Flex>
                </Box>
              </Flex>

              <Divider />

              <Flex>
                <div style={{ marginLeft: "auto" }}>
                  <Button
                    disabled={!isValid || isSubmitting}
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
                    disabled={!isValid || isSubmitting}
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

                  {this.state.isRetrying && (
                    <Button
                      type="button"
                      style={{ marginRight: 0, marginLeft: "10px" }}
                      onClick={() => this.setIsRetrying(false)}
                    >
                      Stop retrying
                    </Button>
                  )}
                </div>
              </Flex>

              <Persist
                debounce={0}
                name={`order-form-v2.${this.props.currentInstrument}`}
              />
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
