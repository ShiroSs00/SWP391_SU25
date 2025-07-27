import React from 'react';
import { useNavigate } from 'react-router-dom';
import EventForm from '../components/EventForm';
import type { AdminEvent } from '../types/admin.types';

interface EventFormWrapperProps {
  event?: AdminEvent;
  onSubmit: (data: any) => Promise<void>;
}

export const EventFormWrapper: React.FC<EventFormWrapperProps> = ({
  event,
  onSubmit
}) => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate('/events');
  };

  const handleSubmit = async (formData: any) => {
    await onSubmit(formData);
  };

  return (
    <EventForm
      event={event}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
};

