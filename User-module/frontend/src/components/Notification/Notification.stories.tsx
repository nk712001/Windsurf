import React from 'react';
import { Notification } from './Notification';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Notification> = {
  title: 'Components/Notification',
  component: Notification,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Notification>;

export const Default: Story = {
  args: {
    message: 'Hello!',
    description: 'This is a notification.',
  },
};
