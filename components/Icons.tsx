import React from 'react';

// FIX: Add `as const` to ensure SVG properties are inferred as specific string literals 
// (e.g., 'round') instead of the general `string` type, resolving conflicts with React's SVG prop types.
const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export const GithubIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg {...iconProps} className={className}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

export const AlertTriangleIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg {...iconProps} className={className}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

export const InfoIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg {...iconProps} className={className}>
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
);

export const ZapIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg {...iconProps} className={className} >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
    </svg>
);

export const ArrowUpIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg {...iconProps} className={className} >
        <line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline>
    </svg>
);

export const ArrowDownIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg {...iconProps} className={className} >
        <line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline>
    </svg>
);