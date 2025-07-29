import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button/Button';
import { Form } from '../components/Form/Form';
import { Table } from '../components/Table/Table';
// import { Filter } from '../components/Filter/Filter';
import { Notification } from '../components/Notification/Notification';
import { Header } from '../components/Header/Header';
import { useAuth } from '../context/AuthContext';
import { Input, Select } from 'antd';
import styles from './Home.module.css';

import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Modal, message } from 'antd';

const data = [
  { key: '1', name: 'John Doe', email: 'john@example.com', status: 'active', role: 'admin' },
  { key: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'inactive', role: 'user' },
  { key: '3', name: 'Emily Clark', email: 'emily@example.com', status: 'pending', role: 'manager' },
];

const Home: React.FC = () => {
  const [editUser, setEditUser] = useState<any | null>(null);
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [tableData, setTableData] = useState(data);
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();

  // Refs for filter Selects
  const statusSelectRef = useRef<any>(null);
  const roleSelectRef = useRef<any>(null);
  // Refs for add user modal Selects
  const addStatusSelectRef = useRef<any>(null);
  const addRoleSelectRef = useRef<any>(null);

  const onEdit = (user: any) => {
    setEditUser(user);
  };

  const onDelete = (user: any) => {
    Modal.confirm({
      title: 'Delete User',
      content: `Are you sure you want to delete ${user.name}?`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        setTableData((prev: any[]) => prev.filter(u => u.key !== user.key));
        message.success('User deleted');
      },
    });
  };

  const { user, logout } = useAuth();

  const baseColumns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Role', dataIndex: 'role', key: 'role' },
  ];

  const columns = user?.role === 'admin'
    ? [
        ...baseColumns,
        {
          title: 'Action',
          key: 'action',
          render: (_: any, record: any) => (
            <span>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: 8 }}
                title="Edit"
                onClick={() => onEdit(record)}
              >
                <EditOutlined />
              </button>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff4d4f' }}
                title="Delete"
                onClick={() => onDelete(record)}
              >
                <DeleteOutlined />
              </button>
            </span>
          ),
        },
      ]
    : baseColumns;

  const navigate = useNavigate();
  const [filter, setFilter] = useState('');
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [role, setRole] = useState<string | undefined>(undefined);

  const handleLogout = () => {
    logout();
    navigate('/');
  }
  const filteredData = tableData.filter(d => {
    const matchesText = d.name.toLowerCase().includes(filter.toLowerCase()) ||
      d.email.toLowerCase().includes(filter.toLowerCase());
    const matchesStatus = status ? d.status === status : true;
    const matchesRole = role ? d.role === role : true;
    return matchesText && matchesStatus && matchesRole;
  });

  return (
    <>
      <Header user={user
        ? { name: user.firstName || user.name || user.email, email: user.email }
        : { name: "John", email: "john@example.com" }
      } onLogout={handleLogout} />
      <Modal
        open={!!editUser}
        title={editUser ? `Edit User: ${editUser.name}` : ''}
        onCancel={() => setEditUser(null)}
        onOk={() => {
          form
            .validateFields()
            .then((values: { name: string; email: string; status: string; role: string }) => {
              setTableData((prev: any[]) =>
                prev.map(u =>
                  u.key === editUser.key ? { ...u, ...values } : u
                )
              );
              setEditUser(null);
              message.success('User updated');
              form.resetFields();
            });
        }}
        okText="Save"
        cancelText="Cancel"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={editUser || {}}
        >
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Name is required' }]}> 
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Valid email is required' }]}> 
            <Input />
          </Form.Item>
          <Form.Item label="Status" name="status" rules={[{ required: true, message: 'Status is required' }]}> 
            <Select
              options={[
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
                { label: 'Pending', value: 'pending' }
              ]}
              placeholder="Select"
            />
          </Form.Item>
          <Form.Item label="Role" name="role" rules={[{ required: true, message: 'Role is required' }]}> 
            <Select
              options={[
                { label: 'Admin', value: 'admin' },
                { label: 'User', value: 'user' },
                { label: 'Manager', value: 'manager' }
              ]}
              placeholder="Select"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Add User Modal */}
      <Modal
        open={addUserModalOpen}
        title="Add User"
        onCancel={() => {
          setAddUserModalOpen(false);
          addForm.resetFields();
        }}
        onOk={() => {
          addForm
            .validateFields()
            .then((values: { name: string; email: string; status: string; role: string }) => {
              setTableData(prev => [
                ...prev,
                {
                  ...values,
                  key: Date.now().toString(),
                },
              ]);
              setAddUserModalOpen(false);
              addForm.resetFields();
              message.success('User added');
            })
            .catch(() => {/* validation error, don't close modal */});
        }}
        okText="Add"
        cancelText="Cancel"
      >
        <Form
          form={addForm}
          layout="vertical"
          initialValues={{}}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, whitespace: true, message: 'Please enter a name' }]}
            validateTrigger={["onBlur", "onSubmit"]}
          >
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter an email' },
              { type: 'email', message: 'Please enter a valid email address' },
            ]}
            validateTrigger={["onBlur", "onSubmit"]}
          >
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: 'Please select a status' }]}
            validateTrigger={["onBlur", "onSubmit"]}
          >
            <Select
              options={[
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
                { label: 'Pending', value: 'pending' }
              ]}
              placeholder="Select"
            />
          </Form.Item>
          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: 'Please select a role' }]}
            validateTrigger={["onBlur", "onSubmit"]}
          >
            <Select
              options={[
                { label: 'Admin', value: 'admin' },
                { label: 'User', value: 'user' },
                { label: 'Manager', value: 'manager' }
              ]}
              placeholder="Select"
            />
          </Form.Item>
        </Form>
      </Modal>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
        <h2 className={styles.filterLabel}>Filter</h2>
        <div className={styles.filterSection}>
          <Input
            className={styles.filterInput}
            placeholder="Search users..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            allowClear
          />
          <Select
            className={styles.filterSelect}
            placeholder={"Select"}
            value={status}
            onChange={(value) => {
              setStatus(value);
              statusSelectRef.current && statusSelectRef.current.blur && statusSelectRef.current.blur();
            }}
            allowClear
            options={[
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
              { label: 'Pending', value: 'pending' }
            ]}
            style={{ minWidth: 120}}
            ref={statusSelectRef}
          />
          <Select
            className={styles.filterSelect}
            placeholder="Select"
            value={role}
            onChange={(value) => {
              setRole(value);
              roleSelectRef.current && roleSelectRef.current.blur && roleSelectRef.current.blur();
            }}
            allowClear
            options={[
              { label: 'Admin', value: 'admin' },
              { label: 'User', value: 'user' },
              { label: 'Manager', value: 'manager' }
            ]}
            style={{ minWidth: 120 }}
            ref={roleSelectRef}
          />
          {(user?.role === 'admin' || user?.role === 'manager') && (
            <Button type="primary" className={styles.addUserButton} onClick={() => setAddUserModalOpen(true)}>
              Add User
            </Button>
          )}
        </div>
        <h2 className={styles.tableLabel}>Table</h2>
        <div className={styles.tableContainer}>
          <Table
            className={styles.fullWidthTable}
            columns={columns}
            dataSource={filteredData}
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              showQuickJumper: true,
            }}
          />
        </div>
        <Notification message="User created successfully!" description="A new user has been successfully created." />
      </div>
    </>
  );
};

export default Home;
