import React from 'react';
import { Trade } from '../types';

interface TradeHistoryProps {
  trades: Trade[];
}

const TradeHistory: React.FC<TradeHistoryProps> = ({ trades }) => {
  return (
    <div className="bg-surface p-4 rounded-lg shadow-md border border-overlay h-96">
      <h3 className="text-lg font-semibold mb-4">Trade History</h3>
      <div className="overflow-y-auto h-[calc(100%-2.5rem)]">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-subtle uppercase bg-base sticky top-0">
            <tr>
              <th scope="col" className="px-4 py-2">Symbol</th>
              <th scope="col" className="px-4 py-2">Type</th>
              <th scope="col" className="px-4 py-2 text-right">Quantity</th>
              <th scope="col" className="px-4 py-2 text-right">Price</th>
              <th scope="col" className="px-4 py-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <tr key={trade.id} className="border-b border-overlay hover:bg-overlay">
                <td className="px-4 py-2 font-medium">{trade.symbol}</td>
                <td className={`px-4 py-2 font-semibold ${trade.type === 'BUY' ? 'text-pine' : 'text-love'}`}>{trade.type}</td>
                <td className="px-4 py-2 text-right">{trade.quantity.toFixed(4)}</td>
                <td className="px-4 py-2 text-right">${trade.price.toFixed(2)}</td>
                <td className="px-4 py-2 text-muted">{new Date(trade.timestamp).toLocaleTimeString()}</td>
              </tr>
            ))}
             {trades.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-muted p-4">No trades yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TradeHistory;
