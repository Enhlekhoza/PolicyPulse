import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PolicyScenario {
  id: string;
  name: string;
  policyType: string;
  amount: number;
  results: {
    giniChange: number;
    povertyReduction: string;
    cost: string;
    incomeBrackets: Array<{
      bracket: string;
      change: string;
      amount: number;
    }>;
  };
}

export default function PolicyComparison() {
  const [scenarios, setScenarios] = useState<PolicyScenario[]>([
    {
      id: '1',
      name: 'Current Policy',
      policyType: 'current',
      amount: 0,
      results: {
        giniChange: 0,
        povertyReduction: '0%',
        cost: '$0',
        incomeBrackets: [
          { bracket: 'Bottom 20%', change: '$0', amount: 0 },
          { bracket: 'Lower Middle 20%', change: '$0', amount: 0 },
          { bracket: 'Middle 20%', change: '$0', amount: 0 },
          { bracket: 'Upper Middle 20%', change: '$0', amount: 0 },
          { bracket: 'Top 20%', change: '$0', amount: 0 },
        ]
      }
    },
    {
      id: '2',
      name: 'Proposed Policy',
      policyType: 'UBI',
      amount: 1000,
      results: {
        giniChange: -0.05,
        povertyReduction: '15%',
        cost: `$${(1000 * 260_000_000 / 1_000_000_000).toFixed(1)}B/year`,
        incomeBrackets: [
          { bracket: 'Bottom 20%', change: `+$${1000 * 12}`, amount: 1000 * 12 },
          { bracket: 'Lower Middle 20%', change: `+$${Math.round(1000 * 9)}`, amount: 1000 * 9 },
          { bracket: 'Middle 20%', change: `+$${Math.round(1000 * 6)}`, amount: 1000 * 6 },
          { bracket: 'Upper Middle 20%', change: `+$${Math.round(1000 * 3)}`, amount: 1000 * 3 },
          { bracket: 'Top 20%', change: `-$${Math.round(1000 * 2.5)}`, amount: -1000 * 2.5 },
        ]
      }
    }
  ]);

  const updateScenario = (id: string, updates: Partial<PolicyScenario>) => {
    setScenarios(scenarios.map(s => 
      s.id === id ? { ...s, ...updates } : s
    ));
  };

  const addScenario = () => {
    const newId = (scenarios.length + 1).toString();
    setScenarios([
      ...scenarios,
      {
        id: newId,
        name: `Policy ${newId}`,
        policyType: 'UBI',
        amount: 1000,
        results: {
          giniChange: -0.02,
          povertyReduction: '10%',
          cost: `$${(1000 * 260_000_000 / 1_000_000_000).toFixed(1)}B/year`,
          incomeBrackets: [
            { bracket: 'Bottom 20%', change: `+$${1000 * 12}`, amount: 1000 * 12 },
            { bracket: 'Lower Middle 20%', change: `+$${Math.round(1000 * 9)}`, amount: 1000 * 9 },
            { bracket: 'Middle 20%', change: `+$${Math.round(1000 * 6)}`, amount: 1000 * 6 },
            { bracket: 'Upper Middle 20%', change: `+$${Math.round(1000 * 3)}`, amount: 1000 * 3 },
            { bracket: 'Top 20%', change: `-$${Math.round(1000 * 2.5)}`, amount: -1000 * 2.5 },
          ]
        }
      }
    ]);
  };

  const removeScenario = (id: string) => {
    if (scenarios.length > 2) {
      setScenarios(scenarios.filter(s => s.id !== id));
    }
  };

  // Prepare data for the comparison chart
  const comparisonData = scenarios.flatMap(scenario => 
    scenario.results.incomeBrackets.map(bracket => ({
      name: `${scenario.name} - ${bracket.bracket}`,
      scenario: scenario.name,
      bracket: bracket.bracket,
      amount: bracket.amount,
      change: bracket.change,
      giniChange: scenario.results.giniChange
    }))
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Policy Comparison</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {scenarios.map((scenario) => (
          <div key={scenario.id} className="border rounded-lg p-4 relative">
            <button 
              onClick={() => removeScenario(scenario.id)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              disabled={scenarios.length <= 2}
            >
              ×
            </button>
            
            <h3 className="text-xl font-semibold mb-4">
              <input
                type="text"
                value={scenario.name}
                onChange={(e) => updateScenario(scenario.id, { name: e.target.value })}
                className="w-full font-semibold text-lg border-b border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Policy Type</label>
                <select 
                  value={scenario.policyType}
                  onChange={(e) => updateScenario(scenario.id, { policyType: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="current">Current Policy</option>
                  <option value="UBI">Universal Basic Income</option>
                  <option value="NIT">Negative Income Tax</option>
                  <option value="FT">Flat Tax</option>
                </select>
              </div>

              {scenario.policyType !== 'current' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Amount: ${scenario.amount}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="100"
                    value={scenario.amount}
                    onChange={(e) => updateScenario(scenario.id, { amount: Number(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              )}

              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Gini Change:</span>
                  <span className={`font-medium ${scenario.results.giniChange < 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {scenario.results.giniChange > 0 ? '+' : ''}{scenario.results.giniChange.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Poverty Reduction:</span>
                  <span className="font-medium text-green-600">{scenario.results.povertyReduction}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Annual Cost:</span>
                  <span className="font-medium">{scenario.results.cost}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {scenarios.length < 4 && (
          <button
            onClick={addScenario}
            className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-6 hover:border-blue-500 transition-colors"
          >
            <span className="text-2xl">+</span>
            <span className="text-sm text-gray-600 mt-1">Add Policy</span>
          </button>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Income Impact Comparison</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={comparisonData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={200}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Annual Change']} 
                labelFormatter={(label) => {
                  const [scenario, bracket] = label.split(' - ');
                  return [scenario, `Income Bracket: ${bracket}`];
                }}
              />
              <Legend />
              <Bar dataKey="amount" name="Annual Change ($)" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Summary</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-700">
            This comparison shows how different policy scenarios affect various income brackets. 
            The chart displays the annual change in income for each bracket under each policy scenario.
          </p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {scenarios.map((scenario) => (
              <div key={scenario.id} className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold text-lg mb-2">{scenario.name}</h3>
                <ul className="space-y-1">
                  <li>Gini Change: 
                    <span className={scenario.results.giniChange < 0 ? 'text-green-600' : 'text-red-600'}>
                      {scenario.results.giniChange > 0 ? '+' : ''}{scenario.results.giniChange.toFixed(2)}
                    </span>
                  </li>
                  <li>Poverty Reduction: {scenario.results.povertyReduction}</li>
                  <li>Annual Cost: {scenario.results.cost}</li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
