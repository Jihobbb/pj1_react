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
import { click } from '@testing-library/user-event/dist/click';

const Calendar = () => {
  const [modal_state, setModal_state] = useState(false);
  const [modify_state, setModify_state] = useState(false);
  const [startStr, setStartStr] = useState('');
  const [endStr, setEndStr] = useState('');
  const [refresh, setRefresh] = useState(true); // 작업에 실패했는데도 화면에 남아있는 결과값을 새로고침

  const [planList, setPlanList] = useState([]);
  const [planData, setData] = useState({
    id: '',
    title: '',
    people: '',
    content: '',
    bgcolor: '',
    floor: '',
    password:'',
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
  }, [togleBtn, modal_state, modify_state, refresh]);

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
      password: Info.extendedProps.password
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

  //비밀번호 체크
  const passwordCheck = (password) => {
    const pwCheck = prompt("비밀번호를 입력하세요.");
    if(pwCheck === password) {
      return true;
    }else if(pwCheck === null){           //취소버튼 눌렀을 경우
      return false;
    } else {
      alert("비밀번호가 일치하지 않습니다.")
      return false;
    }
  }

  //드래깅 드랍 완료
  const dragAnddrop = (dropInfo) => {
    if(passwordCheck(dropInfo.event.extendedProps.password)){
      updatePlan(dropInfo.event);
    } else {
      setRefresh(!refresh) 
    }
  };

  //이벤트 사이즈 조절
  const eventSizing = (dragInfo) => {
    if(passwordCheck(dragInfo.event.extendedProps.password)){
      updatePlan(dragInfo.event);
    } else {
      setRefresh(!refresh) 
    }   
  };

  return (
    <div>
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
        pwCheck = {passwordCheck}
      />

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin, googleCalendarPlugin]}
        googleCalendarApiKey={'AIzaSyDuIfK2-Xqvji3V8FC8q9mlXVdX5kYmNEo'}
        locale='ko'
        //CustomButtons
        customButtons={{
          floor2F:{
            text: '2층',
            click: function() {
              setTogleBtn('2')
            }
          },
          floor3F:{
            text: '3층',
            click: function() {
              setTogleBtn('3')
            }
          }
        }}

        headerToolbar={{
          left: 'prev floor2F,floor3F next',
          center: 'title',
          right: 'today dayGridMonth timeGridWeek listWeek',
        }}
        initialView='timeGridWeek'
        //------------이벤트 리스트 정의---------------
        events={
//** 
          {
            googleCalendarId: 'ko.south_korea#holiday@group.v.calendar.google.com',
            display: 'background',
            textColor:'white'
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
            password: planList.password
          },
        }))
//*/
      }
      
        //------------설정 값 정리---------------
        eventClick={handleEventClick}
        select={handleDateSelect}
        selectable={true} //드래그 가능 여부
        selectMirror={true}

        slotMinTime = {'07:00:00'}  //시간 범위 설정
        slotMaxTime = {'20:00:00'}  
        expandRows={true}

        dayMaxEvents={6}
        weekends={false}
        eventOverlap={false}  //이벤트 겹쳐지기 막음
        selectOverlap={false} //등록시에도 겹쳐지지 않음
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
