import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ScenarioResult {
  name: string;
  finalAmount: number;
  monthlyIncome: number;
  yearsOfIncome: number;
  data: Array<{ year: number; amount: number; realValue: number }>;
  color: string;
}

interface SimulationChartProps {
  scenarios: ScenarioResult[];
}

export function SimulationChart({ scenarios }: SimulationChartProps) {
  // Combine all scenario data into a single dataset
  const combinedData = scenarios[0]?.data.map((basePoint) => {
    const dataPoint: any = { year: basePoint.year };
    
    scenarios.forEach((scenario) => {
      const matchingPoint = scenario.data.find(p => p.year === basePoint.year);
      if (matchingPoint) {
        dataPoint[scenario.name] = matchingPoint.amount;
        dataPoint[`${scenario.name}_real`] = matchingPoint.realValue;
      }
    });
    
    return dataPoint;
  }) || [];

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-semibold mb-2">Age {label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.dataKey}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={combinedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="year" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `${value}`}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={formatCurrency}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {scenarios.map((scenario) => (
            <Line
              key={scenario.name}
              type="monotone"
              dataKey={scenario.name}
              stroke={scenario.color}
              strokeWidth={scenario.name === 'Base Case' ? 3 : 2}
              dot={false}
              activeDot={{ r: 4, stroke: scenario.color, strokeWidth: 2 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
        {scenarios.map((scenario) => (
          <div key={scenario.name} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: scenario.color }}
            />
            <span className={scenario.name === 'Base Case' ? 'font-semibold' : ''}>
              {scenario.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}