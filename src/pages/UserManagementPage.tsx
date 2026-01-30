import { MailOutlined, SafetyCertificateOutlined, SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, message, Modal, Pagination, Select, Space, Table, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { authApi, userApi } from '../api/services';

const { Title, Text } = Typography;
const { Option } = Select;

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const [inviteResult, setInviteResult] = useState<any>(null);
  const [form] = Form.useForm();

  const fetchUsers = async (pageNumber: number, searchKeyword: string = '') => {
    setLoading(true);
    try {
      const { data } = await userApi.getUsers(pageNumber, searchKeyword);
      setUsers(data.users);
      setTotalPages(data.pages);
      setPage(data.page);
    } catch (error) {
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page, keyword);
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    fetchUsers(1, keyword);
  };

  const handleInvite = async (values: any) => {
    setLoading(true);
    try {
      const { data } = await authApi.invite(values);
      setInviteResult(data);
      message.success('Invite generated successfully');
      form.resetFields();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to send invite');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (id: string, role: string) => {
    try {
      await userApi.updateRole(id, role);
      message.success('Role updated');
      fetchUsers(page, keyword);
    } catch (error) {
      message.error('Failed to update role');
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await userApi.updateStatus(id, status);
      message.success('Status updated');
      fetchUsers(page, keyword);
    } catch (error) {
      message.error('Failed to update status');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text strong>{text || 'Invited'}</Text>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string, record: any) => (
        <Select
          value={role}
          onChange={(val) => handleUpdateRole(record._id, val)}
          style={{ width: 120 }}
          bordered={false}
          className="bg-gray-50 dark:bg-gray-800 rounded-md"
        >
          <Option value="ADMIN">ADMIN</Option>
          <Option value="MANAGER">MANAGER</Option>
          <Option value="STAFF">STAFF</Option>
        </Select>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: any) => (
        <Select
          value={status}
          onChange={(val) => handleUpdateStatus(record._id, val)}
          bordered={false}
          className={`${status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'} font-medium bg-gray-50 dark:bg-gray-800 rounded-md`}
        >
          <Option value="ACTIVE">ACTIVE</Option>
          <Option value="INACTIVE">INACTIVE</Option>
        </Select>
      ),
    },
    {
      title: 'Joined At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <Title level={3} className="!mb-0">User Management</Title>
        <Space wrap>
          <Input
            placeholder="Search users..."
            prefix={<SearchOutlined />}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onPressEnter={handleSearch}
            className="w-64"
          />
          <Button type="primary" onClick={handleSearch}>Search</Button>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => {
              setIsInviteModalVisible(true);
              setInviteResult(null);
            }}
          >
            Invite User
          </Button>
        </Space>
      </div>

      <Card className="shadow-sm border-none rounded-xl overflow-hidden">
        <Table
          columns={columns}
          dataSource={users}
          loading={loading}
          rowKey="_id"
          pagination={false}
        />
        <div className="flex justify-end p-4 border-t border-gray-100">
          <Pagination
            current={page}
            total={totalPages * 10}
            onChange={(p) => setPage(p)}
            showSizeChanger={false}
          />
        </div>
      </Card>

      <Modal
        title="Invite a New User"
        open={isInviteModalVisible}
        onCancel={() => setIsInviteModalVisible(false)}
        footer={null}
      >
        {!inviteResult ? (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleInvite}
            initialValues={{ role: 'STAFF' }}
          >
            <Form.Item
              name="email"
              label="User Email"
              rules={[
                { required: true, message: 'Please enter email' },
                { type: 'email', message: 'Invalid email' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="user@example.com" />
            </Form.Item>
            <Form.Item
              name="role"
              label="Assign Role"
              rules={[{ required: true }]}
            >
              <Select prefix={<SafetyCertificateOutlined />}>
                <Option value="ADMIN">ADMIN</Option>
                <Option value="MANAGER">MANAGER</Option>
                <Option value="STAFF">STAFF</Option>
              </Select>
            </Form.Item>
            <Form.Item className="mb-0 flex justify-end">
              <Space>
                <Button onClick={() => setIsInviteModalVisible(false)}>Cancel</Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Generate Invite
                </Button>
              </Space>
            </Form.Item>
          </Form>
        ) : (
          <div className="py-4 text-center">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-xl mb-6 border border-blue-100 dark:border-blue-800 shadow-sm">
              <Text strong className="block mb-3 text-lg text-blue-900 dark:text-blue-100">Invitation Link Generated!</Text>
              <div className="bg-white dark:bg-black/40 p-3 rounded border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <Text code copyable className="text-sm break-all text-gray-800 dark:text-gray-200 w-full mr-2">
                  {inviteResult.inviteUrl}
                </Text>
              </div>
            </div>
            <Text type="secondary" className="block mb-6">
              Share this link with the user. They can use it to complete their registration.
            </Text>
            <Button type="primary" onClick={() => setIsInviteModalVisible(false)} className="w-full h-11">
              Done
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserManagementPage;
