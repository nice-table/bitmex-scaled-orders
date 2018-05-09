import React from "react";
import { BitmexFetch } from "modules/api";

export const CreateBulkBtcOrders = props => (
  <BitmexFetch url="order/bulk" method="POST" {...props} />
);

export const CancelOrder = props => (
  <BitmexFetch url="order" method="DELETE" {...props} />
);
