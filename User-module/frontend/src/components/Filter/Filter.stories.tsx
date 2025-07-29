import React from 'react';
import { Filter } from './Filter';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Filter> = {
  title: 'Components/Filter',
  component: Filter,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Filter>;

export const Default: Story = {
  args: {
    placeholder: 'Filter users...',
  },
};
