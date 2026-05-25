import React, { useState, useRef } from 'react';

const InfoIcon = () => (
  <svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
    <circle cx='12' cy='12' r='10' />
    <line x1='12' y1='16' x2='12' y2='12' />
    <line x1='12' y1='8' x2='12.01' y2='8' />
  </svg>
);

const InfoTooltip: React.FC<{ text: string }> = ({ text }) => {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(true);
  };

  const hide = () => {
    timeoutRef.current = setTimeout(() => setVisible(false), 100);
  };

  return (
    <span className='relative inline-flex items-center' onMouseEnter={show} onMouseLeave={hide}>
      <span className='opacity-50 hover:opacity-90 transition-opacity cursor-default'>
        <InfoIcon />
      </span>
      {visible && (
        <span className='absolute bottom-full right-0 mb-2 w-52 bg-[#2a2530] border border-white/[0.12] text-dymAntiPop/80 text-xs rounded-lg px-3 py-2.5 shadow-xl leading-relaxed z-50 pointer-events-none'>
          {text}
          <span className='absolute top-full right-3 border-4 border-transparent border-t-[#2a2530]' />
        </span>
      )}
    </span>
  );
};

export default InfoTooltip;
