import { gql } from '@apollo/client';

export const GET_TRADES_BY_SYMBOL = gql`
  query GetTradesBySymbol($symbol: String!) {
    tradesBySymbol(symbol: $symbol) {
      tradeId
      traderId
      symbol
      side
      quantity
      price
      tradeValue
      status
      exchange
      timestamp
    }
  }
`;

export const GET_TRADES_BY_TRADER = gql`
  query GetTradesByTrader($traderId: String!) {
    tradesByTrader(traderId: $traderId) {
      tradeId
      traderId
      symbol
      side
      quantity
      price
      tradeValue
      status
      exchange
      timestamp
    }
  }
`;

export const GET_TRADE_BY_ID = gql`
  query GetTradeById($tradeId: ID!) {
    tradeById(tradeId: $tradeId) {
      tradeId
      traderId
      symbol
      side
      quantity
      price
      tradeValue
      status
      exchange
      timestamp
    }
  }
`;