import React from 'react';
import { useEffect, useState } from 'react';
import './Calendardropdown.css';
const Calendardropdown = (props) => {
  const tapList = [
    { day: '월', view: 'dayGridMonth' },
    { day: '주', view: 'timeGridWeek' },
    { day: '목록', view: 'listWeek' },
  ];
  const [selTapList, setselTapList] = useState('주');
  const [iActive, setActive] = useState(false);

  const active = () => {
    setActive(!iActive);
  };
  return (
    <div>
      <div className='dayDropDownBox'>
        <ul className='calDayDropDown' onClick={active}>
          {selTapList}
          <label className='calDayDropDownArrow'></label>
          {iActive &&
            tapList.map((c) => (
              <li
                className='calDayDropDownLi'
                onClick={() => {
                  const calendarApi = props.change.current.getApi();
                  setselTapList(c.day);
                  calendarApi.changeView(c.view);
                }}
                key={c.day}
              >
                {c.day}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Calendardropdown;
