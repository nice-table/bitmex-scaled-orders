import React from "react";
import { Flex, Box } from "@rebass/grid";
import Composer from "react-composer";
import { toast } from "react-toastify";
import { Header } from "components/Header";
import { DataContext } from "modules/data";
import { Dialog } from "components/Dialog";
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
            <Header as="h1" variant="h3" gutterBottom>
              Bitmex scaled orders
            </Header>

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

            <Dialog
              open={this.state.isSettingsModalOpen}
              onClose={() => this.onSetOpen(false)}
              title="Active instruments"
              content={() => (
                <SelectInstrumentsForm
                  afterSubmit={() => this.onSetOpen(false)}
                />
              )}
            />

            <Flex flexWrap="wrap">
              <Box width={[1, null, 2 / 5, 1 / 3]} mb={4} pr={[0, null, 4]}>
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

              <Box width={[1, null, 3 / 5, 2 / 3]}>
                <div style={{ marginBottom: "15px" }}>
                  <Header variant="h5" as="h3" gutterBottom>
                    Open positions
                  </Header>

                  <DataContext.Consumer>
                    {data => (
                      <PositionsTable positions={data.getAllPositions()} />
                    )}
                  </DataContext.Consumer>
                </div>

                <div>
                  <Header variant="h5" as="h3" gutterBottom>
                    Active orders
                  </Header>

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
