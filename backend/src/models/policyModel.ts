import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const saveSimulation = async (userId: number, simulationData: any) => {
  return await prisma.simulation.create({
    data: {
      userId,
      policyType: simulationData.policyType,
      parameters: JSON.stringify(simulationData.parameters),
      results: JSON.stringify(simulationData.results),
    },
  });
};
