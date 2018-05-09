import React, { PureComponent } from "react";
import { Flex, Box } from "grid-styled";
import styled from "styled-components";
import { Header } from "semantic-ui-react";
import Composer from "react-composer";
import { OrderForm, CreateBulkBtcOrders, CancelOrder } from "modules/orders";
import { toast } from "react-toastify";
import { OrdersTable } from "./OrdersTable";
import { PositionsTable } from "./PositionsTable";
import sockette from "sockette";
import produce from "immer";
import { websocketPort } from "config";

const Container = styled.div`
  max-width: 1300px;
  margin: 30px auto;
  padding: 10px;

  @media (min-width: 1300px) {
    padding: 0;
  }
`;

class Dashboard extends PureComponent {
  state = {
    bitmex: {}
  };

  componentDidMount() {
    this.ws = new sockette(`ws://localhost:${websocketPort}`, {
      onmessage: e => {
        const message = JSON.parse(e.data);

        if (message.source === "bitmex" && message.data) {
          this.setState(
            produce(draft => {
              draft.bitmex[`${message.symbol}:${message.tableName}`] =
                message.data;
            })
          );
        }
      }
    });
  }

  componentWillUnmount() {
    this.ws.close();
  }

  getOrders() {
    if (this.state.bitmex["XBTUSD:order"]) {
      return this.state.bitmex["XBTUSD:order"];
    }

    return [];
  }

  getPositions() {
    if (this.state.bitmex["XBTUSD:position"]) {
      return this.state.bitmex["XBTUSD:position"];
    }

    return [];
  }

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
          <Container>
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
                  <PositionsTable positions={this.getPositions()} />
                </div>

                <div>
                  <Header as="h3">Active orders</Header>
                  {this.getOrders().length > 0 ? (
                    <OrdersTable
                      orders={this.getOrders().filter(
                        x => x.ordType === "Limit"
                      )}
                      cancelOrder={cancelOrder}
                    />
                  ) : (
                    <p>No open orders.</p>
                  )}
                </div>
              </Box>
            </Flex>
          </Container>
        )}
      </Composer>
    );
  }
}

export default Dashboard;
