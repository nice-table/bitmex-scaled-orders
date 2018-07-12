import React from "react";
import ReactDOM from "react-dom";
import { OrderForm } from "../OrderForm";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <OrderForm
      createOrders={() =>
        new Promise(resolve => resolve({ respose: { status: 200 } }))
      }
      currentInstrument="XBTUSD"
    />,
    div
  );
});
