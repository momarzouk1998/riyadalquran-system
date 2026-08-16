'use client';

import React from 'react';

interface CircularProgressProps {
  percent: number;   // 0–100
  size?: number;     // px, default 96
  strokeWidth?: number;
  label?: string;    // center label (defaults to percent%)
  variant?: 'green' | 'gold' | 'complete';
}

export function CircularProgress({
  percent,
  size = 96,
  strokeWidth = 8,
  label,
  variant = 'green',
}: CircularProgressProps) {
  const clampedPct = Math.min(100, Math.max(0, percent));
  const radius     = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset     = circumference - (clampedPct / 100) * circumference;

  const strokeColor =
    variant === 'gold'     ? '#d4a843' :
    variant === 'complete' ? '#22c55e' :
    '#0e6b47';

  return (
    <div
      className="relative shrink-0 inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={clampedPct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg width={size} height={size} style={{ position: 'absolute', top: 0, left: 0 }}>
        {/* track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          stroke="#e8ede9"
        />
        {/* fill */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)',
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
          }}
        />
      </svg>
      {/* center label */}
      <span
        className="font-black leading-none relative z-10"
        style={{
          fontSize: size < 72 ? '0.65rem' : size < 90 ? '0.8rem' : '0.95rem',
          color: strokeColor,
        }}
      >
        {label ?? `${clampedPct}%`}
      </span>
    </div>
  );
}
