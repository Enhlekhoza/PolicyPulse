import React from 'react';
import SimpleGlobe from './SimpleGlobe';

export interface PolicyImpact {
  region: string;
  impactScore: number;
  confidence: number;
  metrics: {
    gdp: number;
    employment: number;
    environment: number;
  };
}

export interface PolicyGlobeProps {
  policyImpact: PolicyImpact;
  onRegionSelect: (region: string) => void;
}

/**
 * PolicyGlobe component that displays a simplified globe visualization.
 * This is a wrapper around SimpleGlobe that can be easily replaced with
 * a more complex 3D implementation in the future.
 */
const PolicyGlobe: React.FC<PolicyGlobeProps> = ({ policyImpact, onRegionSelect }) => {
  return <SimpleGlobe policyImpact={policyImpact} onRegionSelect={onRegionSelect} />;
};

export default PolicyGlobe;
