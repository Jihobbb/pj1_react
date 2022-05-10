import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FullCalendar, { formatDate } from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import InputInfo from './InputInfo';
import './Calendar.css';
import Modify from './Modify';

const Calendar = () => {
  const [modal_state, setModal_state] = useState(false);
  const [modify_state, setModify_state] = useState(false);
  const [startStr, setStartStr] = useState('');
  const [endStr, setEndStr] = useState('');
  const [user, setUser] = useState([]);

  const [m_title, setM_title] = useState();
  const [m_people, setM_people] = useState();
  const [m_content, setM_content] = useState();
  const [m_bgcolor, setM_bgcolo] = useState();
  const [m_id, setM_id] = useState();
  const [m_floor, setM_floor] = useState();

  const [floor, setFloor] = useState([]);
  const [togleBtn, setTogleBtn] = useState('2');

  const getdata = async () => {
    const response = await axios.get('http://localhost:8081/api/planList');
    setUser(response.data);

    const response2 = response.data.filter(function (element) {
      return element.floor === togleBtn;
    });
    setFloor(response2);

    console.log('floor층수', response2);
  };

  useEffect(() => {
    getdata();
  }, [togleBtn]);

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

  const onChange_M = () => {
    setModify_state(!modify_state);
  };

  // const infoDelete = (clickInfo) => {
  //   if(window.confirm(`삭제 '${clickInfo.event.title}'`)){

  //     axios.delete(`http://localhost:8081/api/planDelete/${clickInfo.event.id}`)
  //   }
  //     window.location.replace("/")
  //   }

  const handleEventClick = (clickInfo) => {
    // <Modify title={clickInfo.event.title} start_time={clickInfo.event.start_time} end_time={clickInfo.event.end_time} people={clickInfo.event.people} content={clickInfo.event.content} bgcolor={clickInfo.event.bgcolor} floor={clickInfo.event.floor}/>
    setModify_state(!modal_state);
    setM_id(clickInfo.event.id);
    setM_title(clickInfo.event.title);
    setM_people(clickInfo.event.people);
    setM_bgcolo(clickInfo.event.bgcolor);
    setM_content(clickInfo.event.content);
    setM_floor(clickInfo.event.floor);
  };
  console.log(m_people);

  // if (window.confirm(`삭제 '${clickInfo.event.title}'`)) {
  //   axios
  //     .delete(`http://localhost:8081/api/planDelete/${clickInfo.event.id}`)
  //     .then(function (res) {
  //       window.location.replace("/")
  //     })
  //     .catch(function (error) {
  //       console.log('delErr', error);
  //     });
  // }
  // console.log('handleEventClick', clickInfo);

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
      <input
        type='radio'
        value='2'
        checked={togleBtn === '2'}
        onChange={(event) => {
          setTogleBtn(event.target.value);
        }}
      />

      <label form='2'>2층</label>

      <input
        type='radio'
        value='3'
        checked={togleBtn === '3'}
        onChange={(event) => {
          setTogleBtn(event.target.value);
        }}
      />
      <label form='3'>3층</label>
      <InputInfo
        modal_state={modal_state}
        startStr={startStr}
        endStr={endStr}
        onChange={onChange}
      />

      <Modify
        modify_state={modify_state}
        onChange={onChange_M}
        id={m_id}
        title={m_title}
        people={m_people}
        content={m_content}
        bgcolor={m_bgcolor}
        floor={m_floor}
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
          people: user.people,
          id: user.id,
          title: user.title,
          start: user.start_time,
          end: user.end_time,
          backgroundColor: user.bgcolor,
          borderColor: user.bgcolor,
        }))}
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
