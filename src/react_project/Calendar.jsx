import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FullCalendar, { formatDate } from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import InputInfo from './InputInfo';
import './Calendar.css';

import './Calendar.css';

const Calendar = () => {
  const [modal_state, setModal_state] = useState(false);
  const [startStr, setStartStr] = useState('');
  const [endStr, setEndStr] = useState('');
  const [user, setUser] = useState([]);

  const getdata = async () => {
    const response = await axios.get('http://localhost:8081//api/planList');

    setUser(response.data);
    // console.log(response.data)
  };

  useEffect(() => {
    getdata();
  }, []);

  const handleDateSelect = (selectInfo) => {
    setModal_state(!modal_state);
    setStartStr(selectInfo.startStr);
    setEndStr(selectInfo.endStr);
  };

  const onChange = () => {
    setModal_state(!modal_state);
  };

  const handleEventClick = (clickInfo) => {
    if (window.confirm(`삭제 '${clickInfo.event.id}'`)) {
      axios.delete(
        `http://localhost:8081/api/planDelete/${clickInfo.event.id}`
      );
    }
    window.location.replace('/');

    axios
      .delete('http://localhost:8081/api/planDelete/{id}')
      .then((response) => {
        console.log('response', '삭제 요청 성공');
        if (window.confirm(`삭제 '${clickInfo.event.title}'`)) {
          clickInfo.event.remove();
        }
      })
      .catch(() => {
        console.log('삭제 요청 실패');
      });

    console.log('handleEventClick', clickInfo);
  };

  function renderEventContent(eventInfo) {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </>
    );
  }

  return (
    <div>
      <InputInfo
        modal_state={modal_state}
        startStr={startStr}
        endStr={endStr}
        onChange={onChange}
      />

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        locale='ko'
        businessHours={true} // 주말 색깔 블러 처리
        headerToolbar={{
          left: 'prev',
          center: 'title',
          right: 'today dayGridMonth, timeGridWeek, next',
        }}
        initialView='timeGridWeek'
        ///////////////////////////////

        events={user.map((user) => ({
          id: user.id,
          title: user.title,
          start: user.start_time,
          end: user.end_time,
          backgroundColor: user.bgcolor,
          borderColor: user.bgcolor,
        }))}
        ///////////////////////////////
        events={user.map((user) => ({
          title: user.title,
          start: user.start_time,
          end: user.end_time,
        }))}
        ////////////////////////////////>>>>>>> cc2d698eba137a99f5cf02287905b2a515964157

        eventClick={handleEventClick}
        select={handleDateSelect}
        editable={false} // 수정 ?
        selectable={true} //드래그 가능
        selectMirror={true}
        eventContent={renderEventContent}
        dayMaxEvents={true}
        weekends={false} //주말 볼지 말지
      />
    </div>
  );
};

export default Calendar;
