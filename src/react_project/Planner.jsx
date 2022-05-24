import React, { useEffect, useRef, useState } from 'react';
import FullCalendar, { CalendarApi, formatDate } from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import CalDatePicker from './CalDatePicker';

const Planner = (props) => {
  const [floorStatus, setFloorStatus] = useState('2');
  const [weekendActive, setWeekendActive] = useState(false);
  const [isDatePickerOpen, setisDatePickerOpen] = useState(false);
  
  const calendarComponentRef = useRef();
  const datePicker = useRef();

  useEffect(() => {
    document.addEventListener('mousedown', clickDatePickerOutside);
    return () => {
      document.removeEventListener('mousedown', clickDatePickerOutside);
    };
  },[]);
  const clickDatePickerOutside = event => {
    if (isDatePickerOpen && !datePicker.current.contains(event.target) || event.target.title !== '선택 ∇') {
      console.log(event.target.title);
      setisDatePickerOpen(false);
    }
  };

  // 2층 버튼에 활성화 클래스 아이디를 최초 렌더링시에 부여해서 활성화 상태로 만듬
  useEffect(() => {
    document
      .querySelector('.fc-floor2F-button')
      .classList.add('fc-button-active');
  }, []);

  //드래그해서 기간설정
  const handleDateSelect = (selectInfo) => {
    props.inputForm();
    props.setStartStr(selectInfo.startStr);
    props.setEndStr(selectInfo.endStr);
  };
  //일정 클릭

  const handleEventClick = (clickInfo) => {
    props.updateForm();
    props.setPlanStatus(clickInfo.event);
    console.log(clickInfo.event);
  };

  //드래깅 드랍 완료
  const dragAnddrop = (dropInfo) => {
    if (props.passwordCheck(dropInfo.event.extendedProps.password)) {
      props.update(dropInfo.event);
    }
  };

  //이벤트 사이즈 조절
  const eventSizing = (dragInfo) => {
    if (props.passwordCheck(dragInfo.event.extendedProps.password)) {
      props.update(dragInfo.event);
    }
  };

  //PlanList매핑
  const planListMapping = () => {
    const filteredData = props.planList.filter(function (plan) {
      return plan.floor === floorStatus; //층으로 필터링
    });

    //필터링한 데이터를 풀캘린더 이벤트 객체로 변환하여 매핑
    const dataList = filteredData.map((planList) => ({
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
        password: planList.password,
        writer: planList.writer
      },
    }));
    return dataList;
  };

  //공휴일 리스트 매핑
  const holidayListMapping = () => {
    const dataList = props.holidayList.map((holidayList) => ({
      title: holidayList.title,
      start: holidayList.start_time,
      end: holidayList.end_time,
      display: 'background',
      className: 'holiday',
    }));
    return dataList;
  };

  return (
    <div>
      <div className='datepickerBox' ref={datePicker}>
        {isDatePickerOpen && (
          <CalDatePicker
            datePickerRef={datePicker}
            calendarRef={calendarComponentRef}
          />
        )}
      </div>
      <FullCalendar
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          listPlugin,
          googleCalendarPlugin,
        ]}
        ref={calendarComponentRef}
        googleCalendarApiKey={'AIzaSyDuIfK2-Xqvji3V8FC8q9mlXVdX5kYmNEo'}
        locale='ko'
        CustomButtons
        customButtons={{
          floor2F: {
            text: '2층',
            click: function () {
              setFloorStatus('2');
              props.floorChange('2');
              props.refresh();
              if (
                !document
                  .querySelector('.fc-floor2F-button')
                  .classList.contains('fc-button-active')
              ) {
                document
                  .querySelector('.fc-floor2F-button')
                  .classList.add('fc-button-active');
              }
              document
                .querySelector('.fc-floor3F-button')
                .classList.remove('fc-button-active');
            },
          },
          floor3F: {
            text: '3층',
            click: function () {
              setFloorStatus('3');
              props.floorChange('3');
              props.refresh();
              if (
                !document
                  .querySelector('.fc-floor3F-button')
                  .classList.contains('fc-button-active')
              ) {
                document
                  .querySelector('.fc-floor3F-button')
                  .classList.add('fc-button-active');
              }
              document
                .querySelector('.fc-floor2F-button')
                .classList.remove('fc-button-active');
            },
          },

          togleWeekend: {
            text: '주말보기',
            click() {
              setWeekendActive(!weekendActive);
              if (!weekendActive) {
                this.className += ' fc-button-active';
              } else {
                this.className = this.className.replace(
                  ' fc-button-active',
                  ''
                );
              }
            },
          },
          moveDate: {
            text: '선택 ∇',
            click() {
                setisDatePickerOpen(!isDatePickerOpen)  
            },
          },
        }}
        headerToolbar={{
          left: 'prev today next togleWeekend moveDate',
          center: 'title',
          right: 'floor2F,floor3F dayGridMonth,timeGridWeek,listWeek',
        }}
        initialView='timeGridWeek'
        //------------이벤트 리스트 정의---------------
        eventSources={[planListMapping(), holidayListMapping()]}
        //------------설정 값 정리---------------
        eventClick={handleEventClick}
        select={handleDateSelect}
        selectable={true} //드래그 가능 여부
        selectMirror={true}
        slotMinTime={'07:00:00'} //시간 범위 설정
        slotMaxTime={'20:00:00'}
        expandRows={true}
        dayMaxEvents={6}
        weekends={weekendActive}
        eventOverlap={false} //이벤트 겹쳐지기 막음
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

export default Planner;
