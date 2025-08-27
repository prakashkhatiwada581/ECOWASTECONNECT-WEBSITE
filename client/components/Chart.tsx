import { ReactNode } from 'react';

interface BarChartProps {
  data: Array<{ label: string; value: number; color?: string }>;
  title: string;
  maxValue?: number;
}

interface LineChartProps {
  data: Array<{ label: string; value: number }>;
  title: string;
  color?: string;
}

export function BarChart({ data, title, maxValue }: BarChartProps) {
  const max = maxValue || Math.max(...data.map(d => d.value));
  
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-20 text-sm text-gray-600 text-right font-medium">
              {item.label}
            </div>
            <div className="flex-1 relative">
              <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                <div
                  className={`h-full rounded-lg transition-all duration-1000 ease-out ${
                    item.color || 'bg-gradient-to-r from-blue-500 to-green-500'
                  }`}
                  style={{
                    width: `${(item.value / max) * 100}%`,
                    animationDelay: `${index * 100}ms`
                  }}
                ></div>
              </div>
              <div className="absolute right-2 top-1 text-xs font-medium text-gray-700">
                {item.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LineChart({ data, title, color = 'from-blue-500 to-green-500' }: LineChartProps) {
  const max = Math.max(...data.map(d => d.value));
  const min = Math.min(...data.map(d => d.value));
  const range = max - min;
  
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((item.value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>
      <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-2">
          <span>{max}</span>
          <span>{Math.round((max + min) / 2)}</span>
          <span>{min}</span>
        </div>
        
        {/* Chart area */}
        <div className="ml-8 h-full relative">
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
            {/* Grid lines */}
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
            
            {/* Line */}
            <polyline
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              points={points}
              className="drop-shadow-sm"
            />
            
            {/* Data points */}
            {data.map((item, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = 100 - ((item.value - min) / range) * 100;
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="1.5"
                  fill="white"
                  stroke="url(#lineGradient)"
                  strokeWidth="2"
                  className="drop-shadow-sm"
                />
              );
            })}
            
            {/* Gradient definition */}
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* X-axis labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 mt-2">
            {data.map((item, index) => (
              <span key={index} className="transform -translate-x-1/2">
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface DonutChartProps {
  data: Array<{ label: string; value: number; color: string }>;
  title: string;
  centerText?: string;
}

export function DonutChart({ data, title, centerText }: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;

  const createArcPath = (percentage: number, cumulativePercentage: number) => {
    const startAngle = cumulativePercentage * 3.6; // Convert to degrees
    const endAngle = (cumulativePercentage + percentage) * 3.6;
    
    const startAngleRad = (startAngle - 90) * (Math.PI / 180);
    const endAngleRad = (endAngle - 90) * (Math.PI / 180);
    
    const outerRadius = 45;
    const innerRadius = 30;
    
    const x1 = 50 + outerRadius * Math.cos(startAngleRad);
    const y1 = 50 + outerRadius * Math.sin(startAngleRad);
    const x2 = 50 + outerRadius * Math.cos(endAngleRad);
    const y2 = 50 + outerRadius * Math.sin(endAngleRad);
    
    const x3 = 50 + innerRadius * Math.cos(endAngleRad);
    const y3 = 50 + innerRadius * Math.sin(endAngleRad);
    const x4 = 50 + innerRadius * Math.cos(startAngleRad);
    const y4 = 50 + innerRadius * Math.sin(startAngleRad);
    
    const largeArcFlag = percentage > 50 ? 1 : 0;
    
    return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`;
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>
      <div className="flex items-center justify-center space-x-8">
        <div className="relative">
          <svg width="200" height="200" viewBox="0 0 100 100" className="transform -rotate-90">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const path = createArcPath(percentage, cumulativePercentage);
              cumulativePercentage += percentage;
              
              return (
                <path
                  key={index}
                  d={path}
                  fill={item.color}
                  className="hover:opacity-80 transition-opacity duration-200"
                />
              );
            })}
          </svg>
          {centerText && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{centerText}</div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm text-gray-700">{item.label}</span>
              <span className="text-sm font-medium text-gray-900">
                {item.value} ({((item.value / total) * 100).toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
