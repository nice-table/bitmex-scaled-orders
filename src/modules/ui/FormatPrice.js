import React from "react";
import { Decimal } from "decimal.js";
import numeral from "numeral";
import { UISettingsContext } from "./index";

const FormatPrice = ({ price, instrumentData, ...props }) => {
  if (!instrumentData) {
    return price;
  }

  const tickSize = new Decimal(instrumentData.tickSize);
  const numberOfDecimalPlaces = tickSize.dp();

  const zeros = "0".repeat(numberOfDecimalPlaces);

  return numeral(price).format(`0,0.${zeros}`);
};

const FormatPriceWrapper = props => (
  <UISettingsContext.Consumer>
    {data => (
      <FormatPrice
        {...props}
        instrumentData={data
          .getInstruments()
          .find(
            x =>
              (props.symbol == null && x.symbol === data.currentInstrument) ||
              x.symbol === props.symbol
          )}
      />
    )}
  </UISettingsContext.Consumer>
);

export { FormatPriceWrapper as FormatPrice };
