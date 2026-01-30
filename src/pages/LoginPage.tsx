import { LockOutlined, ProjectOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Form, Input, message, Typography } from 'antd';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/services';
import { setCredentials } from '../store/authSlice';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const { data } = await authApi.login(values);
      dispatch(setCredentials(data));
      message.success('Login successful');
      navigate('/dashboard');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-full">
              <ProjectOutlined style={{ fontSize: '32px', color: '#1677ff' }} />
            </div>
          </div>
          <Title level={2} className="!text-gray-900 dark:!text-white mb-2">Welcome Back</Title>
          <Text className="!text-gray-500 dark:!text-gray-400 text-base">Sign in to manage your projects</Text>
        </div>

        <Card className="shadow-2xl rounded-2xl border-none w-full overflow-hidden bg-white dark:bg-gray-800">
          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
            size="large"
            className="p-2"
          >
            <Form.Item
              name="email"
              label={<span className="text-gray-700 dark:text-gray-300 font-medium">Email</span>}
              rules={[
                { required: true, message: 'Please input your Email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
              className="mb-4"
            >
              <Input
                prefix={<UserOutlined className="text-blue-500" />}
                placeholder="name@example.com"
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span className="text-gray-700 dark:text-gray-300 font-medium">Password</span>}
              rules={[{ required: true, message: 'Please input your Password!' }]}
              className="mb-6"
            >
              <Input.Password
                prefix={<LockOutlined className="text-blue-500" />}
                placeholder="Enter your password"
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </Form.Item>

            <Form.Item className="mb-6">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Remember me</Checkbox>
              </Form.Item>
            </Form.Item>

            <Form.Item className="mb-4">
              <Button type="primary" htmlType="submit" className="w-full h-12 text-lg font-medium shadow-lg hover:shadow-blue-500/50 transition-all" loading={loading}>
                Log in
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mt-2 pb-2">
            <Text className="!text-gray-500 dark:!text-gray-500 text-sm">
              Don't have an account? <span className="text-blue-600 dark:text-blue-400">Contact your admin.</span>
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
