'use client';
import React from "react";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  compact?: boolean;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ 
  value, 
  onChange,
  min = 1,
  max = 100,
  compact = false
}) => {
  const decrease = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const increase = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleInputChange = (newValue: string) => {
    const parsedValue = parseInt(newValue);
    
    if (!isNaN(parsedValue)) {
      // Clamp the value between min and max
      const clampedValue = Math.min(Math.max(parsedValue, min), max);
      onChange(clampedValue);
    }
  };

  return (
    <div className={`
      inline-flex items-center rounded-md border border-gray-200 bg-white shadow-sm
      ${compact ? 'h-8' : 'h-12'} 
      transition-all duration-200 focus-within:ring-1 focus-within:ring-primary/30 hover:border-primary/30
    `}>
      <button
        type="button"
        onClick={decrease}
        disabled={value <= min}
        className={`
          flex items-center justify-center border-r px-3 text-gray-600
          transition-colors hover:bg-gray-50 hover:text-primary active:bg-gray-100 
          disabled:cursor-not-allowed disabled:opacity-50
          ${compact ? 'h-full w-8' : 'h-full w-12'}
        `}
        aria-label="Decrease quantity"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
      
      <input
        type="number"
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        className={`
          w-14 border-none bg-transparent text-center font-medium focus:outline-none focus:ring-0
          ${compact ? 'h-full text-sm' : 'h-full text-base'}
        `}
        min={min}
        max={max}
        aria-label="Quantity input"
      />
      
      <button
        type="button"
        onClick={increase}
        disabled={value >= max}
        className={`
          flex items-center justify-center border-l px-3 text-gray-600
          transition-colors hover:bg-gray-50 hover:text-primary active:bg-gray-100
          disabled:cursor-not-allowed disabled:opacity-50
          ${compact ? 'h-full w-8' : 'h-full w-12'}
        `}
        aria-label="Increase quantity"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
    </div>
  );
};

export default QuantitySelector;
