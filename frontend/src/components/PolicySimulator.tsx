import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface IncomeBracket {
  bracket: string;
  change: string;
  amount: number;
}

interface SimulationResult {
  policyType: string;
  impact: {
    giniChange: number;
    povertyReduction: string;
    cost: string;
    incomeBrackets: IncomeBracket[];
  };
}

export default function PolicySimulator() {
  const [policyType, setPolicyType] = useState('UBI');
  const [amount, setAmount] = useState(1000);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSimulate = async () => {
    setLoading(true);
    try {
      // In a real app, this would call your backend API
      // const response = await fetch('http://localhost:5000/api/simulate', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ policyType, amount })
      // });
      // const data = await response.json();
      
      // Mock response for now
      setTimeout(() => {
        setResult({
          policyType,
          impact: {
            giniChange: -0.05,
            povertyReduction: '15%',
            cost: `$${(amount * 260_000_000 / 1_000_000_000).toFixed(1)}B/year`,
            incomeBrackets: [
              { bracket: 'Bottom 20%', change: `+$${amount * 12}`, amount: amount * 12 },
              { bracket: 'Lower Middle 20%', change: `+$${Math.round(amount * 9)}`, amount: amount * 9 },
              { bracket: 'Middle 20%', change: `+$${Math.round(amount * 6)}`, amount: amount * 6 },
              { bracket: 'Upper Middle 20%', change: `+$${Math.round(amount * 3)}`, amount: amount * 3 },
              { bracket: 'Top 20%', change: `-$${Math.round(amount * 2.5)}`, amount: -amount * 2.5 },
            ]
          }
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error simulating policy:', error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">PolicyPulse Simulator</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Policy Type</label>
            <select 
              value={policyType} 
              onChange={(e) => setPolicyType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="UBI">Universal Basic Income (UBI)</option>
              <option value="NIT">Negative Income Tax (NIT)</option>
              <option value="FT">Flat Tax</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Amount: ${amount}
            </label>
            <input
              type="range"
              min="100"
              max="2000"
              step="100"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>$100</span>
              <span>$1000</span>
              <span>$2000</span>
            </div>
          </div>
          
          <button
            onClick={handleSimulate}
            disabled={loading}
            className={`w-full py-3 px-4 rounded-md text-white font-medium ${
              loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            } transition-colors`}
          >
            {loading ? 'Simulating...' : 'Simulate Policy Impact'}
          </button>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Policy Impact</h2>
          {result ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded shadow">
                  <div className="text-sm text-gray-500">Gini Change</div>
                  <div className={`text-lg font-semibold ${result.impact.giniChange < 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {result.impact.giniChange > 0 ? '+' : ''}{result.impact.giniChange.toFixed(2)}
                  </div>
                </div>
                <div className="bg-white p-3 rounded shadow">
                  <div className="text-sm text-gray-500">Poverty Reduction</div>
                  <div className="text-lg font-semibold text-green-600">{result.impact.povertyReduction}</div>
                </div>
                <div className="bg-white p-3 rounded shadow col-span-2">
                  <div className="text-sm text-gray-500">Estimated Annual Cost</div>
                  <div className="text-lg font-semibold">{result.impact.cost}</div>
                </div>
              </div>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={result.impact.incomeBrackets}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="bracket" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Annual Change']} />
                    <Legend />
                    <Bar dataKey="amount" fill="#4f46e5" name="Annual Change ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              {loading ? (
                <div className="animate-pulse">Running simulation...</div>
              ) : (
                'Run a simulation to see the impact'
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
