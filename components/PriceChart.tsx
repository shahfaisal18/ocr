import React from 'react';
import { PriceData } from '../types';

interface PriceChartProps {
  data: PriceData[];
  symbol: string;
}

const PriceChart: React.FC<PriceChartProps> = ({ data, symbol }) => {
  const chartData = data.filter(d => d.symbol === symbol);
  const width = 500;
  const height = 250;
  const padding = 40;

  const renderEmptyState = (message: string) => (
     <div className="bg-surface p-4 rounded-lg shadow-md border border-overlay h-[354px]">
        <h3 className="text-lg font-semibold mb-2">Price Chart: {symbol || 'N/A'}</h3>
        <div className="flex items-center justify-center h-full text-muted">
          <p>{message}</p>
        </div>
      </div>
  )

  if (!symbol) return renderEmptyState('Waiting for first OCR result...');
  if (chartData.length < 2) return renderEmptyState('Not enough data to display chart.');

  const prices = chartData.map(d => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;

  const getX = (index: number) => (index / (chartData.length - 1)) * (width - padding * 2) + padding;
  const getY = (price: number) => height - padding - ((price - minPrice) / priceRange) * (height - padding * 2);

  const path = chartData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.price)}`).join(' ');
  const firstPrice = chartData[0].price;
  const lastPrice = chartData[chartData.length - 1].price;
  const chartColor = lastPrice >= firstPrice ? 'stroke-pine' : 'stroke-love';

  const yAxisLabels = [];
  for(let i = 0; i <= 4; i++) {
    const price = minPrice + (priceRange / 4) * i;
    yAxisLabels.push({
      price: price.toFixed(2),
      y: getY(price),
    });
  }

  const xAxisLabels = chartData.filter((_, i) => i === 0 || i === chartData.length - 1 || i % Math.max(1, Math.floor(chartData.length / 4)) === 0).filter((item, index, self) => self.findIndex(t => t.name === item.name) === index);


  return (
    <div className="bg-surface p-4 rounded-lg shadow-md border border-overlay">
      <h3 className="text-lg font-semibold mb-2">Price Chart: {symbol}</h3>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" aria-label={`Price chart for ${symbol}`}>
        <g>
          {yAxisLabels.map(label => (
            <g key={label.y} className="text-muted text-xs">
              <line x1={padding} y1={label.y} x2={width - padding} y2={label.y} className="stroke-overlay" strokeDasharray="2,2"/>
              <text x={padding - 8} y={label.y + 4} textAnchor="end" fill="currentColor">{label.price}</text>
            </g>
          ))}
        </g>
        <g>
          {xAxisLabels.map((d) => (
             <text key={d.name} x={getX(chartData.findIndex(cd => cd.name === d.name))} y={height-padding+20} textAnchor="middle" className="fill-muted text-xs">{d.name}</text>
          ))}
        </g>
        <path d={path} fill="none" className={chartColor} strokeWidth="2" />
      </svg>
    </div>
  );
};

export default PriceChart;
