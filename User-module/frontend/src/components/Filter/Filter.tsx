import React from 'react';
import { Input } from 'antd';

export interface FilterProps {
  placeholder?: string;
  onChange?: (value: string) => void;
}

export const Filter: React.FC<FilterProps> = ({ placeholder = 'Filter...', onChange }) => {
  return (
    <Input
      aria-label="Filter"
      placeholder={placeholder}
      onChange={e => onChange?.(e.target.value)}
      style={{ maxWidth: 300 }}
    />
  );
};
