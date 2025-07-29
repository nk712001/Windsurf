import React from 'react';
import { Table as AntTable, TableProps as AntTableProps } from 'antd';
import styled from 'styled-components';

const TableWrapper = styled.div`
  /* Responsive styles can be added here */
`;

export type TableProps<T> = AntTableProps<T>;

export function Table<T extends object>(props: TableProps<T>) {
  return (
    <TableWrapper>
      <AntTable {...props} />
    </TableWrapper>
  );
}
