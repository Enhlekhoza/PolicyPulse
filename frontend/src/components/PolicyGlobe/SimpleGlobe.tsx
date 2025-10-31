import React from 'react';
import { Card, Typography } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface PolicyImpact {
  region: string;
  impactScore: number;
  confidence: number;
  metrics: {
    gdp: number;
    employment: number;
    environment: number;
  };
}

interface PolicyGlobeProps {
  policyImpact: PolicyImpact;
  onRegionSelect: (region: string) => void;
}

const SimpleGlobe: React.FC<PolicyGlobeProps> = ({ policyImpact, onRegionSelect }) => {
  return (
    <Card 
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <GlobalOutlined />
          <span>Policy Impact Visualization</span>
        </div>
      }
      style={{ height: '100%' }}
    >
      <div style={{ 
        textAlign: 'center', 
        padding: '20px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'linear-gradient(145deg, #e6f7ff, #91d5ff)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}>
          <GlobalOutlined style={{ fontSize: '64px', color: '#1890ff' }} />
        </div>
        
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <Title level={4} style={{ marginTop: '16px' }}>Global Impact Overview</Title>
          <Text type="secondary">
            The interactive 3D globe is currently in development. Here's a summary of the policy impact:
          </Text>
          
          <div style={{ 
            marginTop: '24px',
            textAlign: 'left',
            padding: '16px',
            background: '#f9f9f9',
            borderRadius: '8px'
          }}>
            <div style={{ marginBottom: '8px' }}>
              <Text strong>Region: </Text>
              <Text>{policyImpact.region}</Text>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <Text strong>Impact Score: </Text>
              <Text>{policyImpact.impactScore.toFixed(2)}/1.0</Text>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <Text strong>Confidence: </Text>
              <Text>{(policyImpact.confidence * 100).toFixed(0)}%</Text>
            </div>
          </div>
          
          <div style={{ marginTop: '16px' }}>
            <Text type="warning">
              Note: The interactive 3D globe will be available in the next update.
            </Text>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SimpleGlobe;
