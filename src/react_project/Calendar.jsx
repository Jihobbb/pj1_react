import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FullCalendar, { formatDate } from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import InputInfo from './InputInfo';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Calendar.css';
import Modify from './Modify';

import ToggleButton from 'react-bootstrap/ToggleButton';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

const Calendar = () => {
  const [modal_state, setModal_state] = useState(false);
  const [modify_state, setModify_state] = useState(false);
  const [startStr, setStartStr] = useState('');
  const [endStr, setEndStr] = useState('');
  const [planList, setPlanList] = useState([]);

  const [planData, setData] = useState({
    id: '',
    title: '',
    people: '',
    content: '',
    bgcolor: '',
    floor: '',
  });

  const [togleBtn, setTogleBtn] = useState('2'); //층 상태

  const radios = [
    { name: '2층', value: '2' },
    { name: '3층', value: '3' },
  ];

  //전체 일정 GET
  const getdata = async () => {
    const response = await axios.get('http://localhost:8081/api/planList');
    const plans = response.data.filter(function (element) {
      //층으로 필터링
      return element.floor === togleBtn;
    });
    setPlanList(plans);
  };

  useEffect(() => {
    getdata();
  }, [togleBtn, modal_state, modify_state]);

  //업데이트 API호출
  const updatePlan = (plan) => {
    axios
      .put('http://localhost:8081/api/planUpdate', {
        id: plan.id,
        title: plan.title,
        start_time: plan.start,
        end_time: plan.end,
        people: plan.extendedProps.people,
        content: plan.extendedProps.content,
        bgcolor: plan.backgroundColor,
        floor: plan.extendedProps.floor,
      })
      .then((res) => console.log(res));
  };

  //일정 state 변경
  const setPlanStatus = (Info) => {
    setData({
      id: Info.id,
      title: Info.title,
      people: Info.extendedProps.people,
      content: Info.extendedProps.content,
      bgcolor: Info.backgroundColor,
      floor: Info.extendedProps.floor,
    });
    setStartStr(Info.start);
    setEndStr(Info.end);
  };

  //입력 폼 온오프
  const inputFormControl = () => {
    setModal_state(!modal_state);
  };

  //수정 폼 온오프
  const updateFormControl = () => {
    setModify_state(!modify_state);
  };

  //드래그해서 기간설정
  const handleDateSelect = (selectInfo) => {
    setModal_state(!modal_state);
    setStartStr(selectInfo.startStr);
    setEndStr(selectInfo.endStr);
  };

  //일정 클릭
  const handleEventClick = (clickInfo) => {
    setModify_state(!modal_state);
    setPlanStatus(clickInfo.event);
  };

  //드래깅 드랍 완료
  const dragAnddrop = (dropInfo) => {
    updatePlan(dropInfo.event);
  };

  //이벤트 사이즈 조절
  const eventSizing = (dragInfo) => {
    console.log(dragInfo.event.start);
    updatePlan(dragInfo.event);
  };

  return (
    <div>
      <ButtonGroup className='toggleBtnGroup'>
        {radios.map((radio, idx) => (
          <ToggleButton
            className='toggleBtn'
            key={idx}
            id={`radio-${idx}`}
            type='radio'
            variant={idx % 2 ? 'outline-dark' : 'outline-dark'}
            name='radio'
            value={radio.value}
            checked={togleBtn === radio.value}
            onChange={(e) => setTogleBtn(e.currentTarget.value)}
          >
            {radio.name}
          </ToggleButton>
        ))}
      </ButtonGroup>

      {/* 입력폼 Props */}
      <InputInfo
        modal_state={modal_state}
        start={startStr}
        end={endStr}
        floorStatus={togleBtn}
        onChange={inputFormControl}
      />

      {/* 수정폼 Props */}
      <Modify
        modify_state={modify_state}
        onChange={updateFormControl}
        plan={planData}
        start={startStr}
        end={endStr}
      />

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin, googleCalendarPlugin]}
        googleCalendarApiKey={'AIzaSyDuIfK2-Xqvji3V8FC8q9mlXVdX5kYmNEo'}
        locale='ko'
        businessHours={true} // 주말 색깔 블러 처리
        headerToolbar={{
          left: 'prev',
          center: 'title',
          right: 'today dayGridMonth timeGridWeek listWeek next',
        }}
        initialView='timeGridWeek'
        //------------이벤트 리스트 정의---------------
        events={
//** 
          {
            googleCalendarId: 'ko.south_korea#holiday@group.v.calendar.google.com',
          }
/*/
          planList.map((planList) => ({
          id: planList.id,
          title: planList.title,
          start: planList.start_time,
          end: planList.end_time,
          backgroundColor: planList.bgcolor,
          borderColor: planList.bgcolor,
          extendedProps: {
            people: planList.people,
            content: planList.content,
            floor: planList.floor,
          },
        }))
//*/
      }
        //------------설정 값 정리---------------
        eventClick={handleEventClick}
        select={handleDateSelect}
        selectable={true} //드래그 가능 여부
        selectMirror={true}
        dayMaxEvents={6}
        weekends={false}
        dayMaxEventRows={true}
        //------------드래깅으로 수정--------------
        editable={true} // 수정 가능
        eventStartEditable={true}
        eventResizableFromStart={true}
        droppable={true}
        eventDrop={dragAnddrop} //일정 옮겨서 떨어뜨릴 때 발생
        eventResize={eventSizing} //일정을 크기조절하여 기간 변경 시 발생
      />
    </div>
  );
};

export default Calendar;
