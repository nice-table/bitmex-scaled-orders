import React, { PureComponent } from "react";
import { Flex, Box } from "grid-styled";
import { Header } from "semantic-ui-react";
import Composer from "react-composer";
import { toast } from "react-toastify";
import { Tabs, Tab } from "components/Tabs";
import { PlainButton } from "components/Buttons";

import { DataContext } from "modules/data";
import { OrderForm, CreateBulkBtcOrders, CancelOrder } from "modules/orders";
import { OrdersTable } from "./OrdersTable";
import { PositionsTable } from "./PositionsTable";

class Dashboard extends PureComponent {
  render() {
    return (
      <Composer
        components={[
          <CancelOrder
            afterFetch={({ response }) => {
              if (response.ok) {
                toast.info("Order cancelled");
              }
            }}
          />,
          <CreateBulkBtcOrders
            afterFetch={({ response }) => {
              if (response.ok) {
                toast.success("Orders placed");
              }
            }}
          />
        ]}
      >
        {([cancelOrder, createBulkOrders]) => (
          <React.Fragment>
            <Header as="h1">Bitmex scaled orders</Header>

            <DataContext.Consumer>
              {data => (
                <Tabs mb={3}>
                  {data.getSymbols().map(symbol => (
                    <Tab
                      px={0}
                      py={0}
                      mr={2}
                      active={symbol === data.getCurrentInstrument()}
                      key={symbol}
                    >
                      <PlainButton
                        p={3}
                        aria-label="Change symbol"
                        onClick={() => data.changeCurrentInstrument(symbol)}
                      >
                        {symbol}
                      </PlainButton>
                    </Tab>
                  ))}
                </Tabs>
              )}
            </DataContext.Consumer>

            <Flex flexWrap="wrap">
              <Box width={[1, null, 1 / 2]} mb={4} pr={[0, null, 4]}>
                <DataContext.Consumer>
                  {data => (
                    <OrderForm
                      currentInstrument={data.getCurrentInstrument()}
                      createOrders={createBulkOrders.doFetch}
                    />
                  )}
                </DataContext.Consumer>
              </Box>

              <Box width={[1, null, 1 / 2]}>
                <div style={{ marginBottom: "15px" }}>
                  <Header as="h3">Open positions</Header>{" "}
                  <DataContext.Consumer>
                    {data => (
                      <PositionsTable positions={data.getAllPositions()} />
                    )}
                  </DataContext.Consumer>
                </div>

                <div>
                  <Header as="h3">Active orders</Header>
                  <DataContext.Consumer>
                    {data => (
                      <OrdersTable
                        orders={data.getAllOrders()}
                        cancelOrder={cancelOrder}
                      />
                    )}
                  </DataContext.Consumer>
                </div>
              </Box>
            </Flex>
          </React.Fragment>
        )}
      </Composer>
    );
  }
}

export default Dashboard;
