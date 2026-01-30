import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, message, Modal, Pagination, Select, Space, Table, Tag, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { projectApi } from '../api/services';
import type { RootState } from '../store';

const { Title } = Typography;
const { confirm } = Modal;
const { Option } = Select;

const ProjectManagementPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [form] = Form.useForm();

  const isAdmin = user?.role === 'ADMIN';

  const fetchProjects = async (pageNumber: number, searchKeyword: string = '') => {
    setLoading(true);
    try {
      const { data } = await projectApi.getProjects(pageNumber, searchKeyword);
      setProjects(data.projects);
      setTotalPages(data.pages);
      setPage(data.page);
    } catch (error) {
      message.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(page, keyword);
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    fetchProjects(1, keyword);
  };

  const handleCreateOrUpdate = async (values: any) => {
    try {
      if (editingProject) {
        await projectApi.updateProject(editingProject._id, values);
        message.success('Project updated successfully');
      } else {
        await projectApi.createProject(values);
        message.success('Project created successfully');
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingProject(null);
      fetchProjects(page, keyword);
    } catch (error) {
      message.error('Operation failed');
    }
  };

  const showDeleteConfirm = (id: string) => {
    confirm({
      title: 'Are you sure you want to delete this project?',
      icon: <ExclamationCircleOutlined />,
      content: 'This will perform a soft delete.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await projectApi.deleteProject(id);
          message.success('Project deleted');
          fetchProjects(page, keyword);
        } catch (error) {
          message.error('Delete failed');
        }
      },
    });
  };

  const columns = [
    {
      title: 'Project Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
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
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="middle">
          {isAdmin && (
            <>
              <Button
                type="text"
                icon={<EditOutlined style={{ color: '#1677ff' }} />}
                onClick={() => {
                  setEditingProject(record);
                  form.setFieldsValue(record);
                  setIsModalVisible(true);
                }}
              />
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => showDeleteConfirm(record._id)}
              />
            </>
          )}
          {!isAdmin && <span className="text-gray-400 text-xs italic">View Only</span>}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <Title level={3} className="!mb-0">Project Management</Title>
        <Space wrap>
          <Input
            placeholder="Search projects..."
            prefix={<SearchOutlined />}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onPressEnter={handleSearch}
            className="w-64"
          />
          <Button type="primary" onClick={handleSearch}>Search</Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingProject(null);
              form.resetFields();
              setIsModalVisible(true);
            }}
          >
            New Project
          </Button>
        </Space>
      </div>

      <Card className="shadow-sm border-none rounded-xl overflow-hidden">
        <Table
          columns={columns}
          dataSource={projects}
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
        title={editingProject ? 'Edit Project' : 'Create New Project'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingProject(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateOrUpdate}
          initialValues={{ status: 'ACTIVE' }}
        >
          <Form.Item
            name="name"
            label="Project Name"
            rules={[{ required: true, message: 'Please enter project name' }]}
          >
            <Input placeholder="E.g. Website Redesign" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input.TextArea rows={4} placeholder="Describe the project goals..." />
          </Form.Item>
          {editingProject && (
            <Form.Item name="status" label="Status">
              <Select>
                <Option value="ACTIVE">ACTIVE</Option>
                <Option value="ARCHIVED">ARCHIVED</Option>
              </Select>
            </Form.Item>
          )}
          <Form.Item className="mb-0 flex justify-end">
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {editingProject ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectManagementPage;
