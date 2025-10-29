import { Request, Response } from 'express';
import { simulatePolicyImpact, saveSimulation } from '../models/policyModel';
import { prisma } from '../lib/prisma';

export const runSimulation = async (req: Request, res: Response) => {
  try {
    const { policyType, parameters } = req.body;
    const userId = (req as any).user.id;

    // Run simulation
    const results = await simulatePolicyImpact(policyType, parameters);
    
    // Save simulation
    const simulation = await saveSimulation(userId, {
      policyType,
      parameters,
      results
    });

    res.status(200).json({
      success: true,
      data: {
        ...simulation,
        results
      }
    });
  } catch (error) {
    console.error('Simulation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to run simulation',
      error: error.message
    });
  }
};

export const getSimulationHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    const simulations = await prisma.simulation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10 // Get last 10 simulations
    });

    res.status(200).json({
      success: true,
      data: simulations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch simulation history'
    });
  }
};
