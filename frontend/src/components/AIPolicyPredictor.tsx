import React, { useState } from 'react';
import { Card, Slider, Button, Alert, Spin, Typography } from 'antd';
import { ThunderboltOutlined, BulbOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const AIPolicyPredictor = () => {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [policyParams, setPolicyParams] = useState({
    taxRate: 20,
    healthcareSpend: 30,
    educationSpend: 25,
    infrastructureSpend: 25
  });

  const predictImpact = async () => {
    setLoading(true);
    // Simulate API call to AI model
    setTimeout(() => {
      const impactScore = Math.min(
        100,
        50 + 
        (policyParams.healthcareSpend * 0.5) + 
        (policyParams.educationSpend * 0.6) + 
        (policyParams.infrastructureSpend * 0.7) -
        (policyParams.taxRate * 0.3)
      );
      
      setPrediction({
        score: Math.round(impactScore),
        summary: generateSummary(impactScore, policyParams)
      });
      setLoading(false);
    }, 1500);
  };

  const generateSummary = (score, params) => {
    if (score > 80) return "Exceptional impact expected! This policy could significantly boost economic growth and social welfare.";
    if (score > 60) return "Strong positive impact projected. This policy shows great potential for economic and social benefits.";
    if (score > 40) return "Moderate impact expected. Consider adjusting parameters to enhance outcomes.";
    return "Limited impact projected. We recommend revising the policy parameters for better results.";
  };

  const handleSliderChange = (key, value) => {
    setPolicyParams(prev => ({
      ...prev,
      [key]: value
    }));
    setPrediction(null);
  };

  const getScoreColor = (score) => {
    if (!score) return '';
    if (score > 80) return '#52c41a';
    if (score > 60) return '#1890ff';
    if (score > 40) return '#faad14';
    return '#ff4d4f';
  };

  return (
    <Card 
      title={
        <div className="flex items-center">
          <ThunderboltOutlined className="mr-2" />
          <span>AI Policy Impact Predictor</span>
        </div>
      }
      className="shadow-lg"
    >
      <div className="space-y-6">
        <Alert 
          message="Adjust the sliders to simulate different policy scenarios and predict their impact."
          type="info"
          showIcon
          className="mb-4"
        />
        
        <div className="space-y-6">
          <div>
            <Text strong>Tax Rate: {policyParams.taxRate}%</Text>
            <Slider 
              min={0} 
              max={50} 
              value={policyParams.taxRate} 
              onChange={(v) => handleSliderChange('taxRate', v)}
              trackStyle={{ backgroundColor: '#1890ff' }}
            />
          </div>
          
          <div>
            <Text strong>Healthcare Spending: ${policyParams.healthcareSpend}B</Text>
            <Slider 
              min={0} 
              max={100} 
              value={policyParams.healthcareSpend} 
              onChange={(v) => handleSliderChange('healthcareSpend', v)}
              trackStyle={{ backgroundColor: '#52c41a' }}
            />
          </div>
          
          <div>
            <Text strong>Education Budget: ${policyParams.educationSpend}B</Text>
            <Slider 
              min={0} 
              max={100} 
              value={policyParams.educationSpend} 
              onChange={(v) => handleSliderChange('educationSpend', v)}
              trackStyle={{ backgroundColor: '#722ed1' }}
            />
          </div>
          
          <div>
            <Text strong>Infrastructure Investment: ${policyParams.infrastructureSpend}B</Text>
            <Slider 
              min={0} 
              max={100} 
              value={policyParams.infrastructureSpend} 
              onChange={(v) => handleSliderChange('infrastructureSpend', v)}
              trackStyle={{ backgroundColor: '#13c2c2' }}
            />
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button 
            type="primary" 
            size="large" 
            icon={<BulbOutlined />} 
            onClick={predictImpact}
            loading={loading}
            className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 hover:shadow-lg transform hover:scale-105 transition-all"
          >
            Predict Policy Impact
          </Button>
        </div>
        
        {loading && (
          <div className="text-center py-8">
            <Spin size="large" />
            <p className="mt-4 text-gray-600">Analyzing policy impact with AI...</p>
          </div>
        )}
        
        {prediction && !loading && (
          <div 
            className="p-6 rounded-lg mt-6 text-center transition-all duration-500 transform hover:scale-[1.01]"
            style={{ 
              background: `linear-gradient(135deg, ${getScoreColor(prediction.score)}20, #ffffff)`,
              border: `1px solid ${getScoreColor(prediction.score)}40`
            }}
          >
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold"
              style={{ 
                background: `linear-gradient(135deg, ${getScoreColor(prediction.score)}, ${getScoreColor(prediction.score)}80)`,
                color: 'white',
                boxShadow: `0 4px 12px ${getScoreColor(prediction.score)}40`
              }}
            >
              {prediction.score}
            </div>
            <Title level={4} style={{ color: getScoreColor(prediction.score) }}>
              {prediction.score > 60 ? 'High Impact' : prediction.score > 40 ? 'Moderate Impact' : 'Low Impact'}
            </Title>
            <p className="text-gray-700">{prediction.summary}</p>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Text type="secondary" className="text-sm">
                <BulbOutlined className="mr-1" />
                Tip: {prediction.score > 60 
                  ? 'This policy is well-balanced! Consider implementing it.' 
                  : 'Try increasing education or infrastructure spending for better results.'}
              </Text>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AIPolicyPredictor;
