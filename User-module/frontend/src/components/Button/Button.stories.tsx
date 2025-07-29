import React from 'react';
import { Button } from './Button';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    type: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    type: 'default',
    children: 'Secondary Button',
  },
};
