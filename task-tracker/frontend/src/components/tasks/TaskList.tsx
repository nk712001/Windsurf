import React, { useState } from 'react';
import { List, Spin, Alert, Button, Modal, Form, Popconfirm } from 'antd';
import { useTasks, type Task } from '../../hooks/useTasks';
import CreateTaskForm from './CreateTaskForm';
import EditTaskForm from './EditTaskForm';

const TaskList: React.FC = () => {
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const { tasks, loading, error, createTask, updateTask, deleteTask } = useTasks();

  const showEditModal = (task: Task) => {
    setEditingTask(task);
    editForm.setFieldsValue(task);
    setIsEditModalVisible(true);
  };

  if (loading) {
    return <Spin tip="Loading tasks..." />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <>
      <List
        header={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Task List</span>
            <Button type="primary" onClick={() => setIsCreateModalVisible(true)}>
              Create Task
            </Button>
          </div>
        }
        bordered
        dataSource={tasks}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => showEditModal(item)}>Edit</Button>,
              <Popconfirm
                title="Delete the task"
                description="Are you sure you want to delete this task?"
                onConfirm={() => deleteTask(item.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="link" danger>Delete</Button>
              </Popconfirm>
            ]}
          >
            <List.Item.Meta
              title={item.title}
              description={item.description || 'No description'}
            />
            <div>{item.status}</div>
          </List.Item>
        )}
      />

      <Modal
        title="Create a new task"
        open={isCreateModalVisible}
        onOk={() => {
          createForm
            .validateFields()
            .then((values) => {
              createForm.resetFields();
              createTask(values);
              setIsCreateModalVisible(false);
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            });
        }}
        onCancel={() => setIsCreateModalVisible(false)}
      >
        <CreateTaskForm form={createForm} />
      </Modal>

      {editingTask && (
        <Modal
          title="Edit task"
          open={isEditModalVisible}
          onOk={() => {
            editForm
              .validateFields()
              .then((values) => {
                updateTask(editingTask.id, values);
                setIsEditModalVisible(false);
                setEditingTask(null);
              })
              .catch((info) => {
                console.log('Validate Failed:', info);
              });
          }}
          onCancel={() => {
            setIsEditModalVisible(false);
            setEditingTask(null);
          }}
        >
          <EditTaskForm form={editForm} />
        </Modal>
      )}
    </>
  );
};

export default TaskList;
