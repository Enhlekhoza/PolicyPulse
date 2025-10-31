import React, { useState, useEffect, useCallback } from 'react';
import { Card, Tabs, Button, Slider, InputNumber, Row, Col, Typography, Statistic, Progress, Alert, Spin, Select, Divider, Collapse } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import { InfoCircleOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const { Panel } = Collapse;
const { Option } = Select;

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const PolicySimulator = () => {
  const [policyType, setPolicyType] = useState('');
  const [parameters, setParameters] = useState({});
  const [simulationResults, setSimulationResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [policies, setPolicies] = useState([]);
  const [savedSimulations, setSavedSimulations] = useState([]);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedSimulations, setSelectedSimulations] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('1');

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

  const runSimulation = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/simulate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ 
          policyType, 
          parameters,
          timestamp: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        const resultsWithMetadata = {
          ...data.data.results,
          policyName: policies.find(p => p.id === policyType)?.name || 'Custom Policy',
          timestamp: new Date().toISOString(),
          parameters: { ...parameters }
        };
        
        setSimulationResults(resultsWithMetadata);
        setSavedSimulations(prev => [resultsWithMetadata, ...prev].slice(0, 5)); // Keep last 5 simulations
      } else {
        throw new Error(data.message || 'Simulation failed');
      }
    } catch (error) {
      console.error('Simulation error:', error);
      setError(error.message || 'Failed to run simulation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [policyType, parameters, policies]);

  const renderPolicyControls = () => {
    const policy = policies.find(p => p.id === policyType);
    if (!policy) return null;

    return (
      <Card 
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Policy Parameters</span>
            <Select
              value={policyType}
              onChange={(value) => {
                setPolicyType(value);
                const selectedPolicy = policies.find(p => p.id === value);
                if (selectedPolicy) {
                  const initialParams = {};
                  for (const key in selectedPolicy.parameters) {
                    initialParams[key] = selectedPolicy.parameters[key].defaultValue;
                  }
                  setParameters(initialParams);
                }
              }}
              style={{ width: 200 }}
            >
              {policies.map(policy => (
                <Option key={policy.id} value={policy.id}>
                  {policy.name}
                </Option>
              ))}
            </Select>
          </div>
        }
        style={{ marginBottom: 24 }}
      >
        <Collapse defaultActiveKey={['1']} ghost>
          <Panel header="Adjust Policy Parameters" key="1">
            {Object.entries(policy.parameters).map(([key, param]) => (
              <div key={key} style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text strong>{param.label}</Text>
                  <Text type="secondary">{param.description}</Text>
                </div>
                <Slider
                  min={param.min}
                  max={param.max}
                  step={param.step}
                  value={parameters[key]}
                  onChange={(value) => setParameters({ ...parameters, [key]: value })}
                  marks={{
                    [param.min]: param.min,
                    [param.max]: param.max,
                    [parameters[key]]: parameters[key]
                  }}
                  tooltip={{ formatter: (value) => `${value} ${param.unit || ''}` }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                  <InputNumber
                    min={param.min}
                    max={param.max}
                    value={parameters[key]}
                    onChange={(value) => setParameters({ ...parameters, [key]: value })}
                    style={{ width: '48%' }}
                    addonAfter={param.unit}
                  />
                  <Button 
                    type="link" 
                    icon={<InfoCircleOutlined />} 
                    onClick={() => window.open(param.documentation, '_blank')}
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            ))}
          </Panel>
        </Collapse>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
          <Button 
            type={comparisonMode ? 'default' : 'primary'}
            onClick={() => setComparisonMode(!comparisonMode)}
          >
            {comparisonMode ? 'Exit Comparison' : 'Compare Policies'}
          </Button>
          <Button 
            type="primary" 
            onClick={runSimulation}
            loading={isLoading}
            disabled={!policyType}
          >
            Run Simulation
          </Button>
        </div>
      </Card>
    );
  };

  const renderImpactIndicator = (value, isPositiveGood = true) => {
    if (value === 0) return <span>—</span>;
    const isPositive = value > 0;
    const color = isPositive === isPositiveGood ? '#52c41a' : '#ff4d4f';
    const icon = isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />;
    
    return (
      <span style={{ color }}>
        {icon} {Math.abs(value).toFixed(2)}%
      </span>
    );
  };

  const renderComparisonChart = (data, dataKey, name, color = '#1890ff') => {
    return (
      <div style={{ marginTop: 24 }}>
        <Text strong>{name}</Text>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value}%`, name]} />
            <Legend />
            <Bar dataKey={dataKey} fill={color} name={name} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderResults = () => {
    if (!simulationResults) return null;

    const {
      gdpImpact,
      employmentRate,
      povertyRate,
      costToGovernment,
      co2Reduction,
      incomeBrackets = [],
      inflationImpact,
      laborParticipationChange,
      policyName,
      timestamp
    } = simulationResults;

    const economicIndicators = [
      { name: 'GDP Impact', value: gdpImpact, formatter: (v) => `${v > 0 ? '+' : ''}${v.toFixed(2)}%` },
      { name: 'Employment Rate', value: employmentRate, formatter: (v) => `${v.toFixed(1)}%` },
      { name: 'Poverty Rate', value: povertyRate, formatter: (v) => `${v.toFixed(1)}%` },
      { name: 'CO₂ Reduction', value: co2Reduction, formatter: (v) => `${v > 0 ? '+' : ''}${v.toFixed(1)}%` },
      { name: 'Inflation Impact', value: inflationImpact, formatter: (v) => `${v > 0 ? '+' : ''}${v.toFixed(2)}%` },
      { name: 'Labor Participation', value: laborParticipationChange, formatter: (v) => `${v > 0 ? '+' : ''}${v.toFixed(2)}%` },
    ];

    const incomeDistributionData = incomeBrackets.map((bracket, index) => ({
      name: `$${bracket.min}K - $${bracket.max}K`,
      'Before Tax': bracket.beforeTax,
      'After Tax': bracket.afterTax,
      'Net Change': ((bracket.afterTax - bracket.beforeTax) / bracket.beforeTax * 100).toFixed(1)
    }));
    
    return (
      <div style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={4} style={{ margin: 0 }}>Simulation Results</Title>
          <Text type="secondary">Policy: {policyName} • {new Date(timestamp).toLocaleString()}</Text>
        </div>
        
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 24 }}
            closable
          />
        )}

        <Card title="Economic Impact Dashboard" style={{ marginBottom: 24 }}>
          <Row gutter={[16, 16]}>
            {economicIndicators.map((indicator, index) => (
              <Col xs={24} sm={12} md={8} lg={4} key={index}>
                <Card size="small" hoverable>
                  <Statistic
                    title={indicator.name}
                    value={indicator.value}
                    formatter={indicator.formatter}
                    valueStyle={{
                      color: indicator.name.includes('Poverty') || indicator.name.includes('Inflation') 
                        ? (indicator.value > 0 ? '#ff4d4f' : '#52c41a')
                        : (indicator.value > 0 ? '#52c41a' : '#ff4d4f')
                    }}
                    prefix={
                      indicator.value !== 0 ? (
                        indicator.value > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />
                      ) : null
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} lg={12}>
            <Card title="Income Distribution Impact" style={{ height: '100%' }}>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={incomeDistributionData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={60}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [`${value}%`, name === 'Net Change' ? 'Net Change' : name]}
                    labelFormatter={(value) => `Income: ${value}`}
                  />
                  <Legend />
                  <Bar dataKey="Before Tax" fill="#8884d8" name="Before Tax" />
                  <Bar dataKey="After Tax" fill="#82ca9d" name="After Tax" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          
          <Col xs={24} lg={12}>
            <Card title="Economic Indicators Over Time" style={{ height: '100%' }}>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart
                  data={[
                    { name: 'Year 1', gdp: 1, employment: 1, poverty: 1 },
                    { 
                      name: 'Year 5', 
                      gdp: 1 + (gdpImpact * 0.2) / 100, 
                      employment: 1 + ((employmentRate - 50) * 0.3) / 100,
                      poverty: 1 - ((povertyRate - 10) * 0.2) / 100
                    },
                    { 
                      name: 'Year 10', 
                      gdp: 1 + gdpImpact / 100, 
                      employment: 1 + (employmentRate - 50) / 100,
                      poverty: 1 - (povertyRate - 10) / 100
                    }
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${((value - 1) * 100).toFixed(1)}%`} />
                  <Legend />
                  <Area type="monotone" dataKey="gdp" name="GDP" stackId="1" stroke="#8884d8" fill="#8884d8" />
                  <Area type="monotone" dataKey="employment" name="Employment" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
                  <Area type="monotone" dataKey="poverty" name="Poverty Reduction" stackId="3" stroke="#ffc658" fill="#ffc658" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        <Card 
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Policy Impact Analysis</span>
              <Button 
                type="link" 
                onClick={() => setActiveTab(activeTab === '1' ? '2' : '1')}
              >
                {activeTab === '1' ? 'Show Details' : 'Hide Details'}
              </Button>
            </div>
          }
        >
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="Summary" key="1">
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Card size="small" title="Key Findings" style={{ height: '100%' }}>
                    <ul>
                      <li>
                        <Text strong>GDP Impact: </Text>
                        {renderImpactIndicator(gdpImpact, true)}
                      </li>
                      <li>
                        <Text strong>Employment Rate: </Text>
                        {employmentRate.toFixed(1)}%
                      </li>
                      <li>
                        <Text strong>Poverty Reduction: </Text>
                        {renderImpactIndicator(10 - povertyRate, true)}
                      </li>
                      <li>
                        <Text strong>CO₂ Reduction: </Text>
                        {renderImpactIndicator(co2Reduction, true)}
                      </li>
                    </ul>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card size="small" title="Cost-Benefit Analysis" style={{ height: '100%' }}>
                    <Statistic
                      title="Cost to Government"
                      value={costToGovernment}
                      prefix="$"
                      valueStyle={{ color: costToGovernment > 0 ? '#ff4d4f' : '#52c41a' }}
                    />
                    <Divider style={{ margin: '12px 0' }} />
                    <Text type="secondary">
                      <InfoCircleOutlined /> This policy would cost approximately 
                      ${(costToGovernment / 1_000_000_000).toFixed(2)} billion annually.
                    </Text>
                  </Card>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="Detailed Analysis" key="2">
              <Row gutter={[16, 24]}>
                <Col span={24}>
                  <Title level={5}>Income Distribution Impact</Title>
                  {renderComparisonChart(
                    incomeDistributionData.map(item => ({
                      ...item,
                      'Net Change (%)': parseFloat(item['Net Change'])
                    })),
                    'Net Change (%)',
                    'Net Income Change',
                    '#1890ff'
                  )}
                </Col>
                
                <Col span={24}>
                  <Title level={5}>Environmental Impact</Title>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                      <Card size="small">
                        <Statistic
                          title="CO₂ Emissions Reduction"
                          value={co2Reduction}
                          suffix="%"
                          precision={1}
                          valueStyle={{ color: co2Reduction > 0 ? '#52c41a' : '#ff4d4f' }}
                          prefix={co2Reduction > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                        />
                      </Card>
                    </Col>
                    <Col xs={24} md={12}>
                      <Card size="small">
                        <Statistic
                          title="Renewable Energy Adoption"
                          value={co2Reduction * 2.5}
                          suffix="%"
                          precision={1}
                          valueStyle={{ color: '#52c41a' }}
                        />
                      </Card>
                    </Col>
                  </Row>
                </Col>
                
                <Col span={24}>
                  <Title level={5}>Labor Market Effects</Title>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={8}>
                      <Card size="small">
                        <Statistic
                          title="Employment Rate"
                          value={employmentRate}
                          suffix="%"
                          precision={1}
                        />
                      </Card>
                    </Col>
                    <Col xs={24} md={8}>
                      <Card size="small">
                        <Statistic
                          title="Labor Force Participation"
                          value={50 + (laborParticipationChange || 0)}
                          suffix="%"
                          precision={1}
                        />
                      </Card>
                    </Col>
                    <Col xs={24} md={8}>
                      <Card size="small">
                        <Statistic
                          title="Wage Growth"
                          value={2.5 + (gdpImpact * 0.1)}
                          suffix="%"
                          precision={1}
                          valueStyle={{ color: '#52c41a' }}
                        />
                      </Card>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Card>

        {savedSimulations.length > 0 && (
          <Card 
            title="Previous Simulations" 
            style={{ marginTop: 24 }}
            extra={
              <Button 
                type="link" 
                onClick={() => setComparisonMode(!comparisonMode)}
              >
                {comparisonMode ? 'Cancel' : 'Compare'}
              </Button>
            }
          >
            {comparisonMode ? (
              <div>
                <p>Select up to 3 simulations to compare:</p>
                <Row gutter={[16, 16]}>
                  {savedSimulations.map((sim, index) => (
                    <Col key={index} xs={24} md={8}>
                      <Card
                        hoverable
                        style={{
                          border: selectedSimulations.includes(index)
                            ? '2px solid #1890ff'
                            : '1px solid #f0f0f0'
                        }}
                        onClick={() => {
                          setSelectedSimulations(prev =>
                            prev.includes(index)
                              ? prev.filter(i => i !== index)
                              : prev.length < 3
                                ? [...prev, index]
                                : [prev[1], prev[2], index]
                          );
                        }}
                      >
                        <Card.Meta
                          title={sim.policyName}
                          description={new Date(sim.timestamp).toLocaleString()}
                        />
                        <div style={{ marginTop: 8 }}>
                          <Text>GDP: {sim.gdpImpact > 0 ? '+' : ''}{sim.gdpImpact.toFixed(2)}%</Text>
                          <br />
                          <Text>Employment: {sim.employmentRate.toFixed(1)}%</Text>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
                
                {selectedSimulations.length > 0 && (
                  <div style={{ marginTop: 24 }}>
                    <Title level={4}>Comparison Results</Title>
                    <Row gutter={[16, 16]}>
                      <Col span={24}>
                        {renderComparisonChart(
                          selectedSimulations.map(index => ({
                            name: savedSimulations[index].policyName,
                            'GDP Impact': savedSimulations[index].gdpImpact,
                            'Employment Rate': savedSimulations[index].employmentRate - 50 // Normalize to show change
                          })),
                          'GDP Impact',
                          'GDP Impact (%)'
                        )}
                      </Col>
                      <Col span={24}>
                        {renderComparisonChart(
                          selectedSimulations.map(index => ({
                            name: savedSimulations[index].policyName,
                            'Poverty Rate': savedSimulations[index].povertyRate,
                            'CO₂ Reduction': savedSimulations[index].co2Reduction
                          })),
                          'Poverty Rate',
                          'Poverty Rate (%)',
                          '#ff4d4f'
                        )}
                      </Col>
                    </Row>
                  </div>
                )}
              </div>
            ) : (
              <Row gutter={[16, 16]}>
                {savedSimulations.map((sim, index) => (
                  <Col key={index} xs={24} md={8}>
                    <Card
                      hoverable
                      onClick={() => setSimulationResults(sim)}
                    >
                      <Card.Meta
                        title={sim.policyName}
                        description={new Date(sim.timestamp).toLocaleString()}
                      />
                      <div style={{ marginTop: 8 }}>
                        <Text>GDP: {sim.gdpImpact > 0 ? '+' : ''}{sim.gdpImpact.toFixed(2)}%</Text>
                        <br />
                        <Text>Employment: {sim.employmentRate.toFixed(1)}%</Text>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Card>
        )}
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
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

// Add responsive container for charts
const ResponsiveCard = ({ children, title }) => (
  <Card title={title} style={{ marginBottom: 24 }}>
    <div style={{ width: '100%', height: 300, minWidth: 300 }}>
      {children}
    </div>
  </Card>
);

export default React.memo(PolicySimulator);
