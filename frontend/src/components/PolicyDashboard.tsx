import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Tabs, Select, DatePicker, Button, Alert } from 'antd';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DownloadOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

const { TabPane } = Tabs;

// Sample data - replace with real API data
const policyData = {
  gdpImpact: 2.4,
  jobsImpact: 12500,
  cost: 2.5, // in millions
  populationImpact: 450000,
  carbonReduction: 15, // in %
  
  timeline: [
    { year: '2024', gdp: 0, jobs: 0, carbon: 0 },
    { year: '2025', gdp: 1.2, jobs: 5000, carbon: 5 },
    { year: '2026', gdp: 2.1, jobs: 9500, carbon: 12 },
    { year: '2027', gdp: 2.4, jobs: 12500, carbon: 15 },
  ],
  
  sectorImpact: [
    { name: 'Healthcare', value: 15, fill: '#8884d8' },
    { name: 'Education', value: 25, fill: '#82ca9d' },
    { name: 'Infrastructure', value: 30, fill: '#ffc658' },
    { name: 'Environment', value: 20, fill: '#ff8042' },
    { name: 'Other', value: 10, fill: '#0088FE' },
  ],
  
  regions: [
    { name: 'Urban', value: 45 },
    { name: 'Suburban', value: 30 },
    { name: 'Rural', value: 25 },
  ],
  
  budgetAllocation: [
    { name: 'Implementation', value: 40 },
    { name: 'Research', value: 20 },
    { name: 'Training', value: 15 },
    { name: 'Infrastructure', value: 25 },
  ]
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const PolicyDashboard = () => {
  const [selectedPolicy, setSelectedPolicy] = useState('Economic Growth');
  const [dateRange, setDateRange] = useState(null);
  
  const handlePolicyChange = (value) => {
    setSelectedPolicy(value);
  };
  
  const handleDateChange = (dates) => {
    setDateRange(dates);
  };
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Policy Impact Dashboard</h1>
        <div className="flex space-x-4">
          <Select 
            defaultValue="Economic Growth" 
            style={{ width: 200 }}
            onChange={handlePolicyChange}
          >
            <Option value="Economic Growth">Economic Growth</Option>
            <Option value="Environmental">Environmental</Option>
            <Option value="Social Welfare">Social Welfare</Option>
            <Option value="Infrastructure">Infrastructure</Option>
          </Select>
          <RangePicker onChange={handleDateChange} />
          <Button type="primary" icon={<DownloadOutlined />}>Export Report</Button>
        </div>
      </div>
      
      <Alert 
        message="This dashboard shows the projected impact of the selected policy over time. All data is simulated for demonstration purposes."
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
        className="mb-6"
      />
      
      {/* Key Metrics */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card className="h-full" hoverable>
            <Statistic 
              title="Projected GDP Impact" 
              value={policyData.gdpImpact} 
              precision={1}
              valueStyle={{ color: '#3f8600', fontSize: '1.75rem' }}
              suffix="%"
            />
            <p className="text-gray-500 text-sm mt-2">+0.3% from last quarter</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="h-full" hoverable>
            <Statistic 
              title="Jobs Affected" 
              value={policyData.jobsImpact.toLocaleString()}
              valueStyle={{ color: '#1677ff', fontSize: '1.75rem' }}
            />
            <p className="text-gray-500 text-sm mt-2">+2,500 from last quarter</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="h-full" hoverable>
            <Statistic 
              title="Estimated Cost" 
              value={policyData.cost} 
              precision={2} 
              valueStyle={{ color: '#cf1322', fontSize: '1.75rem' }}
              prefix="$" 
              suffix="M"
            />
            <p className="text-gray-500 text-sm mt-2">$0.5M under budget</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="h-full" hoverable>
            <Statistic 
              title="Carbon Reduction" 
              value={policyData.carbonReduction} 
              precision={1}
              valueStyle={{ color: '#08979c', fontSize: '1.75rem' }}
              suffix="%"
            />
            <p className="text-gray-500 text-sm mt-2">5% above target</p>
          </Card>
        </Col>
      </Row>

      <Tabs defaultActiveKey="1" className="mb-6">
        <TabPane tab="Economic Impact" key="1">
          <Card className="mb-6" title="Economic Indicators Over Time">
            <div style={{ height: '400px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={policyData.timeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="year" />
                  <YAxis yAxisId="left" orientation="left" stroke="#1677ff" />
                  <YAxis yAxisId="right" orientation="right" stroke="#ff4d4f" />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'GDP Impact') return [`${value}%`, name];
                      if (name === 'Jobs Impact') return [value.toLocaleString(), name];
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="gdp" 
                    name="GDP Impact" 
                    stroke="#1677ff" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="jobs" 
                    name="Jobs Impact" 
                    stroke="#ff4d4f" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card title="Sector Impact" className="h-full">
                <div style={{ height: '350px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={policyData.sectorImpact}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {policyData.sectorImpact.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Impact']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Budget Allocation" className="h-full">
                <div style={{ height: '350px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={policyData.budgetAllocation}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip formatter={(value) => [`${value}%`, 'Allocation']} />
                      <Legend />
                      <Bar dataKey="value" fill="#82ca9d">
                        {policyData.budgetAllocation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>
        
        <TabPane tab="Environmental Impact" key="2">
          <Card className="mb-6" title="Carbon Reduction Progress">
            <div style={{ height: '400px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={policyData.timeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="year" />
                  <YAxis label={{ value: 'Carbon Reduction (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Carbon Reduction']} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="carbon" 
                    name="Carbon Reduction" 
                    stroke="#52c41a" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          <Card title="Regional Impact" className="mb-6">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={policyData.regions}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {policyData.regions.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Population']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Col>
              <Col xs={24} md={12} className="flex items-center">
                <div>
                  <h3 className="text-lg font-medium mb-4">Key Environmental Benefits</h3>
                  <ul className="space-y-2">
                    <li>• 15% reduction in carbon emissions by 2027</li>
                    <li>• 25% increase in renewable energy usage</li>
                    <li>• 10,000+ trees to be planted in urban areas</li>
                    <li>• 30% improvement in air quality index</li>
                    <li>• 50% reduction in single-use plastics</li>
                  </ul>
                </div>
              </Col>
            </Row>
          </Card>
        </TabPane>
        
        <TabPane tab="Social Impact" key="3">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card title="Population Impact" className="h-full">
                <div className="text-center py-8">
                  <div className="text-5xl font-bold text-blue-600 mb-2">
                    {policyData.populationImpact.toLocaleString()}+
                  </div>
                  <p className="text-gray-600">People directly benefiting from this policy</p>
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold">45%</div>
                      <div className="text-sm text-gray-500">Urban Areas</div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold">30%</div>
                      <div className="text-sm text-gray-500">Suburban Areas</div>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold">25%</div>
                      <div className="text-sm text-gray-500">Rural Areas</div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold">60%</div>
                      <div className="text-sm text-gray-500">Low-Income</div>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Key Performance Indicators" className="h-full">
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Education Access</span>
                      <span className="text-sm font-medium">75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{width: '75%'}}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Healthcare Coverage</span>
                      <span className="text-sm font-medium">82%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{width: '82%'}}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Job Creation</span>
                      <span className="text-sm font-medium">68%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-yellow-500 h-2.5 rounded-full" style={{width: '68%'}}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Community Engagement</span>
                      <span className="text-sm font-medium">91%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-purple-500 h-2.5 rounded-full" style={{width: '91%'}}></div>
                    </div>
                  </div>
                  
                  <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="font-medium text-blue-800 mb-2">Success Metrics</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• 92% satisfaction rate among beneficiaries</li>
                      <li>• 3.8x return on investment</li>
                      <li>• 78% of targets met or exceeded</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default PolicyDashboard;
