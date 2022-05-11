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
  const [planList, setPlanList] = useState([]);

  const [planData, setData] = useState({
    id:"",
    title: "",
    people:"",
    content:"",
    bgcolor:"",
    floor:""
  })

  const [togleBtn, setTogleBtn] = useState('2');

  const getdata = async () => {
    const response = await axios.get('http://localhost:8081/api/planList');
    const plans = response.data.filter(function (element) {
      return element.floor === togleBtn;
    });
    setPlanList(plans);
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

  const handleEventClick = (clickInfo) => {
    setModify_state(!modal_state);
    setData({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      people:clickInfo.event.extendedProps.people,
      content:clickInfo.event.extendedProps.content,
      bgcolor:clickInfo.event.backgroundColor,
      floor:clickInfo.event.extendedProps.floor
    });
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

{/* 입력폼 Props */}
      <InputInfo
        modal_state={modal_state}
        startStr={startStr}
        endStr={endStr}
        onChange={onChange}
      />

{/* 수정폼 Props */}
      <Modify
        modify_state={modify_state}
        onChange={onChange_M}
        plan = {planData}
        start={startStr}
        end={endStr}
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

//------------이벤트 리스트 정의---------------
        events={planList.map((planList) => ({
          id: planList.id,
          title: planList.title,
          start: planList.start_time,
          end: planList.end_time,
          backgroundColor: planList.bgcolor,
          borderColor: planList.bgcolor,
          extendedProps: {
            people: planList.people,
            content: planList.content,
            floor: planList.floor
          }
        }))}

//------------플러그인 정리---------------
        eventClick={handleEventClick}
        select={handleDateSelect}
        editable={false} // 수정 가능 여부
        selectable={true} //드래그 가능 여부
        selectMirror={true}
        eventContent={renderEventContent}
        dayMaxEvents={true}
        weekends={false} 
      />
    </div>
  );
};

export default Calendar;
