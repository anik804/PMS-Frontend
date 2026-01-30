import { CheckCircleOutlined, ClockCircleOutlined, ProjectOutlined, UserOutlined } from '@ant-design/icons';
import { Card, Col, message, Row, Space, Statistic, Table, Tag, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { dashboardApi, projectApi } from '../api/services';
import type { RootState } from '../store';

const { Title, Text } = Typography;

const DashboardPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalUsers: 0,
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [projectsRes, statsRes] = await Promise.all([
          projectApi.getProjects(),
          dashboardApi.getStats()
        ]);

        setRecentProjects(projectsRes.data.projects.slice(0, 5));
        setStats(statsRes.data);
      } catch (error) {
        message.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const columns = [
    {
      title: 'Project Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'ACTIVE' ? 'green' : status === 'ARCHIVED' ? 'orange' : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Created By',
      dataIndex: ['createdBy', 'name'],
      key: 'createdBy',
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <Title level={3}>Dashboard Overview</Title>
        <Text type="secondary">Welcome back, {user?.name}. Here's what's happening today.</Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card className="shadow-sm rounded-xl overflow-hidden border-none hover:shadow-md transition-shadow">
            <Statistic
              title="Total Projects"
              value={stats.totalProjects}
              prefix={<ProjectOutlined className="text-blue-500 mr-2" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="shadow-sm rounded-xl overflow-hidden border-none hover:shadow-md transition-shadow">
            <Statistic
              title="Active Projects"
              value={stats.activeProjects}
              prefix={<CheckCircleOutlined className="text-green-500 mr-2" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="shadow-sm rounded-xl overflow-hidden border-none hover:shadow-md transition-shadow">
            <Statistic
              title="Team Members"
              value={stats.totalUsers}
              prefix={<UserOutlined className="text-purple-500 mr-2" />}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title={<Space><ClockCircleOutlined /><span>Recent Projects</span></Space>}
        className="shadow-sm rounded-xl border-none mt-8"
      >
        <Table
          columns={columns}
          dataSource={recentProjects}
          loading={loading}
          pagination={false}
          rowKey="_id"
        />
      </Card>
    </div>
  );
};

export default DashboardPage;
