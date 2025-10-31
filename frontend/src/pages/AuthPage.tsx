import React, { useState } from 'react';
import { Card, Tabs, Form, Input, Button, Typography, App } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const tabRef = React.useRef<HTMLDivElement>(null);
  
  // Handle tab change with focus management
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    // Move focus to the tab panel for better accessibility
    setTimeout(() => {
      const activePanel = document.querySelector(`[role="tabpanel"][aria-hidden="false"]`);
      if (activePanel) {
        (activePanel as HTMLElement).focus();
      }
    }, 0);
  };
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const { message } = App.useApp();
  
  const onFinishLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      console.log('Login attempt with:', { email: values.email });
      
      // Add input validation
      if (!values.email || !values.password) {
        throw new Error('Please enter both email and password');
      }

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ 
          email: values.email.trim().toLowerCase(),
          password: values.password
        }),
      });
      
      let data;
      try {
        data = await response.json();
      } catch (e) {
        console.error('Failed to parse JSON response:', e);
        throw new Error('Invalid response from server');
      }

      console.log('Login response:', { 
        status: response.status, 
        ok: response.ok, 
        statusText: response.statusText, 
        data 
      });

      if (!response.ok) {
        // If we have a specific error message from the server, use it
        if (data && data.message) {
          throw new Error(data.message);
        }
        throw new Error('Login failed. Please check your credentials and try again.');
      }

      // Check if we got a token in the response
      if (!data.token) {
        console.warn('No token received in login response');
      } else {
        // Store the token in localStorage or context
        localStorage.setItem('token', data.token);
      }
      
      message.success('Login successful!');
      
      // Redirect to dashboard or home page
      window.location.href = '/';
      
    } catch (error) {
      console.error('Login error:', error);
      message.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const onFinishRegister = async (values: { name: string; email: string; password: string; confirm: string }) => {
    setLoading(true);
    try {
      console.log('Registration attempt with:', { email: values.email });
      
      // Add validation
      if (values.password !== values.confirm) {
        throw new Error('Passwords do not match');
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim().toLowerCase(),
          password: values.password
        })
      });
      
      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error('Invalid response from server');
      }

      console.log('Registration response:', { status: response.status, ok: response.ok, statusText: response.statusText, data });

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      message.success('Registration successful! Please log in.');
      
      // Clear the registration form
      registerForm.resetFields();
      
      // Switch to login tab
      setActiveTab('login');
      
      // Auto-fill the login form
      loginForm.setFieldsValue({
        email: values.email.trim().toLowerCase(),
        password: values.password
      });
      
    } catch (error) {
      console.error('Registration error:', error);
      message.error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const items = [
    {
      key: 'login',
      label: 'Login',
      'data-testid': 'login-tab',
      children: (
            <Form
              form={loginForm}
              name="login"
              initialValues={{ remember: true }}
              onFinish={onFinishLogin}
            >
              <Form.Item
                name="email"
                rules={[{ required: true, message: 'Please input your Email!' }, { type: 'email', message: 'Please enter a valid email!' }]}
              >
                <Input prefix={<MailOutlined />} placeholder="Email" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your Password!' }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Password" />
              </Form.Item>
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  style={{ width: '100%' }}
                  loading={loading}
                >
                  {loading ? 'Logging in...' : 'Log in'}
                </Button>
              </Form.Item>
            </Form>
          )
    },
    {
      key: 'register',
      label: 'Register',
      'data-testid': 'register-tab',
      children: (
            <Form
              form={registerForm}
              name="register"
              onFinish={onFinishRegister}
            >
              <Form.Item
                name="name"
                rules={[{ required: true, message: 'Please input your Name!' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Name" />
              </Form.Item>
              <Form.Item
                name="email"
                rules={[{ required: true, message: 'Please input your Email!' }, { type: 'email', message: 'Please enter a valid email!' }]}
              >
                <Input prefix={<MailOutlined />} placeholder="Email" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your Password!' }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Password" />
              </Form.Item>
              <Form.Item
                name="confirm"
                dependencies={['password']}
                hasFeedback
                rules={[
                  { required: true, message: 'Please confirm your Password!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The two passwords that you entered do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                  Register
                </Button>
              </Form.Item>
            </Form>
          )
    }
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
      <Card style={{ width: 400 }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>PolicyPulse</Title>
        <div ref={tabRef}>
          <Tabs 
            activeKey={activeTab}
            onChange={handleTabChange}
            centered
            items={items}
            tabBarGutter={24}
            destroyOnHidden
            renderTabBar={(props, DefaultTabBar) => (
              <DefaultTabBar {...props} style={{ margin: 0 }} />
            )}
          />
        </div>
      </Card>
    </div>
  );
};

export default AuthPage;
