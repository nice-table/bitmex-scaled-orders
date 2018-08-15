import React from "react";
import styled from "styled-components";
import { pure } from "recompose";
import { Tabs, Tab } from "components/Tabs";
import { PlainButton } from "components/Buttons";
import { Icon } from "semantic-ui-react";
import LastPrice from "./LastPrice";

const PriceLabel = styled.div`
  margin-top: 3px;
  font-size: 12px;
`;

const EditTab = styled(Tab)`
  background: none;
  display: flex;
  border: 1px dashed rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
  }
`;

export const InstrumentTabs = pure(
  ({
    onChangeActiveInstruments,
    currentInstrument,
    changeCurrentInstrument,
    instruments
  }) => (
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
            p={2}
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

      <EditTab px={0} py={0} mr={2}>
        <PlainButton
          onClick={onChangeActiveInstruments}
          p={3}
          aria-label="Change active instruments"
          title="Change active instruments"
        >
          <Icon style={{ margin: 0 }} name="add" size="large" />
        </PlainButton>
      </EditTab>
    </Tabs>
  )
);
