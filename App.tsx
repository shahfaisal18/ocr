import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StockData, Trade, Position, PriceData, Direction } from './types';
import { MOCK_SCREENSHOTS, INITIAL_BALANCE, TRADE_SIZE_USD } from './constants';
import { extractStockDataFromName } from './services/geminiService';
import StatCard from './components/StatCard';
import TradeHistory from './components/TradeHistory';
import Positions from './components/Positions';
import PriceChart from './components/PriceChart';
import OcrFeed from './components/OcrFeed';
import { GithubIcon, AlertTriangleIcon, InfoIcon, ZapIcon } from './components/Icons';


const App: React.FC = () => {
  const [balance, setBalance] = useState<number>(INITIAL_BALANCE);
  const [positions, setPositions] = useState<Record<string, Position>>({});
  const [tradeHistory, setTradeHistory] = useState<Trade[]>([]);
  const [priceHistory, setPriceHistory] = useState<PriceData[]>([]);
  const [currentOcrData, setCurrentOcrData] = useState<StockData | null>(null);
  const [currentScreenshot, setCurrentScreenshot] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const simulationIntervalRef = useRef<number | null>(null);
  const screenshotIndexRef = useRef<number>(0);

  // FIX: Explicitly type the arguments of the reduce function to prevent TypeScript from inferring `pos` as 'unknown'.
  const totalPortfolioValue = Object.values(positions).reduce(
    (acc: number, pos: Position) => acc + pos.quantity * (priceHistory.find(p => p.symbol === pos.symbol)?.price || pos.entryPrice),
    0
  );
  const totalValue = balance + totalPortfolioValue;
  // FIX: Explicitly type the arguments of the reduce function, as `pos` was being inferred as 'unknown', causing an arithmetic operation error on line 34.
  const unrealizedPnl = totalPortfolioValue - Object.values(positions).reduce((acc: number, pos: Position) => acc + pos.quantity * pos.entryPrice, 0);

  const processOcrData = useCallback((data: StockData) => {
    setCurrentOcrData(data);
    
    // Update price history for chart
    setPriceHistory(prev => {
      const existing = prev.filter(p => p.symbol === data.symbol);
      const newEntry: PriceData = { name: new Date(data.timestamp).toLocaleTimeString(), price: data.price, symbol: data.symbol };
      const updatedHistory = [...existing.slice(-29), newEntry]; // Keep last 30 data points per symbol
      return [...prev.filter(p => p.symbol !== data.symbol), ...updatedHistory];
    });

    const existingPosition = positions[data.symbol];
    let newTrade: Trade | null = null;

    if (data.direction === Direction.UP) {
      const quantity = TRADE_SIZE_USD / data.price;
      if (balance >= TRADE_SIZE_USD) {
        setBalance(prev => prev - TRADE_SIZE_USD);
        setPositions(prev => ({
          ...prev,
          [data.symbol]: {
            symbol: data.symbol,
            quantity: (prev[data.symbol]?.quantity || 0) + quantity,
            entryPrice: ((prev[data.symbol]?.entryPrice || 0) * (prev[data.symbol]?.quantity || 0) + TRADE_SIZE_USD) / ((prev[data.symbol]?.quantity || 0) + quantity),
          }
        }));
        newTrade = {
          id: Date.now(),
          symbol: data.symbol,
          type: 'BUY',
          quantity,
          price: data.price,
          timestamp: data.timestamp,
        };
      }
    } else if (data.direction === Direction.DOWN && existingPosition && existingPosition.quantity > 0) {
      const sellQuantity = Math.min(existingPosition.quantity, TRADE_SIZE_USD / data.price);
      const sellValue = sellQuantity * data.price;
      setBalance(prev => prev + sellValue);
      setPositions(prev => {
        const newQuantity = prev[data.symbol].quantity - sellQuantity;
        if (newQuantity < 0.0001) {
          const { [data.symbol]: _, ...rest } = prev;
          return rest;
        }
        return { ...prev, [data.symbol]: { ...prev[data.symbol], quantity: newQuantity } };
      });
      newTrade = {
        id: Date.now(),
        symbol: data.symbol,
        type: 'SELL',
        quantity: sellQuantity,
        price: data.price,
        timestamp: data.timestamp,
      };
    }

    if (newTrade) {
      setTradeHistory(prev => [newTrade!, ...prev].slice(0, 50));
    }
  }, [balance, positions]);

  const runSimulationStep = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const screenshot = MOCK_SCREENSHOTS[screenshotIndexRef.current];
      setCurrentScreenshot(screenshot.image);
      const data = await extractStockDataFromName(screenshot.name);
      processOcrData(data);
      screenshotIndexRef.current = (screenshotIndexRef.current + 1) % MOCK_SCREENSHOTS.length;
    } catch (err) {
      console.error(err);
      setError('Failed to process screenshot. The Gemini API might be unavailable or the response was invalid. Pausing simulation.');
      setIsPaused(true);
    } finally {
      setIsLoading(false);
    }
  }, [processOcrData]);

  useEffect(() => {
    if (isPaused) {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
        simulationIntervalRef.current = null;
      }
    } else {
      // Run first step immediately
      runSimulationStep();
      simulationIntervalRef.current = window.setInterval(runSimulationStep, 4000);
    }
    return () => {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaused]);

  return (
    <div className="min-h-screen bg-base p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-text flex items-center gap-3">
                <ZapIcon />
                Stock OCR Simulation System
              </h1>
              <p className="text-muted mt-1">A real-time dashboard simulating trades based on generative model OCR.</p>
            </div>
            <a
              href="https://github.com/google/generative-ai-docs/tree/main/site/en/gemini-api/docs/prompting_with_media"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-subtle hover:text-text transition-colors px-3 py-2 bg-surface rounded-lg"
            >
              <GithubIcon />
              View on GitHub
            </a>
          </div>
          <div className="mt-4 p-4 bg-rose/10 border border-rose/30 text-rose/90 rounded-lg flex items-start gap-3">
            <AlertTriangleIcon className="w-5 h-5 mt-1 flex-shrink-0" />
            <div>
              <h2 className="font-semibold">Legal Disclaimer & Simulation Notice</h2>
              <p className="text-sm">This is a technology demonstration and NOT a real trading application. All data is simulated, and trades are virtual. Do not use this for financial decisions. No connection to any brokerage account is made.</p>
            </div>
          </div>
        </header>

        <main>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
            <StatCard title="Total Value" value={totalValue} prefix="$" trend={totalValue > INITIAL_BALANCE ? 'up' : 'down'} />
            <StatCard title="Cash Balance" value={balance} prefix="$" />
            <StatCard title="Portfolio Value" value={totalPortfolioValue} prefix="$" />
            <StatCard title="Unrealized P&L" value={unrealizedPnl} prefix="$" trend={unrealizedPnl > 0 ? 'up' : unrealizedPnl < 0 ? 'down' : 'flat'} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <PriceChart data={priceHistory} symbol={currentOcrData?.symbol || ''} />
              <TradeHistory trades={tradeHistory} />
            </div>
            <div className="space-y-6">
              <OcrFeed
                screenshot={currentScreenshot}
                data={currentOcrData}
                isLoading={isLoading}
                error={error}
                isPaused={isPaused}
                togglePause={() => setIsPaused(p => !p)}
              />
              <Positions positions={positions} />
            </div>
          </div>
        </main>

        <footer className="text-center text-muted mt-12 text-sm">
          <p>&copy; {new Date().getFullYear()} Stock OCR Simulation. For demonstration purposes only.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;