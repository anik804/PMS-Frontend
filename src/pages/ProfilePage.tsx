import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, message, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userApi } from '../api/services';
import type { RootState } from '../store';
import { setCredentials } from '../store/authSlice';

const { Title } = Typography;

const ProfilePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, form]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const payload: any = {
        name: values.name,
        email: values.email,
      };

      if (values.newPassword) {
        payload.password = values.newPassword;
      }

      const { data } = await userApi.updateProfile(payload);

      // Update Redux store with new user info while preserving the token
      dispatch(setCredentials({
        ...data,
        token: user?.token
      }));

      message.success('Profile updated successfully');
      form.setFieldValue('newPassword', '');
      form.setFieldValue('confirmNewPassword', '');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Title level={2} className="mb-6 !text-gray-900 dark:!text-white">My Profile</Title>

      <Card className="shadow-lg rounded-xl border-none bg-white dark:bg-gray-800">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          size="large"
          className="p-4"
        >
          <Form.Item
            name="name"
            label={<span className="text-gray-700 dark:text-gray-300 font-medium">Full Name</span>}
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input
              prefix={<UserOutlined className="text-blue-500" />}
              placeholder="Full Name"
              className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label={<span className="text-gray-700 dark:text-gray-300 font-medium">Email Address</span>}
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Invalid email address' }
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="Email"
              className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            />
          </Form.Item>

          <div className="border-t border-gray-200 dark:border-gray-700 my-6 pt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Change Password</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Leave blank if you don't want to change your password.</p>

            <Form.Item
              name="newPassword"
              label={<span className="text-gray-700 dark:text-gray-300 font-medium">New Password</span>}
              rules={[{ min: 6, message: 'Password must be at least 6 characters' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-blue-500" />}
                placeholder="New Password"
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </Form.Item>

            <Form.Item
              name="confirmNewPassword"
              label={<span className="text-gray-700 dark:text-gray-300 font-medium">Confirm New Password</span>}
              dependencies={['newPassword']}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || !getFieldValue('newPassword') || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-blue-500" />}
                placeholder="Confirm New Password"
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </Form.Item>
          </div>

          <Form.Item className="mb-0 flex justify-end">
            <Button type="primary" htmlType="submit" loading={loading} className="px-8 h-10">
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ProfilePage;
