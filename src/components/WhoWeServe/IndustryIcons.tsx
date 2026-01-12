import React from 'react';

export const Building = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
  </svg>
);

export const Factory = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M22 22H2V10l7-3v2l5-2v3l3-1v3l5-2v12zm-12-8h-2v2h2v-2zm0 4h-2v2h2v-2zm4-4h-2v2h2v-2zm0 4h-2v2h2v-2z" />
  </svg>
);

export const Ship = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v-2c0-3.87 3.13-7 7-7h6c3.87 0 7 3.13 7 7v2h-2zM12 4c2.21 0 4 1.79 4 4 0 1.25-.59 2.36-1.5 3.09.55.94 1.5 1.91 1.5 1.91H8s.95-.97 1.5-1.91C8.59 10.36 8 9.25 8 8c0-2.21 1.79-4 4-4z" />
  </svg>
);

export const Institution = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M4 10v7h3v-7H4zm6 0v7h3v-7h-3zm6 0v7h3v-7h-3zM2 22h19v-3H2v3zm19-12h-2V7h-3v3h-4V7H9v3H5V7H2v3h20V7h-1z" />
    <path d="M12 2L2 7h20L12 2z" />
  </svg>
);
