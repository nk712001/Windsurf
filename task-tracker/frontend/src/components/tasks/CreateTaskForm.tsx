import React from 'react';
import { Form, Input } from 'antd';
import type { FormInstance } from 'antd/es/form';

interface CreateTaskFormProps {
  form: FormInstance;
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ form }) => {
  return (
    <Form form={form} layout="vertical" name="create_task_form">
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
    </Form>
  );
};

export default CreateTaskForm;
