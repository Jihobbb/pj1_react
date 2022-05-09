import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FullCalendar, { formatDate } from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
<<<<<<< HEAD
import InputInfo from './InputInfo'
import "./Calendar.css"

=======
import InputInfo from './InputInfo';
>>>>>>> cc2d698eba137a99f5cf02287905b2a515964157

import './Calendar.css';

const Calendar = () => {
  const [modal_state, setModal_state] = useState(false);
  const [startStr, setStartStr] = useState('');
  const [endStr, setEndStr] = useState('');
  const [user, setUser] = useState([]);

  const getdata = async () => {
    const response = await axios.get('http://localhost:8081//api/planDelete/');

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
<<<<<<< HEAD
    if (window.confirm(`삭제 '${clickInfo.event.id}'`)) {
      axios.delete(`http://localhost:8081/api/planDelete/${clickInfo.event.id}`)
    }
    window.location.replace("/")
=======
    axios
      .delete('http://localhost:8081/api/planDelete/{id}')
      .then((response) => {
        console.log('삭제 요청 성공');
        if (window.confirm(`삭제 '${clickInfo.event.title}'`)) {
          clickInfo.event.remove();
        }
      })
      .catch(() => {
        console.log('삭제 요청 실패');
      });

>>>>>>> cc2d698eba137a99f5cf02287905b2a515964157
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

  // const box = () => {
  //   user.map(user => {
  //     title = user.title,
  //     start = user.start_time,
  //     end = user.end_time
  //   })
  // }

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
<<<<<<< HEAD
        events={user.map(user => ({ id: user.id, title: user.title,  start: user.start_time, end: user.end_time, backgroundColor: user.bgcolor, borderColor: user.bgcolor,}))}
        ///////////////////////////////
=======
        events={user.map((user) => ({
          title: user.title,
          start: user.start_time,
          end: user.end_time,
        }))}
        ////////////////////////////////
>>>>>>> cc2d698eba137a99f5cf02287905b2a515964157

        // events = {{title : 'All Day',
        //         start: '2022-05-10'}}

        // dateClick={handleDateClick} 하루클릭

        // events={[
        //   { title: 'event 1', date: '2022-05-11', start: '2022-05-11T08:00:00+09:00', end:'2022-05-11T11:00:00+09:00'},
        //   { title: 'event 2', date: '2022-05-10'  }
        // ]}

        eventClick={handleEventClick}
        select={handleDateSelect}
        editable={false} // 수정 ?
        selectable={true} //드래그 가능
        selectMirror={true}
        eventContent={renderEventContent}
        // 이벤트명 : function(){} : 각 날짜에 대한 이벤트를 통해 처리할 내용..
        dayMaxEvents={true}
        weekends={false} //주말 볼지 말지
      />
    </div>
  );
};

export default Calendar;
