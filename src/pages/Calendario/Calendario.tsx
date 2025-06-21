import React, { useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import Header from '../../components/Header';
import './Calendario.css';


const Calendario: React.FC = () => {
  const calendarRef = useRef(null);

  const eventos = [
    {
      title: 'Sesión Terapia Felipe',
      start: '2025-05-26T08:00:00',
      end: '2025-05-26T09:00:00',
      color: '#007bff',
    },
    {
      title: 'Sesión Terapia Juan',
      start: '2025-05-27T10:00:00',
      end: '2025-05-27T11:00:00',
      color: '#28a745',
    },
  ];

  return (
    <div className="calendario-wrapper">
      <div className="header-fullwidth">
        <Header />
      </div>

      <main className="calendario-content">
        <div className="calendario-container">
          <FullCalendar
            locale={esLocale}
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            slotMinTime="10:00:00"
            slotMaxTime="17:00:00"
            allDaySlot={false}
            editable={false}
            selectable={true}
            events={eventos}
            height="auto"
          />
        </div>
      </main>
    </div>
  );
};

export default Calendario;