import { Request, Response } from 'express';
import { saveSimulation } from '../models/policyModel';
import prisma from '../lib/prisma';
import { policies } from '../config/policies';

export const getPolicies = async (_req: Request, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      data: Object.values(policies).map(({ simulate, ...policy }) => policy),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch policies',
    });
  }
};

export const runSimulation = async (req: Request, res: Response) => {
  try {
    const { policyType, parameters } = req.body;
    const userId = (req as any).user.id;

    const policy = policies[policyType];

    if (!policy) {
      return res.status(400).json({
        success: false,
        message: 'Invalid policy type',
      });
    }

    // Run simulation
    const results = policy.simulate(parameters);
    
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
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({
      success: false,
      message: 'Failed to run simulation',
      error: errorMessage
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

    const parsedSimulations = simulations.map((simulation: { parameters: string; results: string; [key: string]: any }) => ({
      ...simulation,
      parameters: JSON.parse(simulation.parameters),
      results: JSON.parse(simulation.results)
    }));

    res.status(200).json({
      success: true,
      data: parsedSimulations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch simulation history'
    });
  }
};
