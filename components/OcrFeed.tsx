import React from 'react';
import { StockData } from '../types';

interface OcrFeedProps {
  screenshot: string;
  data: StockData | null;
  isLoading: boolean;
  error: string | null;
  isPaused: boolean;
  togglePause: () => void;
}

const OcrFeed: React.FC<OcrFeedProps> = ({ screenshot, data, isLoading, error, isPaused, togglePause }) => {
  return (
    <div className="bg-surface p-4 rounded-lg shadow-md border border-overlay">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Live OCR Feed</h3>
        <button
            onClick={togglePause}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                isPaused 
                ? 'bg-pine/80 hover:bg-pine text-text' 
                : 'bg-rose/80 hover:bg-rose text-text'
            }`}
        >
            {isPaused ? 'Resume' : 'Pause'}
        </button>
      </div>
      
      <div className="aspect-w-9 aspect-h-16 bg-base rounded-md mb-4 overflow-hidden relative border border-overlay">
        {screenshot ? (
          <img src={`data:image/png;base64,${screenshot}`} alt="Trading App Screenshot" className="object-cover w-full h-full" />
        ) : (
          <div className="flex items-center justify-center h-full text-muted">
            <p>Waiting for screenshot...</p>
          </div>
        )}
        {isLoading && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <div className="animate-pulse-fast text-text">Processing...</div>
          </div>
        )}
      </div>

      <div className="space-y-2 text-sm">
        <h4 className="font-semibold text-subtle">Extracted Data:</h4>
        {error && <p className="text-love bg-love/10 p-2 rounded-md">{error}</p>}
        {!error && data ? (
          <div className="bg-base p-3 rounded-md font-mono">
            <p><span className="text-muted">Symbol:</span> <span className="text-iris font-bold">{data.symbol}</span></p>
            <p><span className="text-muted">Price:</span> <span className="text-gold">${data.price.toFixed(2)}</span></p>
            <p><span className="text-muted">Direction:</span> <span className={data.direction === 'up' ? 'text-pine' : data.direction === 'down' ? 'text-love' : 'text-subtle'}>{data.direction}</span></p>
            <p><span className="text-muted">Timestamp:</span> <span className="text-subtle">{new Date(data.timestamp).toLocaleString()}</span></p>
          </div>
        ) : (
          <div className="bg-base p-3 rounded-md">
            <p className="text-muted italic">{!error && 'No data extracted yet.'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OcrFeed;