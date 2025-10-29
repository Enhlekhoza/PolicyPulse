import React, { useState, useEffect } from 'react';
import { Card, Tabs, Button, Slider, InputNumber, Row, Col, Typography, Statistic, Progress } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const PolicySimulator = () => {
  const [policyType, setPolicyType] = useState('');
  const [parameters, setParameters] = useState({});
  const [simulationResults, setSimulationResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/policies');
        const data = await response.json();
        if (data.success) {
          setPolicies(data.data);
          if (data.data.length > 0) {
            setPolicyType(data.data[0].id);
            const initialParams = {};
            for (const key in data.data[0].parameters) {
              initialParams[key] = data.data[0].parameters[key].defaultValue;
            }
            setParameters(initialParams);
          }
        }
      } catch (error) {
        console.error('Failed to fetch policies:', error);
      }
    };
    fetchPolicies();
  }, []);

  const runSimulation = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ policyType, parameters })
      });
      const data = await response.json();
      if (data.success) {
        setSimulationResults(data.data.results);
      } else {
        console.error('Simulation failed:', data.message);
      }
    } catch (error) {
      console.error('Simulation error:', error);
    }
    setIsLoading(false);
  };

  const renderPolicyControls = () => {
    const policy = policies.find(p => p.id === policyType);
    if (!policy) return null;

    return (
      <div>
        {Object.entries(policy.parameters).map(([key, param]) => (
          <div key={key} style={{ marginBottom: 24 }}>
            <Text strong>{param.label}</Text>
            <Slider
              min={param.min}
              max={param.max}
              step={param.step}
              value={parameters[key]}
              onChange={(value) => setParameters({ ...parameters, [key]: value })}
              marks={{ [param.min]: param.min, [param.max]: param.max }}
            />
            <InputNumber
              min={param.min}
              max={param.max}
              value={parameters[key]}
              onChange={(value) => setParameters({ ...parameters, [key]: value })}
              style={{ width: '100%', marginTop: 8 }}
            />
          </div>
        ))}
      </div>
    );
  };

  const renderResults = () => {
    if (!simulationResults) return null;

    const { gdpImpact, employmentRate, povertyRate, costToGovernment, co2Reduction, incomeBrackets, inflationImpact, laborParticipationChange } = simulationResults;
    
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
                suffix=" p.p."
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
                suffix="M"
              />
            </Card>
          </Col>
          {policyType === 'ubi' && inflationImpact !== undefined && (
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Inflation Impact"
                  value={inflationImpact * 100}
                  precision={1}
                  valueStyle={{ color: inflationImpact >= 0 ? '#cf1322' : '#3f8600' }}
                  suffix="%"
                />
              </Card>
            </Col>
          )}
          {policyType === 'ubi' && laborParticipationChange !== undefined && (
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Labor Participation Change"
                  value={laborParticipationChange * 100}
                  precision={1}
                  valueStyle={{ color: laborParticipationChange >= 0 ? '#3f8600' : '#cf1322' }}
                  suffix="%"
                />
              </Card>
            </Col>
          )}
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

        {incomeBrackets && incomeBrackets.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <Title level={5}>Income Bracket Impact</Title>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={incomeBrackets}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="bracket" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Annual Change']} />
                <Legend />
                <Bar dataKey="amount" fill="#8884d8" name="Annual Change ($)" />
              </BarChart>
            </ResponsiveContainer>
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
          {policies.map(policy => (
            <TabPane tab={policy.name} key={policy.id} />
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
