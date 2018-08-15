import React from "react";
import { Flex, Box } from "grid-styled";
import Composer from "react-composer";
import { toast } from "react-toastify";
import { Header, Modal } from "semantic-ui-react";
import { DataContext } from "modules/data";
import { UISettingsContext, SelectInstrumentsForm } from "modules/ui";
import { OrderForm, CreateBulkBtcOrders, CancelOrder } from "modules/orders";
import { OrdersTable } from "./OrdersTable";
import { PositionsTable } from "./PositionsTable";
import { InstrumentTabs } from "./InstrumentTabs";

class Dashboard extends React.Component {
  state = {
    isSettingsModalOpen: false
  };

  onSetOpen = isOpen => this.setState({ isSettingsModalOpen: isOpen });

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

            <UISettingsContext.Consumer>
              {data => (
                <InstrumentTabs
                  instruments={data.getSelectedInstruments()}
                  currentInstrument={data.currentInstrument}
                  changeCurrentInstrument={data.setCurrentInstrument}
                  onChangeActiveInstruments={() => this.onSetOpen(true)}
                />
              )}
            </UISettingsContext.Consumer>

            <Modal
              onOpen={() => this.onSetOpen(true)}
              open={this.state.isSettingsModalOpen}
              onClose={() => this.onSetOpen(false)}
              size="small"
            >
              <Modal.Content>
                <Header as="h2">Active instruments</Header>
                <SelectInstrumentsForm
                  afterSubmit={() => this.onSetOpen(false)}
                />
              </Modal.Content>
            </Modal>

            <Flex flexWrap="wrap">
              <Box width={[1, null, 1 / 2]} mb={4} pr={[0, null, 4]}>
                <UISettingsContext.Consumer>
                  {data => (
                    <OrderForm
                      instrumentData={data.getCurrentInstrumentData()}
                      currentInstrument={data.currentInstrument}
                      createOrders={createBulkOrders.doFetch}
                    />
                  )}
                </UISettingsContext.Consumer>
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
