import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface PolicyImpact {
  gdpImpact: number;
  employmentRate: number;
  povertyRate: number;
  co2Reduction?: number;
  costToGovernment: number;
}

export const simulatePolicyImpact = async (policyType: string, parameters: any): Promise<PolicyImpact> => {
  // Base simulation logic - can be enhanced with real economic models
  switch (policyType.toLowerCase()) {
    case 'ubi':
      return {
        gdpImpact: parameters.amount * 0.8, // Simplified multiplier
        employmentRate: 2.5, // Percentage points change
        povertyRate: -15, // Percentage points change
        costToGovernment: parameters.amount * parameters.recipients,
      };
    case 'carbon_tax':
      return {
        gdpImpact: -0.5, // Percentage change
        employmentRate: -0.3, // Percentage points
        co2Reduction: 12, // Percentage reduction
        povertyRate: 1.2, // Percentage points
        costToGovernment: -1000000, // Revenue positive
      };
    default:
      throw new Error('Unsupported policy type');
  }
};

export const saveSimulation = async (userId: number, simulationData: any) => {
  return await prisma.simulation.create({
    data: {
      userId,
      policyType: simulationData.policyType,
      parameters: simulationData.parameters,
      results: simulationData.results,
    },
  });
};
