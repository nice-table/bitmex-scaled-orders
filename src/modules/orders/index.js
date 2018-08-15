import { Decimal } from "decimal.js";
export { generateOrders } from "./scaledOrderGenerator";

export { CreateBulkBtcOrders, CancelOrder } from "./fetch";

export { OrderForm } from "./OrderForm";
export { ORDER_DISTRIBUTIONS } from "./constants";

export const roundToTickSize = (tickSize, price) => {
  const tp = new Decimal(tickSize);

  const p = price;
  const t = tickSize;

  const rounded = p - (p % t) + (p % t < t / 2 ? 0 : t);
  const roundedDecimal = new Decimal(rounded);

  return roundedDecimal.toDecimalPlaces(tp.dp()).toNumber();
};
