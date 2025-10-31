import React, { useState, useEffect } from 'react';
import { Card, List, Typography, Tag, Button, Avatar, Badge, Tabs } from 'antd';
import { 
  RiseOutlined, 
  FallOutlined, 
  LineChartOutlined, 
  DollarOutlined, 
  UserOutlined,
  MessageOutlined,
  ShareAltOutlined,
  LikeOutlined,
  CommentOutlined,
  FileTextOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface EconomicEvent {
  id: string;
  type: 'market' | 'policy' | 'indicator' | 'discussion';
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  timestamp: string;
  source: string;
  likes: number;
  comments: number;
  author: {
    name: string;
    avatar?: string;
    role?: string;
  };
  tags?: string[];
  change?: number;
}

const LiveEconomicFeed: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<{tag: string; count: number}[]>([]);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      // Mock data - in a real app, this would come from your API
      const mockEvents: EconomicEvent[] = [
        {
          id: '1',
          type: 'policy',
          title: 'New Climate Policy Announced',
          description: 'Government introduces ambitious carbon reduction targets for 2030, aiming for 50% reduction in emissions.',
          impact: 'positive',
          timestamp: '2025-10-31T10:30:00Z',
          source: 'Ministry of Environment',
          likes: 1243,
          comments: 89,
          author: {
            name: 'Eco Policy Watch',
            role: 'Verified Account',
            avatar: 'https://randomuser.me/api/portraits/lego/1.jpg'
          },
          tags: ['climate', 'policy', 'sustainability'],
          change: 2.4
        },
        {
          id: '2',
          type: 'market',
          title: 'Stock Market Reacts to Policy Changes',
          description: 'Renewable energy stocks surge 5.2% following new climate policy announcement.',
          impact: 'positive',
          timestamp: '2025-10-31T10:45:00Z',
          source: 'Financial Times',
          likes: 876,
          comments: 42,
          author: {
            name: 'Market Insights',
            role: 'Financial Analyst',
            avatar: 'https://randomuser.me/api/portraits/lego/3.jpg'
          },
          tags: ['stocks', 'renewables', 'market'],
          change: 5.2
        },
        {
          id: '3',
          type: 'indicator',
          title: 'Unemployment Rate Drops',
          description: 'National unemployment rate falls to 3.8%, the lowest in a decade.',
          impact: 'positive',
          timestamp: '2025-10-31T09:15:00Z',
          source: 'Bureau of Labor Statistics',
          likes: 2345,
          comments: 176,
          author: {
            name: 'Economic Indicators',
            role: 'Official Account',
            avatar: 'https://randomuser.me/api/portraits/lego/5.jpg'
          },
          tags: ['employment', 'economy'],
          change: -0.4
        },
        {
          id: '4',
          type: 'discussion',
          title: 'Discussion: Universal Basic Income',
          description: 'Experts debate the potential economic impacts of implementing a nationwide UBI program.',
          impact: 'neutral',
          timestamp: '2025-10-30T14:20:00Z',
          source: 'Policy Pulse Community',
          likes: 543,
          comments: 231,
          author: {
            name: 'Policy Enthusiast',
            avatar: 'https://randomuser.me/api/portraits/lego/7.jpg'
          },
          tags: ['UBI', 'social policy', 'discussion']
        }
      ];

      const mockTrendingTopics = [
        { tag: 'ClimatePolicy', count: 12400 },
        { tag: 'RenewableEnergy', count: 8900 },
        { tag: 'UBI', count: 7600 },
        { tag: 'StockMarket', count: 5400 },
        { tag: 'EconomicGrowth', count: 4300 }
      ];

      setEvents(mockEvents);
      setTrendingTopics(mockTrendingTopics);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive':
        return <RiseOutlined style={{ color: '#52c41a' }} />;
      case 'negative':
        return <FallOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return <LineChartOutlined style={{ color: '#1890ff' }} />;
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'market':
        return <DollarOutlined style={{ color: '#52c41a' }} />;
      case 'policy':
        return <FileTextOutlined style={{ color: '#1890ff' }} />;
      case 'indicator':
        return <LineChartOutlined style={{ color: '#722ed1' }} />;
      default:
        return <MessageOutlined />;
    }
  };

  const filteredEvents = activeTab === 'all' 
    ? events 
    : events.filter(event => event.type === activeTab);

  return (
    <Card 
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Live Economic Feed</span>
          <Button type="link" size="small">View All</Button>
        </div>
      }
      bodyStyle={{ padding: 0 }}
    >
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        tabBarExtraContent={
          <div style={{ padding: '0 16px' }}>
            <Text type="secondary">Trending: </Text>
            {trendingTopics.slice(0, 3).map((topic, index) => (
              <Tag key={index} color="blue" style={{ marginRight: 8, cursor: 'pointer' }}>
                #{topic.tag}
              </Tag>
            ))}
          </div>
        }
      >
        <TabPane tab="All" key="all" />
        <TabPane tab="Policies" key="policy" />
        <TabPane tab="Markets" key="market" />
        <TabPane tab="Indicators" key="indicator" />
        <TabPane tab="Discussions" key="discussion" />
      </Tabs>

      <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
        <List
          itemLayout="vertical"
          loading={loading}
          dataSource={filteredEvents}
          renderItem={(event) => (
            <List.Item
              key={event.id}
              style={{ 
                padding: '16px 24px',
                borderBottom: '1px solid #f0f0f0',
                backgroundColor: '#fff',
                transition: 'all 0.3s',
                ':hover': {
                  backgroundColor: '#fafafa',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }
              }}
            >
              <List.Item.Meta
                avatar={
                  <Badge 
                    count={getImpactIcon(event.impact)}
                    offset={[-5, 40]}
                  >
                    <Avatar 
                      src={event.author.avatar} 
                      icon={!event.author.avatar && <UserOutlined />}
                      style={{ backgroundColor: '#1890ff' }}
                    />
                  </Badge>
                }
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{event.title}</span>
                    {event.change !== undefined && (
                      <Tag 
                        color={event.change >= 0 ? 'green' : 'red'}
                        icon={event.change >= 0 ? <RiseOutlined /> : <FallOutlined />}
                      >
                        {Math.abs(event.change)}%
                      </Tag>
                    )}
                  </div>
                }
                description={
                  <>
                    <div style={{ marginBottom: 8 }}>
                      <Text type="secondary">
                        {new Date(event.timestamp).toLocaleString()} • {event.source}
                      </Text>
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <Text>{event.description}</Text>
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                      {event.tags?.map((tag, index) => (
                        <Tag key={index} color="blue">#{tag}</Tag>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 16 }}>
                      <Button type="text" icon={<LikeOutlined />} size="small">
                        {event.likes.toLocaleString()}
                      </Button>
                      <Button type="text" icon={<CommentOutlined />} size="small">
                        {event.comments.toLocaleString()}
                      </Button>
                      <Button type="text" icon={<ShareAltOutlined />} size="small">
                        Share
                      </Button>
                    </div>
                  </>
                }
              />
            </List.Item>
          )}
        />
      </div>

      <div style={{ padding: '16px 24px', borderTop: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text type="secondary">
            Last updated: {new Date().toLocaleTimeString()}
          </Text>
          <Button type="link">Load more</Button>
        </div>
      </div>
    </Card>
  );
};

export default LiveEconomicFeed;
