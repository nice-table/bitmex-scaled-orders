import React from "react";
import styled from "styled-components";
import { pure } from "recompose";
import { Tabs, Tab } from "components/Tabs";
import { PlainButton } from "components/Buttons";
import LastPrice from "./LastPrice";

const PriceLabel = styled.div`
  margin-top: 3px;
  font-size: 12px;
`;

export const InstrumentTabs = pure(
  ({ currentInstrument, changeCurrentInstrument, instruments }) => (
    <Tabs mb={3}>
      {instruments.map(symbol => (
        <Tab
          px={0}
          py={0}
          mr={2}
          active={symbol === currentInstrument}
          key={symbol}
        >
          <PlainButton
            p={3}
            aria-label="Change instrument"
            onClick={() => changeCurrentInstrument(symbol)}
          >
            {symbol}
            <LastPrice symbol={symbol}>
              {({ lastPrice }) => (
                <PriceLabel aria-label="Last price">{lastPrice}</PriceLabel>
              )}
            </LastPrice>
          </PlainButton>
        </Tab>
      ))}
    </Tabs>
  )
);
