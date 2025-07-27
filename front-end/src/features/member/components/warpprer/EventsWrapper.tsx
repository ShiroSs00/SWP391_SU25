import React from 'react';
import { useNavigate } from 'react-router-dom';
import  EventsPage  from '../../pages/EventsPage';
import { useDashboard } from '../../hooks/useDashboard';

export const EventsWrapper: React.FC = () => {
  const navigate = useNavigate();
  const {
    events,
    loading,
    error,
    loadInitialData,
  } = useDashboard();

  const handleViewEventDetails = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  const handleRegisterEvent = (eventId: string) => {
    navigate(`/events/register/${eventId}`);
  };

  const handleCancelRegistration = (eventId: string) => {
    navigate(`/events/cancel/${eventId}`);
  };

  const handleShareEvent = (eventId: string) => {
    // Logic for sharing event
    console.log('Sharing event:', eventId);
  };

  const handleViewMap = (eventId: string) => {
    navigate(`/events/map/${eventId}`);
  };

  const handleCreateEvent = () => {
    navigate('/events/create');
  };

  const handleViewMyRegistrations = () => {
    navigate('/events/my-registrations');
  };

  const handleFilterEvents = (filterType: string) => {
    navigate(`/events?filter=${filterType}`);
  };

  return (
    <EventsPage
      events={events}
      loading={loading}
      error={error}
      onRetry={loadInitialData}
    //   onViewDetails={handleViewEventDetails}
    //   onRegister={handleRegisterEvent}
    //   onCancelRegistration={handleCancelRegistration}
    //   onShare={handleShareEvent}
    //   onViewMap={handleViewMap}
    //   onCreate={handleCreateEvent}
    //   onViewMyRegistrations={handleViewMyRegistrations}
    //   onFilter={handleFilterEvents}
    />
  );
};