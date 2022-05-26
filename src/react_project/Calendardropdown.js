import React from 'react';
import { useEffect, useState } from 'react';
import './Calendardropdown.css';
const Calendardropdown = (props) => {
  const tapList = [{ color: '월' }, { color: '주' }, { color: '리스트' }];
  const [selTapList, setselTapList] = useState('test');
  const [iActive, setActive] = useState(false);

  const active = () => {
    setActive(!iActive);
  };
  return (
    <div>
      <div>
        <ul className='calDayDropDown' onClick={active}>
          {selTapList}
          <label className='calDayDropDownArrow'></label>
          {iActive &&
            tapList.map((c) => (
              <li
                className='calDayDropDownLi'
                onClick={() => {
                  setselTapList(c.color);
                }}
                key={c.color}
              >
                {c.color}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Calendardropdown;
