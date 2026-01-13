import React from 'react';

export const Spoon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V22h8v-7.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7z" />
  </svg>
);

export const Fork = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M11 20V9h2v11h-2zm-4 0V9h2v11H7zm8 0V9h2v11h-2zM6 2v6h12V2c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2z" />
  </svg>
);

export const Ladle = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2c-1.1 0-2 .9-2 2v10.55c-2.64.44-4.8 2.5-5.65 5.15C3.76 21.6 5.3 24 7.5 24c3.04 0 5.5-2.46 5.5-5.5V4h2V2h-3z" />
  </svg>
);

export const Pan = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M4 8h13c1.1 0 2 .9 2 2v2c0 4.42-3.58 8-8 8s-8-3.58-8-8V10c0-1.1.9-2 2-2zm15 3h3v2h-3v-2z" />
  </svg>
);
