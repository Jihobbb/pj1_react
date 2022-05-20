import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './CalDatePicker.css';
import { ko } from 'date-fns/esm/locale';

const CalDatePicker = (props) => {
  return (
    <DatePicker
      onChange={(date) => {
        const calendarApi = props.calendarRef.current.getApi();
        calendarApi.gotoDate(date);
      }}
      dateFormat='yyyy-MM-dd'
      locale={ko}
      inline
    />
  );
};

export default CalDatePicker;
