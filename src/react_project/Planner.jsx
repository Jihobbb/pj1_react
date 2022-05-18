import React from 'react';
import FullCalendar, { formatDate } from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import googleCalendarPlugin from '@fullcalendar/google-calendar';


const Planner = (props) => {


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
  };

  //드래깅 드랍 완료
  const dragAnddrop = (dropInfo) => {
    if(props.passwordCheck(dropInfo.event.extendedProps.password)){
      props.update(dropInfo.event);
    } 
  };

  //이벤트 사이즈 조절
  const eventSizing = (dragInfo) => {
    if(props.passwordCheck(dragInfo.event.extendedProps.password)){
      props.update(dragInfo.event);
    }    
  };

  //PlanList매핑
  const planListMapping = () => {
    const dataList = props.planList.map((planList) => ({
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
    }));
    return dataList
  };



    return (
    <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin, googleCalendarPlugin]}
        googleCalendarApiKey={'AIzaSyDuIfK2-Xqvji3V8FC8q9mlXVdX5kYmNEo'}
        locale='ko'
        CustomButtons
        customButtons={{
          floor2F:{
            text: '2층',
            click: function() {
              props.floorChange('2')
            }
          },
          floor3F:{
            text: '3층',
            click: function() {
              props.floorChange('3')
            }
          }
        }}

        headerToolbar={{
          left: 'prev floor2F,floor3F next',
          center: 'title',
          right: 'today dayGridMonth timeGridWeek listWeek'
        }}
        initialView='timeGridWeek'
        //------------이벤트 리스트 정의---------------

        eventSources={[
          planListMapping(),
          {
              googleCalendarId: 'qduatr3seur835pk4aolok2900@group.calendar.google.com',
              display: 'background',  
              className:'holiday'
          }
        ]}
      
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
    )
};

export default React.memo(Planner);
