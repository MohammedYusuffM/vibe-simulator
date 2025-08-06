import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus, DollarSign, Calendar, Target } from 'lucide-react';

interface ScenarioResult {
  name: string;
  finalAmount: number;
  monthlyIncome: number;
  yearsOfIncome: number;
  data: Array<{ year: number; amount: number; realValue: number }>;
  color: string;
}

interface ScenarioComparisonProps {
  scenarios: ScenarioResult[];
}

export function ScenarioComparison({ scenarios }: ScenarioComparisonProps) {
  const baseScenario = scenarios.find(s => s.name === 'Base Case');
  if (!baseScenario) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatYears = (years: number) => {
    return `${years.toFixed(1)} years`;
  };

  const calculateDifference = (value: number, baseValue: number) => {
    return ((value - baseValue) / baseValue) * 100;
  };

  const getDifferenceIcon = (percentage: number) => {
    if (percentage > 5) return <TrendingUp className="h-4 w-4 text-success" />;
    if (percentage < -5) return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getDifferenceColor = (percentage: number) => {
    if (percentage > 5) return 'text-success';
    if (percentage < -5) return 'text-destructive';
    return 'text-muted-foreground';
  };

  const getScenarioInsight = (scenario: ScenarioResult) => {
    switch (scenario.name) {
      case 'Inflation Spike (5%)':
        return 'Higher inflation reduces purchasing power of retirement savings';
      case 'Early Retirement (60)':
        return 'Retiring 5 years early significantly reduces accumulation time';
      case 'Market Downturn (4% return)':
        return 'Lower returns require higher savings or later retirement';
      case 'Optimistic (10% return)':
        return 'Higher returns can significantly boost retirement readiness';
      default:
        return 'Your baseline retirement projection';
    }
  };

  const maxSavings = Math.max(...scenarios.map(s => s.finalAmount));

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {scenarios.map((scenario) => {
          const savingsDiff = calculateDifference(scenario.finalAmount, baseScenario.finalAmount);
          const incomeDiff = calculateDifference(scenario.monthlyIncome, baseScenario.monthlyIncome);
          const isBaseCase = scenario.name === 'Base Case';
          
          return (
            <Card 
              key={scenario.name} 
              className={`relative overflow-hidden transition-all hover:shadow-md ${
                isBaseCase ? 'ring-2 ring-primary/20 bg-primary/5' : ''
              }`}
            >
              <div 
                className="absolute top-0 left-0 w-1 h-full" 
                style={{ backgroundColor: scenario.color }}
              />
              
              <CardContent className="p-4 pl-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        {scenario.name}
                        {isBaseCase && <Badge variant="secondary">Current Plan</Badge>}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {getScenarioInsight(scenario)}
                      </p>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Total Savings */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        Total Savings
                      </div>
                      <div className="space-y-1">
                        <p className="text-xl font-bold">{formatCurrency(scenario.finalAmount)}</p>
                        {!isBaseCase && (
                          <div className={`flex items-center gap-1 text-sm ${getDifferenceColor(savingsDiff)}`}>
                            {getDifferenceIcon(savingsDiff)}
                            <span>{savingsDiff > 0 ? '+' : ''}{savingsDiff.toFixed(1)}%</span>
                          </div>
                        )}
                      </div>
                      <Progress 
                        value={(scenario.finalAmount / maxSavings) * 100} 
                        className="h-2"
                        style={{ 
                          background: `linear-gradient(to right, ${scenario.color}20, ${scenario.color}20)` 
                        }}
                      />
                    </div>

                    {/* Monthly Income */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Target className="h-4 w-4" />
                        Monthly Income
                      </div>
                      <div className="space-y-1">
                        <p className="text-xl font-bold">{formatCurrency(scenario.monthlyIncome)}</p>
                        {!isBaseCase && (
                          <div className={`flex items-center gap-1 text-sm ${getDifferenceColor(incomeDiff)}`}>
                            {getDifferenceIcon(incomeDiff)}
                            <span>{incomeDiff > 0 ? '+' : ''}{incomeDiff.toFixed(1)}%</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Years of Income */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Income Duration
                      </div>
                      <div className="space-y-1">
                        <p className="text-xl font-bold">{formatYears(scenario.yearsOfIncome)}</p>
                        <div className="text-xs text-muted-foreground">
                          Based on expenses
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Key Insights */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-3">Key Insights</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h5 className="font-medium">Risks to Consider:</h5>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Inflation can erode purchasing power over time</li>
                <li>• Market downturns reduce growth potential</li>
                <li>• Early retirement reduces accumulation period</li>
                <li>• Healthcare costs may increase in retirement</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h5 className="font-medium">Optimization Strategies:</h5>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Increase contributions during high-income years</li>
                <li>• Diversify investments to manage risk</li>
                <li>• Consider tax-advantaged retirement accounts</li>
                <li>• Plan for healthcare and long-term care costs</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}