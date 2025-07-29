import React from 'react';
import { Table } from './Table';
import { Meta, StoryObj } from '@storybook/react';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

const data: DataType[] = [
  { key: '1', name: 'John Brown', age: 32, address: 'New York' },
  { key: '2', name: 'Jim Green', age: 42, address: 'London' },
];

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age' },
  { title: 'Address', dataIndex: 'address', key: 'address' },
];

const meta: Meta<typeof Table<DataType>> = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Table<DataType>>;

export const Default: Story = {
  args: {
    columns,
    dataSource: data,
  },
};
