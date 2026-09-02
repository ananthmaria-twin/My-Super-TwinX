import { useEffect, useRef, useState } from 'react';
import { animate } from 'framer-motion';

interface CountUpProps {
  value: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function CountUp({ value, decimals = 0, suffix = '', prefix = '', className }: CountUpProps) {
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    started.current = true;
    const controls = animate(0, value, {
      duration: 1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [value]);

  return (
    <span className={className}>
      {prefix}
      {display.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}
