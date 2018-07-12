import React from "react";
import { pure } from "recompose";
import { Tabs, Tab } from "components/Tabs";
import { PlainButton } from "components/Buttons";

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
            aria-label="Change symbol"
            onClick={() => changeCurrentInstrument(symbol)}
          >
            {symbol}
          </PlainButton>
        </Tab>
      ))}
    </Tabs>
  )
);
