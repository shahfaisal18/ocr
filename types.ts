export enum Direction {
  UP = 'up',
  DOWN = 'down',
  FLAT = 'flat',
}

export interface StockData {
  symbol: string;
  price: number;
  direction: Direction;
  timestamp: string;
}

export interface Trade {
  id: number;
  symbol: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  timestamp: string;
}

export interface Position {
  symbol: string;
  quantity: number;
  entryPrice: number;
}

export interface PriceData {
  name: string; // Typically a timestamp formatted for the chart
  price: number;
  symbol: string;
}

export interface MockScreenshot {
    name: string;
    image: string; // base64 encoded image
}
