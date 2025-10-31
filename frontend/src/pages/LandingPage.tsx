import React from 'react';
import { Button, Card, Row, Col, Typography, Space, Steps } from 'antd';
import { ArrowRightOutlined, LineChartOutlined, TeamOutlined, BulbOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

const features = [
  {
    icon: <LineChartOutlined style={{ fontSize: 48, color: '#1890ff' }} />,
    title: "Real-time Policy Simulation",
    description: "Test policy changes and see their economic impact instantly with our advanced simulation engine."
  },
  {
    icon: <TeamOutlined style={{ fontSize: 48, color: '#52c41a' }} />,
    title: "Citizen Impact Analysis",
    description: "Understand how policies affect different demographics and income groups."
  },
  {
    icon: <BulbOutlined style={{ fontSize: 48, color: '#722ed1' }} />,
    title: "Data-Driven Insights",
    description: "Make informed decisions with comprehensive data visualizations and reports."
  }
];

const LandingPage = () => {
  const navigate = useNavigate();

  const handleTrySimulator = () => {
    console.log('Navigating to /app/simulator');
    try {
      navigate('/app/simulator');
      // If navigation doesn't work after a short delay, try full page navigation
      setTimeout(() => {
        if (window.location.pathname === '/') {
          console.log('Client-side navigation failed, trying full page navigation');
          window.location.href = '/app/simulator';
        }
      }, 100);
    } catch (error) {
      console.error('Navigation error:', error);
      window.location.href = '/app/simulator';
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '80px 0' }}>
        <Title level={1} style={{ fontSize: '3.5rem', marginBottom: 16 }}>
          Shape the Future with <span style={{ color: '#1890ff' }}>PolicyPulse</span>
        </Title>
        <Title level={3} type="secondary" style={{ maxWidth: 800, margin: '0 auto 32px' }}>
          Simulate, analyze, and understand the real-world impact of policy decisions before implementation.
        </Title>
        <Space size="large" style={{ marginTop: 32 }}>
          <Button 
            type="primary" 
            size="large" 
            onClick={handleTrySimulator}
            icon={<ArrowRightOutlined />}
          >
            Try Simulator
          </Button>
          <Button 
            size="large"
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Learn More
          </Button>
        </Space>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 0' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 60 }}>Powerful Features for Smarter Policy Making</Title>
        <Row gutter={[32, 48]}>
          {features.map((feature, index) => (
            <Col xs={24} md={8} key={index}>
              <Card 
                hoverable 
                style={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '32px 16px'
                }}
              >
                <div style={{ marginBottom: 24 }}>{feature.icon}</div>
                <Title level={4} style={{ marginBottom: 16 }}>{feature.title}</Title>
                <Text type="secondary">{feature.description}</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* How It Works */}
      <section id="how-it-works" style={{ padding: '80px 0' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 60 }}>How It Works</Title>
        <Steps direction="vertical" current={-1} style={{ maxWidth: 800, margin: '0 auto' }}>
          <Step 
            title="Select a Policy" 
            description="Choose from our library of policy templates or create your own custom policy." 
          />
          <Step 
            title="Adjust Parameters" 
            description="Fine-tune policy details like funding, duration, and target demographics." 
          />
          <Step 
            title="Run Simulation" 
            description="Our AI-powered engine calculates the economic and social impact in real-time." 
          />
          <Step 
            title="Analyze Results" 
            description="Review detailed reports, visualizations, and recommendations." 
          />
        </Steps>
      </section>

      {/* Call to Action */}
      <section style={{ 
        textAlign: 'center', 
        padding: '80px 0',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e6f7ff 100%)',
        borderRadius: 8,
        margin: '80px 0'
      }}>
        <Title level={2} style={{ marginBottom: 24 }}>Ready to Transform Policy Making?</Title>
        <Paragraph style={{ maxWidth: 600, margin: '0 auto 32px' }}>
          Join governments, think tanks, and organizations using PolicyPulse to make data-driven policy decisions.
        </Paragraph>
        <Button 
          type="primary" 
          size="large" 
          onClick={() => navigate('/simulator')}
          icon={<ArrowRightOutlined />}
        >
          Get Started for Free
        </Button>
      </section>
    </div>
  );
};

export default LandingPage;
