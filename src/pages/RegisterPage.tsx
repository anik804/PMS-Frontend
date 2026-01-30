import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, message, Result, Spin, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '../api/services';
import { setCredentials } from '../store/authSlice';

const { Title, Text } = Typography;

const RegisterPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [inviteData, setInviteData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError('No invite token provided. Please use the link from your invitation email.');
        setValidating(false);
        return;
      }

      try {
        const { data } = await authApi.validateInvite(token);
        setInviteData(data);
      } catch (error: any) {
        setError(error.response?.data?.message || 'Invalid or expired invite token.');
      } finally {
        setValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const { data } = await authApi.registerViaInvite({
        token,
        name: values.name,
        password: values.password,
      });
      dispatch(setCredentials(data));
      message.success('Registration successful!');
      navigate('/dashboard');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spin size="large" tip="Validating invitation..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Result
          status="error"
          title="Invitation Invalid"
          subTitle={error}
          extra={[
            <Button type="primary" key="login" onClick={() => navigate('/login')}>
              Go to Login
            </Button>
          ]}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center mb-8">
          <Title level={2} className="!text-gray-900 dark:!text-white">Complete Registration</Title>
          <Text className="!text-gray-600 dark:!text-gray-400">Welcome to ProManage! Please set up your account details.</Text>
        </div>

        <Card className="shadow-2xl rounded-2xl border-none w-full overflow-hidden bg-white dark:bg-gray-800">
          <Form
            name="register"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            className="p-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item label={<span className="text-gray-700 dark:text-gray-300 font-medium">Email Address</span>} className="mb-4">
                <Input
                  prefix={<MailOutlined className="text-gray-400" />}
                  value={inviteData?.email}
                  disabled
                  className="bg-gray-50 dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 disabled:bg-gray-100 disabled:text-gray-500"
                />
              </Form.Item>

              <Form.Item label={<span className="text-gray-700 dark:text-gray-300 font-medium">Role</span>} className="mb-4">
                <Input
                  value={inviteData?.role}
                  disabled
                  className="bg-gray-50 dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 disabled:bg-gray-100 disabled:text-gray-500"
                />
              </Form.Item>
            </div>

            <Form.Item
              name="name"
              label={<span className="text-gray-700 dark:text-gray-300 font-medium">Full Name</span>}
              rules={[{ required: true, message: 'Please input your full name!' }]}
              className="mb-4"
            >
              <Input
                prefix={<UserOutlined className="text-blue-500" />}
                placeholder="Enter your full name"
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 hover:border-blue-500 focus:border-blue-500"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span className="text-gray-700 dark:text-gray-300 font-medium">Password</span>}
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'Password must be at least 6 characters!' }
              ]}
              className="mb-4"
            >
              <Input.Password
                prefix={<LockOutlined className="text-blue-500" />}
                placeholder="Create a password"
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 hover:border-blue-500 focus:border-blue-500"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label={<span className="text-gray-700 dark:text-gray-300 font-medium">Confirm Password</span>}
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match!'));
                  },
                }),
              ]}
              className="mb-6"
            >
              <Input.Password
                prefix={<LockOutlined className="text-blue-500" />}
                placeholder="Confirm your password"
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 hover:border-blue-500 focus:border-blue-500"
              />
            </Form.Item>

            <Form.Item className="mb-0">
              <Button type="primary" htmlType="submit" className="w-full h-12 text-lg font-medium shadow-lg hover:shadow-blue-500/50 transition-all" loading={loading}>
                Register Account
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
