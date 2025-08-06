import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calculator, TrendingUp, AlertTriangle, Target } from 'lucide-react';
import { SimulationChart } from './SimulationChart';
import { ScenarioComparison } from './ScenarioComparison';

interface SimulationInputs {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlyContribution: number;
  expectedReturn: number;
  inflationRate: number;
  retirementExpenses: number;
}

interface ScenarioResult {
  name: string;
  finalAmount: number;
  monthlyIncome: number;
  yearsOfIncome: number;
  data: Array<{ year: number; amount: number; realValue: number }>;
  color: string;
}

export function RetirementSimulator() {
  const [inputs, setInputs] = useState<SimulationInputs>({
    currentAge: 30,
    retirementAge: 65,
    currentSavings: 50000,
    monthlyContribution: 2000,
    expectedReturn: 7,
    inflationRate: 3,
    retirementExpenses: 5000
  });

  const [scenarios, setScenarios] = useState<ScenarioResult[]>([]);

  const calculateScenario = (
    inputs: SimulationInputs,
    name: string,
    color: string,
    modifications: Partial<SimulationInputs> = {}
  ): ScenarioResult => {
    const modifiedInputs = { ...inputs, ...modifications };
    const {
      currentAge,
      retirementAge,
      currentSavings,
      monthlyContribution,
      expectedReturn,
      inflationRate,
      retirementExpenses
    } = modifiedInputs;

    const yearsToRetirement = retirementAge - currentAge;
    const data: Array<{ year: number; amount: number; realValue: number }> = [];
    
    let amount = currentSavings;
    const monthlyReturn = expectedReturn / 100 / 12;
    
    // Calculate savings growth
    for (let year = 0; year <= yearsToRetirement; year++) {
      const currentYear = currentAge + year;
      
      // Add monthly contributions for the year
      for (let month = 0; month < 12 && year < yearsToRetirement; month++) {
        amount = amount * (1 + monthlyReturn) + monthlyContribution;
      }
      
      const realValue = amount / Math.pow(1 + inflationRate / 100, year);
      data.push({ year: currentYear, amount, realValue });
    }

    const finalAmount = amount;
    
    // Calculate sustainable monthly income (4% rule adjusted for inflation)
    const withdrawalRate = 0.04;
    const monthlyIncome = (finalAmount * withdrawalRate) / 12;
    const realMonthlyIncome = monthlyIncome / Math.pow(1 + inflationRate / 100, yearsToRetirement);
    
    // Estimate years of income
    const yearsOfIncome = finalAmount / (retirementExpenses * 12);

    return {
      name,
      finalAmount,
      monthlyIncome: realMonthlyIncome,
      yearsOfIncome,
      data,
      color
    };
  };

  useEffect(() => {
    const baseScenario = calculateScenario(inputs, 'Base Case', '#0891b2');
    
    const inflationSpike = calculateScenario(
      inputs,
      'Inflation Spike (5%)',
      '#dc2626',
      { inflationRate: 5 }
    );
    
    const earlyRetirement = calculateScenario(
      inputs,
      'Early Retirement (60)',
      '#7c3aed',
      { retirementAge: 60 }
    );
    
    const marketDownturn = calculateScenario(
      inputs,
      'Market Downturn (4% return)',
      '#ea580c',
      { expectedReturn: 4 }
    );

    const optimistic = calculateScenario(
      inputs,
      'Optimistic (10% return)',
      '#059669',
      { expectedReturn: 10 }
    );

    setScenarios([baseScenario, inflationSpike, earlyRetirement, marketDownturn, optimistic]);
  }, [inputs]);

  const handleInputChange = (field: keyof SimulationInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const baseScenario = scenarios[0];

  return (
    <div className="min-h-screen bg-gradient-bg p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex items-center justify-center gap-3">
            <Calculator className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Retirement Scenario Simulator
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Analyze different retirement scenarios and see how various factors impact your financial future
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <Card className="lg:col-span-1 shadow-elegant animate-scale-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Retirement Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Age Inputs */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentAge">Current Age</Label>
                  <Input
                    id="currentAge"
                    type="number"
                    value={inputs.currentAge}
                    onChange={(e) => handleInputChange('currentAge', Number(e.target.value))}
                    min="18"
                    max="80"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="retirementAge">Retirement Age</Label>
                  <Input
                    id="retirementAge"
                    type="number"
                    value={inputs.retirementAge}
                    onChange={(e) => handleInputChange('retirementAge', Number(e.target.value))}
                    min="50"
                    max="80"
                  />
                </div>
              </div>

              <Separator />

              {/* Financial Inputs */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentSavings">Current Savings</Label>
                  <Input
                    id="currentSavings"
                    type="number"
                    value={inputs.currentSavings}
                    onChange={(e) => handleInputChange('currentSavings', Number(e.target.value))}
                    min="0"
                    step="1000"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="monthlyContribution">Monthly Contribution</Label>
                  <Input
                    id="monthlyContribution"
                    type="number"
                    value={inputs.monthlyContribution}
                    onChange={(e) => handleInputChange('monthlyContribution', Number(e.target.value))}
                    min="0"
                    step="100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retirementExpenses">Monthly Retirement Expenses</Label>
                  <Input
                    id="retirementExpenses"
                    type="number"
                    value={inputs.retirementExpenses}
                    onChange={(e) => handleInputChange('retirementExpenses', Number(e.target.value))}
                    min="0"
                    step="100"
                  />
                </div>
              </div>

              <Separator />

              {/* Rate Sliders */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Expected Annual Return</Label>
                    <Badge variant="secondary">{inputs.expectedReturn}%</Badge>
                  </div>
                  <Slider
                    value={[inputs.expectedReturn]}
                    onValueChange={(value) => handleInputChange('expectedReturn', value[0])}
                    max={15}
                    min={1}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Expected Inflation Rate</Label>
                    <Badge variant="secondary">{inputs.inflationRate}%</Badge>
                  </div>
                  <Slider
                    value={[inputs.inflationRate]}
                    onValueChange={(value) => handleInputChange('inflationRate', value[0])}
                    max={8}
                    min={1}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Quick Stats */}
              {baseScenario && (
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <h4 className="font-semibold text-sm">Base Case Results</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Years to Retirement:</span>
                      <span className="font-medium">{inputs.retirementAge - inputs.currentAge}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Savings:</span>
                      <span className="font-medium text-primary">{formatCurrency(baseScenario.finalAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Income:</span>
                      <span className="font-medium text-success">{formatCurrency(baseScenario.monthlyIncome)}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Charts and Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Simulation Chart */}
            <Card className="shadow-elegant animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Savings Growth Projection
                </CardTitle>
              </CardHeader>
              <CardContent>
                {scenarios.length > 0 && <SimulationChart scenarios={scenarios} />}
              </CardContent>
            </Card>

            {/* Scenario Comparison */}
            <Card className="shadow-elegant animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  What-If Scenario Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                {scenarios.length > 0 && <ScenarioComparison scenarios={scenarios} />}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}