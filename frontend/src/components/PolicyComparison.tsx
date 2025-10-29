import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Slider, Select, Input, Card, Row, Col, Typography, Statistic } from 'antd';

const { Title, Text } = Typography;
const { Option } = Select;

const PolicyComparison = () => {
  const [policies, setPolicies] = useState([]);
  const [scenarios, setScenarios] = useState([
    { id: '1', name: 'Scenario A', policyType: '', parameters: {}, results: null },
    { id: '2', name: 'Scenario B', policyType: '', parameters: {}, results: null },
  ]);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/policies');
        const data = await response.json();
        if (data.success) {
          setPolicies(data.data);
          const defaultPolicy = data.data[0];
          if (defaultPolicy) {
            const initialParams = {};
            for (const key in defaultPolicy.parameters) {
              initialParams[key] = defaultPolicy.parameters[key].defaultValue;
            }
            setScenarios([
              { id: '1', name: 'Scenario A', policyType: defaultPolicy.id, parameters: initialParams, results: null },
              { id: '2', name: 'Scenario B', policyType: defaultPolicy.id, parameters: initialParams, results: null },
            ]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch policies:', error);
      }
    };
    fetchPolicies();
  }, []);

  const updateScenario = (id, key, value) => {
    setScenarios(scenarios.map(s => (s.id === id ? { ...s, [key]: value } : s)));
  };

  const runSimulation = async (id) => {
    const scenario = scenarios.find(s => s.id === id);
    if (!scenario) return;

    try {
      const response = await fetch('http://localhost:5000/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ policyType: scenario.policyType, parameters: scenario.parameters }),
      });
      const data = await response.json();
      if (data.success) {
        updateScenario(id, 'results', data.data.results);
      } else {
        console.error('Simulation failed:', data.message);
      }
    } catch (error) {
      console.error('Simulation error:', error);
    }
  };

  const getComparisonData = () => {
    if (!scenarios[0].results || !scenarios[1].results) return [];

    const data = [];
    const metrics = ['gdpImpact', 'employmentRate', 'povertyRate', 'costToGovernment'];

    metrics.forEach(metric => {
      data.push({
        name: metric,
        [scenarios[0].name]: scenarios[0].results[metric],
        [scenarios[1].name]: scenarios[1].results[metric],
      });
    });

    if (scenarios[0].results.incomeBrackets && scenarios[1].results.incomeBrackets) {
      scenarios[0].results.incomeBrackets.forEach((bracket, index) => {
        data.push({
          name: `Income: ${bracket.bracket}`,
          [scenarios[0].name]: bracket.amount,
          [scenarios[1].name]: scenarios[1].results.incomeBrackets[index].amount,
        });
      });
    }

    return data;
  };

  const comparisonData = getComparisonData();

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Policy Comparison</Title>
      <Row gutter={16}>
        {scenarios.map(scenario => (
          <Col key={scenario.id} span={12}>
            <Card title={<Input value={scenario.name} onChange={e => updateScenario(scenario.id, 'name', e.target.value)} />}>
              <Select
                value={scenario.policyType}
                onChange={value => updateScenario(scenario.id, 'policyType', value)}
                style={{ width: '100%', marginBottom: 16 }}
              >
                {policies.map(policy => (
                  <Option key={policy.id} value={policy.id}>{policy.name}</Option>
                ))}
              </Select>
              {policies.find(p => p.id === scenario.policyType)?.parameters && Object.entries(policies.find(p => p.id === scenario.policyType).parameters).map(([key, param]) => (
                <div key={key} style={{ marginBottom: 16 }}>
                  <Text strong>{param.label}</Text>
                  <Slider
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    value={scenario.parameters[key]}
                    onChange={value => updateScenario(scenario.id, 'parameters', { ...scenario.parameters, [key]: value })}
                  />
                </div>
              ))}
              <Button type="primary" onClick={() => runSimulation(scenario.id)}>Run Simulation</Button>
              {scenario.results && (
                <div style={{ marginTop: 16 }}>
                  {Object.entries(scenario.results).map(([key, value]) => (
                    <Statistic key={key} title={key} value={value} />
                  ))}
                </div>
              )}
            </Card>
          </Col>
        ))}
      </Row>
      <Card style={{ marginTop: 16 }}>
        <Title level={4}>Comparison Chart</Title>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={comparisonData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={scenarios[0].name} fill="#8884d8" />
            <Bar dataKey={scenarios[1].name} fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default PolicyComparison;
