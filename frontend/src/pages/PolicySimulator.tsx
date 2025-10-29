import React, { useState } from 'react';
import { Card, Tabs, Button, Slider, InputNumber, Row, Col, Typography, Statistic, Progress } from 'antd';
import { Line, Bar } from 'recharts';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const PolicySimulator = () => {
  const [policyType, setPolicyType] = useState('ubi');
  const [parameters, setParameters] = useState({
    amount: 1000,
    duration: 12,
    recipients: 1000000,
  });
  const [simulationResults, setSimulationResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const policyTypes = [
    { key: 'ubi', name: 'Universal Basic Income' },
    { key: 'carbon_tax', name: 'Carbon Tax' },
    { key: 'infrastructure', name: 'Infrastructure Investment' },
  ];

  const runSimulation = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would call your backend API
      // const response = await fetch('/api/simulate', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ policyType, parameters })
      // });
      // const data = await response.json();
      
      // Mock response for demo
      setTimeout(() => {
        const mockResults = {
          gdpImpact: policyType === 'ubi' ? 2.5 : -0.5,
          employmentRate: policyType === 'ubi' ? 1.2 : -0.3,
          povertyRate: policyType === 'ubi' ? -8.5 : 0.5,
          costToGovernment: policyType === 'ubi' 
            ? parameters.amount * parameters.recipients 
            : -1000000,
          co2Reduction: policyType === 'carbon_tax' ? 15 : 0,
          timestamp: new Date().toISOString()
        };
        setSimulationResults(mockResults);
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Simulation error:', error);
      setIsLoading(false);
    }
  };

  const renderPolicyControls = () => {
    switch (policyType) {
      case 'ubi':
        return (
          <div>
            <div style={{ marginBottom: 24 }}>
              <Text strong>Monthly Amount (USD)</Text>
              <Slider
                min={500}
                max={2000}
                step={100}
                value={parameters.amount}
                onChange={(value) => setParameters({...parameters, amount: value})}
                marks={{ 500: '$500', 1250: '$1,250', 2000: '$2,000' }}
              />
              <InputNumber
                min={500}
                max={2000}
                value={parameters.amount}
                onChange={(value) => setParameters({...parameters, amount: value})}
                formatter={value => `$${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                style={{ width: '100%', marginTop: 8 }}
              />
            </div>
            
            <div style={{ marginBottom: 24 }}>
              <Text strong>Number of Recipients</Text>
              <Slider
                min={100000}
                max={10000000}
                step={100000}
                value={parameters.recipients}
                onChange={(value) => setParameters({...parameters, recipients: value})}
                marks={{ 100000: '100K', 5000000: '5M', 10000000: '10M' }}
              />
              <InputNumber
                min={100000}
                max={10000000}
                value={parameters.recipients}
                onChange={(value) => setParameters({...parameters, recipients: value})}
                formatter={value => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                style={{ width: '100%', marginTop: 8 }}
              />
            </div>
          </div>
        );
      
      case 'carbon_tax':
        return (
          <div>
            <div style={{ marginBottom: 24 }}>
              <Text strong>Tax Rate (per ton CO₂)</Text>
              <Slider
                min={20}
                max={200}
                step={5}
                value={parameters.amount}
                onChange={(value) => setParameters({...parameters, amount: value})}
                marks={{ 20: '$20', 100: '$100', 200: '$200' }}
              />
              <InputNumber
                min={20}
                max={200}
                value={parameters.amount}
                onChange={(value) => setParameters({...parameters, amount: value})}
                formatter={value => `$${value}`}
                style={{ width: '100%', marginTop: 8 }}
              />
            </div>
          </div>
        );
      
      default:
        return <Text>Select a policy type to configure parameters</Text>;
    }
  };

  const renderResults = () => {
    if (!simulationResults) return null;

    const { gdpImpact, employmentRate, povertyRate, costToGovernment, co2Reduction } = simulationResults;
    
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    };

    return (
      <div style={{ marginTop: 24 }}>
        <Title level={4}>Simulation Results</Title>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="GDP Impact"
                value={gdpImpact}
                precision={1}
                valueStyle={{ color: gdpImpact >= 0 ? '#3f8600' : '#cf1322' }}
                suffix="%"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Employment Rate Change"
                value={employmentRate}
                precision={1}
                valueStyle={{ color: employmentRate >= 0 ? '#3f8600' : '#cf1322' }}
                suffix="%"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Poverty Rate Change"
                value={povertyRate}
                precision={1}
                valueStyle={{ color: povertyRate <= 0 ? '#3f8600' : '#cf1322' }}
                suffix={povertyRate > 0 ? ' p.p. increase' : ' p.p. decrease'}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={costToGovernment > 0 ? "Cost to Government" : "Revenue to Government"}
                value={Math.abs(costToGovernment) / 1000000}
                precision={1}
                valueStyle={{ color: costToGovernment > 0 ? '#cf1322' : '#3f8600' }}
                prefix={costToGovernment > 0 ? '-' : '+'}
                prefixCls="ant-statistic"
                suffix="M"
              />
            </Card>
          </Col>
        </Row>

        {policyType === 'carbon_tax' && co2Reduction && (
          <div style={{ marginBottom: 24 }}>
            <Title level={5}>Estimated CO₂ Reduction</Title>
            <Progress 
              percent={co2Reduction} 
              status="active" 
              strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
              format={(percent) => `${percent}% reduction`}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Policy Impact Simulator</Title>
      <Text type="secondary">
        Simulate the economic impact of different policy decisions in real-time.
      </Text>

      <Card style={{ marginTop: 24 }}>
        <Tabs activeKey={policyType} onChange={setPolicyType}>
          {policyTypes.map(policy => (
            <TabPane tab={policy.name} key={policy.key} />
          ))}
        </Tabs>

        {renderPolicyControls()}

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Button 
            type="primary" 
            size="large" 
            onClick={runSimulation}
            loading={isLoading}
          >
            Run Simulation
          </Button>
        </div>

        {renderResults()}
      </Card>
    </div>
  );
};

export default PolicySimulator;
