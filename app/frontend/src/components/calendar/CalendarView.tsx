import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { DateSelectArg, EventClickArg } from '@fullcalendar/core';
import { Box, useTheme } from '@mui/material';
import { Booking } from '../../types/booking.types';
import { useRef } from 'react';

export interface CalendarViewProps {
  bookings: Booking[];
  workHours: { start: string; end: string };
  onSlotSelect?: (start: Date, end: Date) => void;
  onEventClick?: (booking: Booking) => void;
  disabled?: boolean;
}

export const CalendarView = ({
  bookings,
  workHours,
  onSlotSelect,
  onEventClick,
  disabled = false,
}: CalendarViewProps) => {
  const theme = useTheme();
  const calendarRef = useRef<FullCalendar>(null);

  const events = bookings.map((booking) => ({
    id: booking.id,
    title: booking.title,
    start: booking.start,
    end: booking.end,
    extendedProps: {
      organizer: booking.organizer,
    },
    backgroundColor: theme.palette.primary.main,
    borderColor: theme.palette.primary.dark,
  }));

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    if (!disabled && onSlotSelect) {
      onSlotSelect(selectInfo.start, selectInfo.end);
      selectInfo.view.calendar.unselect();
    }
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    if (onEventClick) {
      const booking = bookings.find((b) => b.id === clickInfo.event.id);
      if (booking) {
        onEventClick(booking);
      }
    }
  };

  return (
    <Box
      sx={{
        '& .fc': {
          backgroundColor: 'white',
          borderRadius: { xs: 3, md: 4 },
          p: { xs: 1.5, sm: 2, md: 3 },
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          border: '1px solid',
          borderColor: 'grey.200',
        },
        '& .fc-toolbar': {
          marginBottom: { xs: 2, sm: 2.5, md: 3 },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1.5, sm: 0 },
        },
        '& .fc-toolbar-chunk': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: { xs: 'center', sm: 'flex-start' },
          gap: { xs: 0.5, sm: 0 },
        },
        '& .fc-toolbar-title': {
          fontSize: { xs: '1.125rem', sm: '1.5rem', md: '1.75rem' },
          fontWeight: 700,
          color: '#003D52',
        },
        '& .fc-button': {
          textTransform: 'none',
          borderRadius: '10px',
          fontWeight: 600,
          border: 'none',
          padding: { xs: '6px 12px', sm: '8px 16px' },
          fontSize: { xs: '0.8125rem', sm: '0.875rem' },
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0, 61, 82, 0.3)',
          },
        },
        '& .fc-button-primary': {
          backgroundColor: '#003D52',
          '&:not(:disabled):hover': {
            backgroundColor: '#002A39',
          },
          '&:disabled': {
            backgroundColor: '#9ca3af',
            opacity: 0.6,
          },
        },
        '& .fc-button-active': {
          backgroundColor: '#002A39 !important',
          boxShadow: '0 0 0 3px rgba(0, 61, 82, 0.2)',
        },
        '& .fc-col-header-cell': {
          padding: { xs: '8px 0', sm: '12px 0' },
          fontWeight: 600,
          textTransform: 'uppercase',
          fontSize: { xs: '0.65rem', sm: '0.75rem' },
          letterSpacing: '0.5px',
          color: 'text.secondary',
          backgroundColor: 'grey.50',
        },
        '& .fc-timegrid-slot': {
          height: { xs: '2.5em', sm: '3em' },
          borderColor: 'grey.100',
        },
        '& .fc-timegrid-slot-label': {
          fontWeight: 500,
          color: 'text.secondary',
          fontSize: { xs: '0.7rem', sm: '0.75rem' },
        },
        '& .fc-event': {
          cursor: disabled ? 'default' : 'pointer',
          border: 'none',
          borderRadius: { xs: '6px', sm: '8px' },
          padding: { xs: '3px 6px', sm: '4px 8px' },
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            transform: disabled ? 'none' : 'scale(1.02)',
            boxShadow: disabled ? '0 2px 4px rgba(0, 0, 0, 0.1)' : '0 4px 12px rgba(0, 61, 82, 0.4)',
          },
        },
        '& .fc-timegrid-now-indicator-line': {
          borderColor: '#ef4444',
          borderWidth: '2px',
        },
        '& .fc-timegrid-now-indicator-arrow': {
          borderColor: '#ef4444',
        },
        '& .fc-day-today': {
          backgroundColor: 'rgba(0, 61, 82, 0.03) !important',
        },
        opacity: disabled ? 0.6 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
      }}
    >
      <FullCalendar
        ref={calendarRef}
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridWeek,timeGridDay',
        }}
        events={events}
        editable={false}
        selectable={!disabled}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        nowIndicator={true}
        slotMinTime={workHours.start}
        slotMaxTime={workHours.end}
        allDaySlot={false}
        height="auto"
        select={handleDateSelect}
        eventClick={handleEventClick}
        slotDuration="00:30:00"
        slotLabelInterval="01:00:00"
        eventContent={(eventInfo) => (
          <Box sx={{ p: { xs: 0.25, sm: 0.5 } }}>
            <Box sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
              {eventInfo.event.title}
            </Box>
            {eventInfo.event.extendedProps.organizer && (
              <Box sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' }, opacity: 0.9 }}>
                {eventInfo.event.extendedProps.organizer}
              </Box>
            )}
          </Box>
        )}
      />
    </Box>
  );
};

