export interface Policy {
  id: string;
  name: string;
  description: string;
  parameters: {
    [key: string]: {
      type: 'number' | 'string' | 'boolean';
      defaultValue: any;
      label: string;
      min?: number;
      max?: number;
      step?: number;
    };
  };
  simulate: (parameters: any) => any;
}

export const policies: { [key: string]: Policy } = {
  ubi: {
    id: 'ubi',
    name: 'Universal Basic Income',
    description: 'Provide a basic income to all citizens.',
    parameters: {
      amount: {
        type: 'number',
        defaultValue: 1000,
        label: 'Monthly Amount (USD)',
        min: 500,
        max: 2000,
        step: 100,
      },
      recipients: {
        type: 'number',
        defaultValue: 1000000,
        label: 'Number of Recipients',
        min: 100000,
        max: 10000000,
        step: 100000,
      },
      inflationImpact: {
        type: 'number',
        defaultValue: 0.02,
        label: 'Inflation Impact (%)',
        min: 0,
        max: 0.1,
        step: 0.01,
      },
      laborParticipationChange: {
        type: 'number',
        defaultValue: -0.01,
        label: 'Labor Participation Change (%)',
        min: -0.05,
        max: 0.05,
        step: 0.001,
      },
    },
    simulate: (parameters: any) => {
      const { amount, recipients, inflationImpact, laborParticipationChange } = parameters;
      const baseGdp = 100; // Placeholder for base GDP
      const baseEmploymentRate = 60; // Placeholder for base employment rate
      const basePovertyRate = 10; // Placeholder for base poverty rate

      const gdpImpact = (amount * recipients * 0.8) / baseGdp - (inflationImpact * 100); // Simplified calculation
      const employmentRate = baseEmploymentRate + (laborParticipationChange * 100); // Simplified calculation
      const povertyRate = basePovertyRate - (amount * 0.01); // Simplified calculation
      const costToGovernment = amount * recipients * 12; // Annual cost

      return {
        gdpImpact: parseFloat(gdpImpact.toFixed(2)),
        employmentRate: parseFloat(employmentRate.toFixed(2)),
        povertyRate: parseFloat(povertyRate.toFixed(2)),
        costToGovernment: parseFloat(costToGovernment.toFixed(2)),
        incomeBrackets: [
          { bracket: 'Bottom 20%', amount: amount * 12 * 1.5 },
          { bracket: 'Lower Middle 20%', amount: amount * 12 * 1.2 },
          { bracket: 'Middle 20%', amount: amount * 12 * 0.8 },
          { bracket: 'Upper Middle 20%', amount: amount * 12 * 0.5 },
          { bracket: 'Top 20%', amount: amount * 12 * 0.1 },
        ],
      };
    },
  },
  carbon_tax: {
    id: 'carbon_tax',
    name: 'Carbon Tax',
    description: 'Impose a tax on carbon emissions.',
    parameters: {
      taxRate: {
        type: 'number',
        defaultValue: 50,
        label: 'Tax Rate (per ton CO2)',
        min: 20,
        max: 200,
        step: 5,
      },
    },
    simulate: () => ({
      gdpImpact: -0.5, // Percentage change
      employmentRate: -0.3, // Percentage points
      co2Reduction: 12, // Percentage reduction
      povertyRate: 1.2, // Percentage points
      costToGovernment: -1000000, // Revenue positive
    }),
  },
};
