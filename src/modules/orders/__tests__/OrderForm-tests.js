import React from "react";
import ReactDOM from "react-dom";
import { OrderForm } from "../OrderForm";
import { ThemeProvider } from "../../../Theme";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <ThemeProvider>
      <OrderForm
        createOrders={() =>
          new Promise(resolve => resolve({ respose: { status: 200 } }))
        }
        currentInstrument="XBTUSD"
        instrumentData={{
          tickSize: 0.5,
          lastPrice: 6000
        }}
      />
    </ThemeProvider>,
    div
  );
});
