import React from "react";
import { BitmexFetch } from "modules/api";

export const FetchInstruments = props => (
  <BitmexFetch skipAuth url={`instrument/active`} {...props} />
);
