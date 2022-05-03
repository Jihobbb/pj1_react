// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import FullCalendar, { formatDate } from '@fullcalendar/react'; // must go before plugins
// import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
// import timeGridPlugin from '@fullcalendar/timegrid';
// import interactionPlugin from '@fullcalendar/interaction';
// import { createEventId } from './event-utils';
// import Modal from 'react-modal';
// import InputInfo from './InputInfo'

// const Calendar = () => {
//   let str = formatDate(new Date(), {
//     month: 'long',
//     year: 'numeric',
//     day: 'numeric',
//   });

//   useEffect(() => {
//     const getdata = async () => {
//       const response = await axios.get('http://localhost:8081/api/planList');

//       console.log('res2', response);
//     };
//     getdata();
//   }, []);

//   axios
//     .get('http://localhost:8081/api/planList')
//     .then((Response) => {
//       console.log('res', Response);
//     })
//     .catch((Error) => {
//       console.log('getError', Error);
//     });

//   const handleDateClick = (selectInfo) => {
//     let title = prompt('일정 :');
//     // title 값이 있을때, 화면에 calendar.addEvent() json형식으로 일정을 추가
//     let calendarApi = selectInfo.view.calendar;
//     calendarApi.unselect(); // clear date selection
//     // alert('Date: ' + selectInfo.dateStr); // 선택날짜
//     if (title) {
//       calendarApi.addEvent(
//         axios
//           .post('http://localhost:8081/api/planSave', {
//             id: createEventId(),
//             title: title,
//             start_time: selectInfo.dateStr,
//             end_time: selectInfo.dateStr,
//             allDay: selectInfo.allDay,
//           })
//           .then(function (res) {
//             // 그러면
//             console.log(res);
//           })
//           .catch(function (error) {
//             //에러
//             console.log('postError', error);
//           })
//       );
//     }
//     // change the day's background color just for fun
//     // info.dayEl.style.backgroundColor = 'red';
//   };

//   const handleEventClick = (clickInfo) => {
//     if (window.confirm(`삭제 '${clickInfo.event.title}'`)) {
//       clickInfo.event.remove();
//     }
//     console.log('handleEventClick', clickInfo);
//   };

//   return (
//     <div>
//       <FullCalendar
//         plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
//         locale='ko'
//         businessHours={true} // 주말 색깔 블러 처리
//         weekends={false} //주말 볼지 말지
//         headerToolbar={{
//           left: 'prev',
//           center: 'title',
//           right: 'today dayGridMonth, timeGridWeek, next',
//         }}
//         initialView='timeGridWeek'
//         ///////////////////////////////
//         events={axios.get('http://localhost:8081/api/planList')}
//         ////////////////////////////////

//         dateClick={handleDateClick}
//         eventClick={handleEventClick}
//         editable={true} // 수정 ?
//         selectable={true} //드래그 가능
//         selectMirror={true}
//         // 이벤트명 : function(){} : 각 날짜에 대한 이벤트를 통해 처리할 내용..
//         dayMaxEvents={true}
//         weekends={false} //주말
//       />
//     </div>
//   );
// };

// export default Calendar;





















import React, { useState } from 'react'
import FullCalendar, { formatDate } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { INITIAL_EVENTS, createEventId } from './event-utils'
import axios from 'axios'
import InputInfo from './InputInfo'
import Modal from 'react-modal';
import "./Calendar.css"

axios.defaults.withCredentials = true;

export default class Calendar extends React.Component {
  state = {
    weekendsVisible: true,
    currentEvents: [],
    modal_state : false,
  }
  
  onChange = () => {
    this.setState ({
      modal_state : !this.state.modal_state
    })
    
  }

  render() {
    return (
      <div className='demo-app'>
        {this.renderSidebar()}
        <div className='demo-app-main'>
          <InputInfo modal_state = {this.state.modal_state} onChange={this.onChange}/>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            locale="ko"
            businessHours={true} // 주말 색깔 블러 처리
            headerToolbar={{
              left: 'prev',
              center: 'title',
              right: 'today dayGridMonth, timeGridWeek, next',
              
            }}
            initialView='timeGridWeek'
            views={{
              dayGridMonth: {
                titleFormat: { year: "numeric", month: "short" },
              },
              week: {
                titleFormat: { year: "numeric", month: "short" },
              },
            }}
            
            editable={true}
            selectable={true}
            selectMirror={true}
            // 이벤트명 : function(){} : 각 날짜에 대한 이벤트를 통해 처리할 내용..
            dayMaxEvents={true}
            weekends={this.state.weekendsVisible}
            initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
            select={this.handleDateSelect}
            eventContent={renderEventContent} // custom render function
            eventClick={this.handleEventClick}
            eventsSet={this.handleEvents}
             // called after events are initialized/added/changed/removed
            /* you can update a remote database when these fire:
            eventAdd={function(){}}
            eventChange={function(){}}
            eventRemove={function(){}}
            */
          />
          
        </div>
        
      </div>
    )
  }

  renderSidebar() {
    return (
      <div className='demo-app-sidebar'>
        <div className='demo-app-sidebar-section'>
          <h2>사용방법</h2>
          <ul>
            <li>날짜를 선택하면 새 이벤트를 생성하라는 메시지가 표시됩니다.</li>
            <li>이벤트 드래그, 드롭 및 크기 조정</li>
            <li>삭제할 이벤트 클릭</li>
          </ul>
        </div>

        {/* 주말 생성 제거 토글 */}
        <div className='demo-app-sidebar-section'>
          <label>
            <input
              type='checkbox'
              checked={this.state.weekendsVisible}
              onChange={this.handleWeekendsToggle}
            ></input>
            toggle weekends
          </label>
        </div>
        <div className='demo-app-sidebar-section'>
          <h2>모든 일정 ({this.state.currentEvents.length})</h2>
          <ul>
            {this.state.currentEvents.map(renderSidebarEvent)}
          </ul>
        </div>
      </div>
    )
  }

  handleWeekendsToggle = () => {
    this.setState({
      weekendsVisible: !this.state.weekendsVisible
    })
  }

  

  handleDateSelect = () => {
    this.setState({
      modal_state : !this.state.modal_state
    })


  }



//     let title = prompt('가나다라 :')
//     // title 값이 있을때, 화면에 calendar.addEvent() json형식으로 일정을 추가
//     let calendarApi = selectInfo.view.calendar
//     calendarApi.unselect() // clear date selection

    
    

//  if (title) {
//       calendarApi.addEvent(
//         axios
//           .post("/cal/insertInfo", {
//             id: createEventId(),
//             title: title,
//             start: selectInfo.startStr,
//             end: selectInfo.endStr,
//             allDay: selectInfo.allDay,
//             // color : InputInfo.select_color
//           }, )
//           .then(function (res) {
//             // 그러면
//             console.log(res);
//           })
//           .catch(function (error) {
//             //에러
//             console.log("error",error);
//           })
//       );
//       console.log("asds", selectInfo.title);
//     }
//   };
  





  handleEventClick = (clickInfo) => {
    if (confirm(`삭제하시겠습니까? '${clickInfo.event.title}'`)) {
      clickInfo.event.remove()
    }
    console.log("asd",clickInfo);
  }

  handleEvents = (events) => {
    this.setState({
      currentEvents: events
    })
  }

}


function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}

function renderSidebarEvent(event) {
  return (
    <li key={event.id}>
      <b>{formatDate(event.start, {year: 'numeric', month: 'short', day: 'numeric'})}</b>
      <i>{event.title}</i>
    </li>
  )
}

