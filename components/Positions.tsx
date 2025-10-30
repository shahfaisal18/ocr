import React from 'react';
import { Position } from '../types';

interface PositionsProps {
  positions: Record<string, Position>;
}

const Positions: React.FC<PositionsProps> = ({ positions }) => {
  const positionArray = Object.values(positions);

  return (
    <div className="bg-surface p-4 rounded-lg shadow-md border border-overlay">
      <h3 className="text-lg font-semibold mb-4">Current Positions</h3>
      <div className="overflow-y-auto max-h-96">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-subtle uppercase bg-base sticky top-0">
            <tr>
              <th scope="col" className="px-4 py-2">Symbol</th>
              <th scope="col" className="px-4 py-2 text-right">Quantity</th>
              <th scope="col" className="px-4 py-2 text-right">Avg. Entry</th>
            </tr>
          </thead>
          <tbody>
            {/* FIX: Explicitly type `pos` as `Position` to resolve property access errors, as it was being inferred as `unknown`. */}
            {positionArray.map((pos: Position) => (
              <tr key={pos.symbol} className="border-b border-overlay last:border-b-0 hover:bg-overlay">
                <td className="px-4 py-2 font-medium">{pos.symbol}</td>
                <td className="px-4 py-2 text-right">{pos.quantity.toFixed(4)}</td>
                <td className="px-4 py-2 text-right">${pos.entryPrice.toFixed(2)}</td>
              </tr>
            ))}
            {positionArray.length === 0 && (
                <tr>
                    <td colSpan={3} className="text-center text-muted p-4">No open positions.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Positions;