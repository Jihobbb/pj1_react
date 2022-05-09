import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FullCalendar, { formatDate } from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import InputInfo from './InputInfo'
import './Calendar.css'



const Calendar = () => {

  const [modal_state, setModal_state] = useState(false);
  const [startStr, setStartStr] = useState("");
  const [endStr, setEndStr] = useState("");
  const [user, setUser] = useState([]);


  let str = formatDate(new Date(), {
    month: 'long',
    year: 'numeric',
    day: 'numeric',
  });


  const getdata = async () => {
    const response = await axios.get('http://localhost:8081/api/planList');

    setUser(response.data);
    console.log(response.data)
  };

  useEffect(() => {    
    getdata();
  }, []);

  // axios
  //   .get('http://localhost:8081/api/planList')
  //   .then((Response) => {
  //     console.log('res', Response);
  //   })
  //   .catch((Error) => {
  //     console.log('getError', Error);
  //   });

  // const handleDateSelect = (selectInfo) => {
  //   let title = prompt('일정 :');
  //   // title 값이 있을때, 화면에 calendar.addEvent() json형식으로 일정을 추가
  //   let calendarApi = selectInfo.view.calendar;
  //   calendarApi.unselect(); // clear date selection
  //   // alert('Date: ' + selectInfo.dateStr); // 선택날짜
  //   if (title) {
  //     calendarApi.addEvent(
  //       axios
  //         .post('http://localhost:8081/api/planSave', {
  //           id: createEventId(),
  //           title: title,
  //           start_time: selectInfo.dateStr,
  //           end_time: selectInfo.dateStr,
  //           allDay: selectInfo.allDay,
  //         })
  //         .then(function (res) {
  //           // 그러면
  //           console.log(res);
  //         })
  //         .catch(function (error) {
  //           //에러
  //           console.log('postError', error);
  //         })
  //     );
  //   }
  //   // change the day's background color just for fun
  //   // info.dayEl.style.backgroundColor = 'red';
  // };


  const handleDateSelect = (selectInfo) => {
    setModal_state(!modal_state);
    setStartStr(selectInfo.startStr);
    setEndStr(selectInfo.endStr);
  }

  const onChange = () => {
    setModal_state(!modal_state);
  }


  const handleEventClick = (clickInfo) => {
    if (window.confirm(`삭제 '${clickInfo.event.title}'`)) {
      axios.delete(`http://localhost:8081/api/planDelete/${clickInfo.event.id}`)
    }
    console.log('handleEventClick', clickInfo);
  };

  function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}


  return (
    <div>
      <InputInfo modal_state = {modal_state}
                 startStr = {startStr}
                 endStr = {endStr}
                 onChange = {onChange}/>

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
        events={user.map(user => ({ id:user.id, title: user.title,  start: user.start_time, end: user.end_time, backgroundColor: user.bgcolor, borderColor: user.bgcolor,}))}
        ///////////////////////////////

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



