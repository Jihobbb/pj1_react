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
    id: '',
    title: '',
    people: '',
    content: '',
    bgcolor: '',
    floor: '',
  });

  const [togleBtn, setTogleBtn] = useState('2'); //층 상태

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
  }, [togleBtn,modal_state,modify_state]);

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

  //달력에 보이는 일정 설정
  function renderEventContent(eventInfo) {
    return (
      <>
        <b>{eventInfo.timeText}</b> : <i>{eventInfo.event.title}</i>
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
            floor: planList.floor,
          },
        }))}
        //------------설정 값 정리---------------
        eventClick={handleEventClick}
        select={handleDateSelect}
        selectable={true} //드래그 가능 여부
        selectMirror={true}
        eventContent={renderEventContent}
        dayMaxEvents={true}
        weekends={false}
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
