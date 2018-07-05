import React, { PureComponent } from "react";
import { Flex, Box } from "grid-styled";
import { Header } from "semantic-ui-react";
import Composer from "react-composer";
import { toast } from "react-toastify";

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
            <Flex flexWrap="wrap">
              <Box width={[1, null, 1 / 2]} mb={4} pr={[0, null, 4]}>
                <OrderForm
                  submitting={createBulkOrders.fetching}
                  createOrders={orders =>
                    createBulkOrders.doFetch({ body: { orders } })
                  }
                />
              </Box>

              <Box width={[1, null, 1 / 2]}>
                <div style={{ marginBottom: "15px" }}>
                  <Header as="h3">XBTUSD positions</Header>{" "}
                  <DataContext.Consumer>
                    {data => <PositionsTable positions={data.getPositions()} />}
                  </DataContext.Consumer>
                </div>

                <div>
                  <Header as="h3">Active orders</Header>
                  <DataContext.Consumer>
                    {data =>
                      data.getOrders().length > 0 ? (
                        <OrdersTable
                          orders={data
                            .getOrders()
                            .filter(
                              x =>
                                x.ordType === "Limit" &&
                                x.ordStatus !== "Rejected"
                            )}
                          cancelOrder={cancelOrder}
                        />
                      ) : (
                        <p>No open orders.</p>
                      )
                    }
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
