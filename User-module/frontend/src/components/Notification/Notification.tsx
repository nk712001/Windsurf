import React from 'react';
import { notification, Button } from 'antd';

export const Notification: React.FC<{ message: string; description?: string }> = ({ message, description }) => {
  React.useEffect(() => {
    notification.open({
      message,
      description,
    });
    // eslint-disable-next-line
  }, []);
  return null;
};
