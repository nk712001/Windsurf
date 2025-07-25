import React from 'react';
import { Form, Input, Select } from 'antd';
import type { FormInstance } from 'antd/es/form';

interface EditTaskFormProps {
  form: FormInstance;
}

const { Option } = Select;

const EditTaskForm: React.FC<EditTaskFormProps> = ({ form }) => {
  return (
    <Form form={form} layout="vertical" name="edit_task_form">
      <Form.Item
        name="title"
        label="Title"
        rules={[{ required: true, message: 'Please input the title of the task!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="description" label="Description">
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item name="status" label="Status">
        <Select placeholder="Select a status">
          <Option value="Not Started">Not Started</Option>
          <Option value="In Progress">In Progress</Option>
          <Option value="Completed">Completed</Option>
          <Option value="Cancelled">Cancelled</Option>
        </Select>
      </Form.Item>
    </Form>
  );
};

export default EditTaskForm;
