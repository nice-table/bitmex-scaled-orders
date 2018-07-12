import React from "react";
import { BitmexFetch } from "modules/api";

export const FetchXBTFuturesInstruments = props => (
  <BitmexFetch
    url={`instrument?filter={"rootSymbol": "XBT", "state": "Open", "typ": "FFCCSX"}`}
    {...props}
  />
);
