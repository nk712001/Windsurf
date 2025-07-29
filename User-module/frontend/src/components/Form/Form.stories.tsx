import React from 'react';
import { Form } from './Form';
import { Input, Button } from 'antd';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Form> = {
  title: 'Components/Form',
  component: Form,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Form>;

export const Default: Story = {
  render: () => (
    <Form layout="vertical">
      <Form.Item label="Username" name="username" required>
        <Input aria-label="Username" />
      </Form.Item>
      <Form.Item label="Password" name="password" required>
        <Input.Password aria-label="Password" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">Submit</Button>
      </Form.Item>
    </Form>
  ),
};
