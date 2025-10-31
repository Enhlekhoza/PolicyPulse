import React, { useState, useCallback } from 'react';
import { Card, Button, Input, List, Typography, message, Spin, Tabs, Tag } from 'antd';
import { SendOutlined, BulbOutlined, ThunderboltOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface PolicySuggestion {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
  estimatedEffect: string;
}

interface Scenario {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, any>;
  createdAt: string;
}

const AIPolicyAdvisor: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('suggestions');
  const [suggestions, setSuggestions] = useState<PolicySuggestion[]>([]);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);

  const generateSuggestions = useCallback(async () => {
    if (!query.trim()) {
      message.warning('Please enter a policy question or scenario');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data - in a real app, this would come from your AI service
      const mockSuggestions: PolicySuggestion[] = [
        {
          id: '1',
          title: 'Progressive Carbon Tax',
          description: 'Implement a gradually increasing carbon tax with revenue recycling to lower-income households.',
          impact: 'high',
          category: 'Environmental',
          estimatedEffect: 'Could reduce emissions by 15-25% within 5 years while protecting low-income households.'
        },
        {
          id: '2',
          title: 'Universal Basic Income Pilot',
          description: 'Test a UBI program in select regions to evaluate its impact on poverty and employment.',
          impact: 'high',
          category: 'Social Welfare',
          estimatedEffect: 'May reduce poverty by 30% in targeted areas with minimal impact on workforce participation.'
        },
        {
          id: '3',
          title: 'Education Technology Grants',
          description: 'Provide funding for schools to implement AI-powered personalized learning tools.',
          impact: 'medium',
          category: 'Education',
          estimatedEffect: 'Potential to improve learning outcomes by 10-15% in participating schools.'
        }
      ];
      
      setSuggestions(mockSuggestions);
      message.success('Generated policy suggestions');
    } catch (error) {
      console.error('Error generating suggestions:', error);
      message.error('Failed to generate suggestions. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [query]);

  const createScenario = useCallback(() => {
    if (!query.trim()) {
      message.warning('Please describe your policy scenario');
      return;
    }

    const newScenario: Scenario = {
      id: `scenario-${Date.now()}`,
      name: `Scenario ${scenarios.length + 1}`,
      description: query,
      parameters: {},
      createdAt: new Date().toISOString()
    };

    setScenarios(prev => [newScenario, ...prev]);
    setCurrentScenario(newScenario);
    setActiveTab('scenarios');
    message.success('Created new scenario');
  }, [query, scenarios.length]);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'blue';
    }
  };

  return (
    <Card 
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <BulbOutlined />
          <span>AI Policy Advisor</span>
        </div>
      }
      style={{ height: '100%' }}
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Get Suggestions" key="suggestions">
          <div style={{ marginBottom: 16 }}>
            <TextArea
              rows={4}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about policy impacts, get recommendations, or describe a scenario..."
              autoSize={{ minRows: 3, maxRows: 6 }}
            />
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <Button 
                type="primary" 
                icon={<BulbOutlined />} 
                onClick={generateSuggestions}
                loading={loading}
              >
                Get Policy Suggestions
              </Button>
              <Button 
                icon={<ThunderboltOutlined />} 
                onClick={createScenario}
                loading={loading}
              >
                Create Scenario
              </Button>
            </div>
          </div>

          {suggestions.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <Title level={5}>Recommended Policies</Title>
              <List
                itemLayout="vertical"
                dataSource={suggestions}
                renderItem={(item) => (
                  <List.Item
                    key={item.id}
                    actions={[
                      <Tag color={getImpactColor(item.impact)} key="impact">
                        {item.impact} impact
                      </Tag>,
                      <Tag key="category">{item.category}</Tag>,
                      <Button type="link" key="simulate">Simulate</Button>
                    ]}
                  >
                    <List.Item.Meta
                      title={item.title}
                      description={
                        <>
                          <div>{item.description}</div>
                          <div style={{ marginTop: 8 }}>
                            <Text type="secondary">Estimated effect: </Text>
                            <Text>{item.estimatedEffect}</Text>
                          </div>
                        </>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
          )}
        </TabPane>

        <TabPane tab="My Scenarios" key="scenarios">
          {scenarios.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <Text type="secondary">No scenarios yet. Create one to get started.</Text>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ width: '40%', borderRight: '1px solid #f0f0f0', paddingRight: 16 }}>
                <List
                  dataSource={scenarios}
                  renderItem={(scenario) => (
                    <List.Item
                      onClick={() => setCurrentScenario(scenario)}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: currentScenario?.id === scenario.id ? '#f0f9ff' : 'transparent',
                        padding: '8px 12px',
                        borderRadius: 4
                      }}
                    >
                      <List.Item.Meta
                        title={scenario.name}
                        description={
                          <Text ellipsis={{ tooltip: scenario.description }}>
                            {scenario.description}
                          </Text>
                        }
                      />
                    </List.Item>
                  )}
                />
              </div>
              
              <div style={{ flex: 1, padding: '0 16px' }}>
                {currentScenario ? (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Title level={4} style={{ marginBottom: 0 }}>{currentScenario.name}</Title>
                      <Button type="primary">Run Simulation</Button>
                    </div>
                    <Text type="secondary">
                      Created: {new Date(currentScenario.createdAt).toLocaleString()}
                    </Text>
                    <div style={{ marginTop: 16 }}>
                      <Title level={5}>Scenario Description</Title>
                      <p>{currentScenario.description}</p>
                      
                      <Title level={5} style={{ marginTop: 24 }}>Parameters</Title>
                      <p>No parameters set yet. Configure simulation parameters to continue.</p>
                      
                      <div style={{ marginTop: 24 }}>
                        <Button type="primary" style={{ marginRight: 8 }}>Edit Scenario</Button>
                        <Button danger>Delete Scenario</Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '24px 0' }}>
                    <Text type="secondary">Select a scenario or create a new one</Text>
                  </div>
                )}
              </div>
            </div>
          )}
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default AIPolicyAdvisor;
