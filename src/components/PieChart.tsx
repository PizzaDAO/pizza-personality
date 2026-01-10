import React from 'react';
import { pizzaColors } from '../data/quizData';

interface PieChartProps {
  percentages: {
    entrepreneur: number;
    manager: number;
    technician: number;
  };
}

type ScoreType = 'entrepreneur' | 'manager' | 'technician';

const PieChart: React.FC<PieChartProps> = ({ percentages }) => {
  const size = 200;
  const center = size / 2;
  const radius = 80;

  // Map score types to pizza colors
  const colors: Record<ScoreType, string> = {
    entrepreneur: pizzaColors.hawaiian,
    manager: pizzaColors.cheese,
    technician: pizzaColors.margherita
  };

  // Convert percentages to angles (starting from top, going clockwise)
  const entrepreneurAngle = (percentages.entrepreneur / 100) * 360;
  const managerAngle = (percentages.manager / 100) * 360;

  // Calculate cumulative angles for positioning
  const entrepreneurEnd = entrepreneurAngle;
  const managerEnd = entrepreneurEnd + managerAngle;

  // Helper functions for arc calculation
  const polarToCartesian = (
    centerX: number,
    centerY: number,
    r: number,
    angleInDegrees: number
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
    return {
      x: centerX + r * Math.cos(angleInRadians),
      y: centerY + r * Math.sin(angleInRadians)
    };
  };

  const describeArc = (
    x: number,
    y: number,
    r: number,
    startAngle: number,
    endAngle: number
  ) => {
    // Handle full circle case
    if (endAngle - startAngle >= 360) {
      return `M ${x} ${y - r} A ${r} ${r} 0 1 1 ${x - 0.001} ${y - r} Z`;
    }

    const start = polarToCartesian(x, y, r, endAngle);
    const end = polarToCartesian(x, y, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return [
      'M', x, y,
      'L', start.x, start.y,
      'A', r, r, 0, largeArcFlag, 0, end.x, end.y,
      'Z'
    ].join(' ');
  };

  const segments: { type: ScoreType; startAngle: number; endAngle: number; percentage: number }[] = [
    { type: 'entrepreneur', startAngle: 0, endAngle: entrepreneurEnd, percentage: percentages.entrepreneur },
    { type: 'manager', startAngle: entrepreneurEnd, endAngle: managerEnd, percentage: percentages.manager },
    { type: 'technician', startAngle: managerEnd, endAngle: 360, percentage: percentages.technician }
  ];

  const labels: { type: ScoreType; label: string }[] = [
    { type: 'entrepreneur', label: 'Dreamer' },
    { type: 'manager', label: 'Manager' },
    { type: 'technician', label: 'Pizzaiolo' }
  ];

  return (
    <div className="flex flex-col items-center">
      {/* SVG Pie Chart */}
      <svg width={size} height={size} className="drop-shadow-lg">
        {/* Pizza crust border */}
        <circle
          cx={center}
          cy={center}
          r={radius + 8}
          fill="#D2691E"
          opacity={0.3}
        />
        <circle
          cx={center}
          cy={center}
          r={radius + 4}
          fill="#DEB887"
          opacity={0.5}
        />

        {/* Pie segments */}
        {segments.map((segment) => {
          if (segment.percentage === 0) return null;
          return (
            <path
              key={segment.type}
              d={describeArc(center, center, radius, segment.startAngle, segment.endAngle)}
              fill={colors[segment.type]}
              stroke="white"
              strokeWidth={2}
              className="transition-all duration-500"
            />
          );
        })}

        {/* Center circle (like a pizza with a hole or for cleaner look) */}
        <circle
          cx={center}
          cy={center}
          r={25}
          fill="white"
          stroke="#f0f0f0"
          strokeWidth={1}
        />
      </svg>

      {/* Legend */}
      <div className="mt-6 space-y-2 w-full max-w-xs">
        {labels.map(({ type, label }) => (
          <div key={type} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: colors[type] }}
              />
              <span className="text-gray-700 font-medium">{label}</span>
            </div>
            <span className="font-bold" style={{ color: colors[type] }}>
              {percentages[type]}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChart;
